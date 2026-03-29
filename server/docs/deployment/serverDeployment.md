# Server Deployment: Backend to Google Cloud Run

This document outlines the automated Continuous Integration and Continuous Deployment (CI/CD) pipeline for our backend application in **cloud-run-deploy.yml**. The deployment process is split into two parts: a GitHub Actions workflow that handles authentication, and a Google Cloud Build configuration that builds the container, runs database migrations, and deploys the service to Cloud Run.

## Part 1: GitHub Actions Workflow

This workflow acts as the trigger and authenticator for the deployment process.

* **Trigger:** The deployment automatically runs whenever code is pushed or merged into the `main` branch.
* **Environment:** The job runs in an `ubuntu-latest` runner and targets the `prod` environment.
* **Authentication:** Uses the `google-github-actions/auth@v2` action to authenticate securely with Google Cloud using a Service Account Key (`GCP_SA_KEY`).
* **Handoff:** After setting up the `gcloud` CLI, it triggers the heavy lifting by submitting the `server/cloudbuild.yaml` configuration to Google Cloud Build.

## Part 2: Google Cloud Build Pipeline (cloudbuild.yaml)

Once triggered by GitHub Actions, Google Cloud Build executes the following steps in order within the `server` directory:

1. **Build Container Image:** Uses Docker to build a container image of the backend application and tags it for the Google Container Registry (GCR).
2. **Push Container Image:** Uploads the newly built Docker image to GCR (`gcr.io/$PROJECT_ID/trail-pgh-server`).
3. **Deploy Migration Job:** Creates or updates a Cloud Run Job (`trail-pgh-db-migrate`) designed specifically to run `npx prisma migrate deploy`. It connects to the Cloud SQL production database and securely injects the `DATABASE_URL` secret.
4. **Execute Migration:** Runs the previously deployed Cloud Run Job and waits for it to finish, ensuring the database schema is fully updated before the new app version goes live.
5. **Deploy Application:** Deploys the container image to Cloud Run as a managed service (`trail-pgh-server`). This step allows unauthenticated public access, connects the Cloud SQL proxy, sets `NODE_ENV=production`, and injects all necessary runtime secrets from Google Cloud Secret Manager.

## Required Secrets and Configuration

To ensure a successful deployment, the following secrets must be configured across GitHub and Google Cloud:

**GitHub Actions Secrets:**
* `GCP_SA_KEY`: A JSON key for a Google Cloud Service Account with permissions to trigger Cloud Build, push to GCR, and deploy to Cloud Run.
* `PROJECT_ID`: The Google Cloud project ID.

**Google Cloud Secret Manager:**
The Cloud Run service requires the following secrets to be populated in Google Cloud Secret Manager so they can be injected as environment variables:
* `DATABASE_URL`
* `TRAIL_ISSUE_IMAGE_BUCKET`
* `CLIENT_URL`
* `GOOGLE_CLIENT_ID`
* `GOOGLE_CLIENT_SECRET`
* `SERVER_URL`
* `JWT_SECRET`