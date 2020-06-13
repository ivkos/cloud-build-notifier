import "dotenv/config"
import { Context, EventFunction } from "@google-cloud/functions-framework"
import { google as GooglePubSub } from "@google-cloud/pubsub/build/protos/protos"
import { google as GoogleCloudBuild } from "@google-cloud/cloudbuild/build/protos/protos"
import { SendGridEmailNotifier } from "./email/SendGridEmailNotifier"
import IPubsubMessage = GooglePubSub.pubsub.v1.IPubsubMessage
import IBuild = GoogleCloudBuild.devtools.cloudbuild.v1.IBuild

const emailNotifier = new SendGridEmailNotifier()

const handleEvent: EventFunction = async function (pubsubMessage: IPubsubMessage, context: Context) {
    // TODO Remove
    console.debug("pubsubMessage", Buffer.from(JSON.stringify(pubsubMessage)).toString("base64"))
    console.debug("context", Buffer.from(JSON.stringify(context)).toString("base64"))


    if (!pubsubMessage.data) {
        console.warn("No data in message")
        return
    }

    const decodedJson = Buffer.from(pubsubMessage.data as string, "base64").toString()
    const build = JSON.parse(decodedJson) as IBuild

    await emailNotifier.notifyWithEmail(build)
}

exports.handleEvent = handleEvent
