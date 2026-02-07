# Trail Pittsburgh - Trail Issue Tracking System

[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Overview

**Trail Pittsburgh** is an open-source web application designed to help maintain and improve the trail systems in Pittsburgh. It provides a platform for users to **report issues** they encounter on trails, such as obstructions, erosion, or signage problems. The system allows stewards (park leads) and volunteers to **track the progress** of these reported issues and **mark them as resolved** once addressed. This project aims to support community involvement in the upkeep of Pittsburgh's beautiful trails to make them safer and more enjoyable for everyone.

## Key Features

*   **Issue Reporting:** Users can easily report new issues they find on trails, including a description, urgency level, and optional image.
*   **Location Awareness:** The application supports geolocation to pinpoint the location of the reported issue on a map.
*   **Issue Tracking:** Reported issues are tracked with their status (e.g., open, in progress, resolved).
*   **Park and Trail Management:** Administrators can manage information about parks and the trails within them.
*   **User Roles and Permissions:** The system includes different user roles such as owner, steward, and volunteer, with varying levels of access and permissions.
*   **Notifications:** Reporters can choose to be notified about the resolution status of their reported issues.

## Getting Started

To get this project up and running on your local machine, follow these steps:

### Prerequisites

*   **Node.js** (version >= 18)
*   **npm** or **yarn**
*   **PostgreSQL** (recommended, as inferred from the database interactions)
*   **Google Cloud Project** setup with:
    *   **Google Cloud Storage** enabled
    *   **Google Cloud Secret Manager** enabled
    *   **OAuth 2.0 Client IDs** configured for web applications

### Installation

1.  **Clone the repository:**
    ```bash
    git clone
    cd trail-pittsburgh
    ```

2.  **Install server dependencies:**
    ```bash
    cd server
    npm install  # or yarn install
    cd ..
    ```

3.  **Install client dependencies:**
    ```bash
    cd client
    npm install  # or yarn install
    cd ..
    ```

4.  **Configure Environment Variables:**

    *   **Server:** Create a `.env` file in the `server` directory and configure the following variables (example):
        ```
        DATABASE_URL="postgresql://<username>@localhost:5432/trail_pgh"
        PROJECT_ID="trail-pgh-issue-tracker"
        GCS_SERVICE_ACCOUNT_KEY_FILENAME="<full filepath>"
        TRAIL_ISSUE_IMAGE_BUCKET="trail-pgh-issue-images"
        CLIENT_URL="http://localhost:5173"
        PORT=3000
        NODE_ENV=development
        ```
        Steps to get `DATABASE_URL` working correctly:
        ```
        1. brew install postgresql@16
        2. brew --prefix postgresql@16
        3. echo 'export PATH="<output from step 2>/bin:$PATH"' >> ~/.zshrc
        4. source ~/.zshrc
        5. createddb trail_pgh
        6. whoami
        7 DATABASE_URL="postgresql:/[output from step 6]@localhost:5432/trail_pgh"
        ```

        Steps to get value for `GCS_SERVICE_ACCOUNT_KEY_FILENAME`:
        ```
        1. Go to https://console.cloud.google.com/iam-admin/serviceaccounts?referrer=search&authuser=0&hl=en&project=trail-pgh-issue-tracker
        2. Click on trailpgh-service-account@trail-pgh-issue-tracker.iam.gserviceaccount.com
        3. Select `Keys` tab
        4. Select `Add key` -> `Create new key` -> `JSON` -> `Create`
        5. Find the file locally (typically in `Downloads` folder), then move the file to safe place
        6. `GCS_SERVICE_ACCOUNT_KEY_FILENAME="full filepath from step 5"`
        ```

        Ensure you have access to the **PROJECT_ID** and **SERVICE_ACCOUNT_KEY** in Google Cloud Secret Manager.
        
    *   **Client:** Create a `.env.local` file in the `client` directory and configure the following variable (example):
        ```
        VITE_API_URL="http://localhost:3000"
        VITE_GOOGLE_CLIENT_ID="100051830254-ql36m1hdj5mo6u75i7if2qqcnus1osb6.apps.googleusercontent.com"
        ```
        **Google OAuth 2.0 Client ID** was obtained from the Google Cloud Console.

5.  **Set up the Database:**

    *   Create a PostgreSQL database. (should be already done in step 4)
    *   Update the `DATABASE_URL` in your server `.env` file with your database connection details. (should be already done in step 4)
    *   Run Prisma migrations to create the database schema:
        ```bash
        cd server
        npx prisma migrate dev
        npx prisma generate
        cd ..
        ```
    *   Seed the database with initial data (optional, but recommended for development):
        ```bash
        cd server
        npx ts-node src/prisma/seed.ts
        cd ..
        ```

6.  **Configure Google Cloud Storage:**

    *   Ensure you have a Google Cloud Storage bucket created.
    *   The server-side code uses `@google-cloud/storage`, which relies on the service account key configured in Secret Manager to access your storage bucket.

### Running the Application

1.  **Start the server:**
    ```bash
    cd server
    npm run dev  # or yarn dev
    cd ..
    ```
    The server will typically run on `http://localhost:3000`.

2.  **Start the client:**
    ```bash
    cd client
    npm run dev  # or yarn dev
    cd ..
    ```
    The client will typically run on `http://localhost:5173`.

Open your browser to `http://localhost:5173` to access the Trail Pittsburgh application.

## **Architecture**

* **Client**: Single Page App (Vite + React) — UI components, pages, auth context, API client. Entry: main.tsx → App.tsx.
* **Server**: Express-like HTTP API — routes → controllers → services → repositories → Prisma (DB). Entry: server.ts / app.ts.
* **Data flow**: Client `services/api.ts` → HTTP endpoints (`server/routes/*`) → controllers (`server/controllers/*`) → services (`server/services/*`) → repositories (`server/repositories/*`) → Prisma client (prismaClient.ts) → Postgres DB.

## **External services used and how they're used**
* **Google Cloud Storage (GCS)** — via @google-cloud/storage. Used to store issue/profile images and generate signed URLs for upload/download. Implementation: GCSBucket.ts.
* **Google OAuth / Google APIs** — used for user authentication/identity: client uses `@react-oauth/google`, server calls Google userinfo endpoint (googleAuth.ts) and has `google-auth-library` in deps.
* **Google Secret Manager** — dependency (`@google-cloud/secret-manager`) present for storing/retrieving secrets in GCP (server).
* **Cloud Build + Cloud Run + Container Registry** — CI/CD and deployment pipeline defined in cloudbuild.yaml: builds Docker image for server, pushes to Container Registry, and deploys to Cloud Run. See cloudbuild.yaml.
* **Cloud SQL (Postgres)** — referenced in cloudbuild.yaml via `--add-cloudsql-instances`, indicating production DB is a Cloud SQL Postgres instance.
* **Firebase Hosting** — frontend configured for static hosting and SPA rewrites in firebase.json.
* **Prisma / Postgres** — Postgres DB accessed via Prisma client; migrations under migrations.
* **Local/other libs**: `multer` for multipart uploads (server), `exifr` + `heic2any` (client) for image metadata and HEIC conversion on upload.

## **Deployment & infra notes**
* Dockerfile for server builds TypeScript and Prisma client, then runs production image (see Dockerfile).
* cloudbuild.yaml automates build/push/deploy to Cloud Run with Cloud SQL integration.
* `deploy` script in package.json calls `gcloud builds submit`.

## **Security & auth**
* Backend uses JWT tokens (cookie-based) validated in auth.ts.
* OAuth integration with Google (both client and server sides present).
* Secrets expected to be provided through environment variables or Google Secret Manager in production.

## **Contributions**

*   **Xinyi Chen**: xinyic2@andrew.cmu.edu
*   **Vicky Chen**: vickyc@andrew.cmu.edu
*   **Sen Feng**: senf@andrew.cmu.edu
*   **Matthew Leboffe**: mleboffe@andrew.cmu.edu
*   **Constantine Westerink**: cwesteri@andrew.cmu.edu
*   ** Alanna Cao**: alannac@andrew.cmu.edu
*   ** Alondra Robles**: arobles@andrew.cmu.edu
*   ** Christina Trinh**: tchristina1607@gmail.com
*   ** Vicky Zhu**: vickyzhu@andrew.cmu.edu

### Coding Standards

This project uses **ESLint** for JavaScript and TypeScript code linting and formatting. Please ensure your code passes all ESLint checks before submitting a pull request. You can run the linters using the following commands:

```bash
cd server
npm run lint # or yarn lint
cd ../client
npm run lint # or yarn lint
```

## License

This project is licensed under the **MIT License**. See the `LICENSE` file for more information.

## Contact and Support

For any questions, bug reports, or feature requests, please [open an issue](https://github.com/CMU-413/trail-pittsburgh-2025/issues) on the GitHub repository.
