# Client Deployment: React to Firebase Hosting

This document outlines the automated Continuous Integration and Continuous Deployment (CI/CD) pipeline for our React frontend application in **deploy-client.yml**. We use GitHub Actions to automatically build and deploy the client to Firebase Hosting.

## Workflow Overview

The workflow is defined in the GitHub Actions configuration and handles the entire deployment process from start to finish. 

* **Trigger:** The deployment automatically runs whenever code is pushed or merged into the `main` branch.
* **Environment:** The job runs in an `ubuntu-latest` runner and targets the `prod` environment in GitHub.

## Deployment Steps

When triggered, the workflow executes the following steps in order:

1. **Checkout Code:** Uses `actions/checkout@v4` to pull the latest source code from the repository onto the runner.
2. **Install Dependencies:** Navigates into the `client` directory and runs `npm ci` to perform a clean, reliable installation of all required Node modules based on the `package-lock.json`.
3. **Build React App:** Navigates into the `client` directory and runs `npm run build` (using Vite) to compile the React application into static assets. During this step, the `VITE_API_URL` environment variable is injected from GitHub Secrets so the frontend knows where to securely contact our backend.
4. **Deploy to Firebase Hosting:** Uses the official `FirebaseExtended/action-hosting-deploy` action to push the compiled production build to Firebase. It targets the `live` channel, effectively releasing the new code to production.

## Required GitHub Secrets

For this workflow to run successfully, the following secrets must be configured in the repository's settings (under **Settings > Secrets and variables > Actions**):

* `VITE_API_URL`: The base URL for the production backend API.
* `FIREBASE_SERVICE_ACCOUNT`: A JSON key for a Google Cloud Service Account with permissions to deploy to Firebase Hosting.
* `PROJECT_ID`: The specific Firebase/Google Cloud project ID where the app is hosted.
* *(Note: `GITHUB_TOKEN` is automatically provided by GitHub Actions and does not need to be manually configured).*
