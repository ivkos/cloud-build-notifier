import { EmailNotifier } from "./EmailNotifier"
import { google } from "@google-cloud/cloudbuild/build/protos/protos"
import * as SendGrid from "@sendgrid/mail"
import IBuild = google.devtools.cloudbuild.v1.IBuild

export class SendGridEmailNotifier implements EmailNotifier {
    private readonly emailFromName: string
    private readonly emailFrom: string
    private readonly emailTo: string

    constructor() {
        const apiKey = process.env.SENDGRID_API_KEY as string
        if (!apiKey) throw new Error("SENDGRID_API_KEY" + " must be set")
        SendGrid.setApiKey(apiKey)

        this.emailFromName = process.env.EMAIL_FROM_NAME || "Cloud Build Notifier"
        this.emailFrom = process.env.EMAIL_FROM as string
        if (!this.emailFrom) throw new Error("EMAIL_FROM" + " must be set")

        this.emailTo = process.env.EMAIL_TO as string
        if (!this.emailTo) throw new Error("EMAIL_TO" + " must be set")
    }

    async notifyWithEmail(build: IBuild): Promise<void> {
        const skippedStatuses: IBuild["status"][] = ["QUEUED", "STATUS_UNKNOWN"]

        if (skippedStatuses.includes(build.status)) {
            console.log(`Skipping email notification for status '${build.status}'`)
            return
        }

        await SendGrid.send({
            from: { name: this.emailFromName, email: this.emailFrom },
            to: this.getRecipients(),
            subject: this.getSubjectLine(build),
            text: `View logs:\n${build.logUrl}`,
            html: `<a href="${build.logUrl}">Click here to view logs...</a>`
        })
    }

    private getSubjectLine(build: IBuild): string {
        return `${this.getStatusEmoji(build)} ${this.getBuildName(build)} ${this.getStatusDescription(build)}`.trim()
    }

    private getBuildName(build: IBuild): string {
        let name = ""

        name += build?.substitutions?.REPO_NAME || ""
        name += " " + build?.substitutions?.SHORT_SHA || ""
        name = name.trim()

        if (!name) {
            return build.id as string
        }

        return name
    }

    private getRecipients(): { email: string }[] {
        return EmailNotifier.parseMailList(this.emailTo)
    }

    private getStatusEmoji(build: IBuild): string {
        const map: Record<string, string> = {
            "STATUS_UNKNOWN": "❓",
            "QUEUED": "🕒",
            "WORKING": "🔨",
            "SUCCESS": "🟢",
            "FAILURE": "🔴",
            "INTERNAL_ERROR": "🔶",
            "TIMEOUT": "⌛",
            "CANCELLED": "✋",
            "EXPIRED": "⏳",
        }

        return map[build.status as string] || ""
    }

    private getStatusDescription(build: IBuild): string {
        const map: Record<string, string> = {
            "STATUS_UNKNOWN": "has unknown status",
            "QUEUED": "was queued",
            "WORKING": "is building",
            "SUCCESS": "built successfully",
            "FAILURE": "failed building",
            "INTERNAL_ERROR": "failed due to internal error",
            "TIMEOUT": "timed out",
            "CANCELLED": "was cancelled",
            "EXPIRED": "expired",
        }

        return map[build.status as string] || `has status ${build.status}`
    }
}