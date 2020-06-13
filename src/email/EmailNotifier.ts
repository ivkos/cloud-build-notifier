import { google } from "@google-cloud/cloudbuild/build/protos/protos"
import IBuild = google.devtools.cloudbuild.v1.IBuild

export interface EmailNotifier {
    notifyWithEmail(build: IBuild): Promise<void>
}

export namespace EmailNotifier {
    export function parseMailList(list: string): { email: string }[] {
        return list
            .split(",")
            .map(str => str.trim())
            .map(str => ({ email: str }))
    }
}
