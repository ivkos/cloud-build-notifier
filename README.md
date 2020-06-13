# Cloud Build Notifier

Function for [Google Cloud Functions](https://cloud.google.com/functions) 
that listens on [Cloud Build](https://cloud.google.com/cloud-build)'s 
pub/sub topic for build status updates, and sends email via [SendGrid](https://sendgrid.com).


## Deploy
1. [Obtain an API key for SendGrid](https://sendgrid.com/docs/ui/account-and-settings/api-keys/).
2. Configure the function name, the region, the pub/sub topic, and the environment variables in the example below.
3. Run the command:

```bash
gcloud functions deploy \
    cloud-build-notifier \
    --region=europe-west1 \
    --trigger-topic=cloud-builds \
    --source=. \
    --entry-point=handleEvent \
    --runtime=nodejs10 \
    --memory=128MB \
    --update-env-vars='EMAIL_FROM=builds@example.com,EMAIL_TO=you@example.com,SENDGRID_API_KEY=very.secret'
```
