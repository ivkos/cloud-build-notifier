# Cloud Build Notifier

Google Cloud Functions that listens on Cloud Build's pub/sub topic for build status updates,
and sends email via SendGrid.


## Deploy
1. [Obtain API key for SendGrid](https://sendgrid.com/docs/ui/account-and-settings/api-keys/)
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
