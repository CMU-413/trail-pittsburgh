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
        DATABASE_URL="postgresql://user:password@host:port/database"
        PROJECT_ID="your-gcp-project-id"
        SERVICE_ACCOUNT_KEY="your-service-account-key-secret-name"
        PORT=3000
        NODE_ENV=development
        ```
        Ensure you have set up the **PROJECT_ID** and **SERVICE_ACCOUNT_KEY** in Google Cloud Secret Manager.

    *   **Client:** Create a `.env.local` file in the `client` directory and configure the following variable (example):
        ```
        VITE_GOOGLE_CLIENT_ID="your-google-oauth-client-id"
        VITE_API_BASE_URL="http://localhost:3000/api" # Adjust if your server runs on a different port
        ```
        Obtain your **Google OAuth 2.0 Client ID** from the Google Cloud Console.

5.  **Set up the Database:**

    *   Create a PostgreSQL database.
    *   Update the `DATABASE_URL` in your server `.env` file with your database connection details.
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

## **Contributions**

*   **Xinyi Chen**: xinyic2@andrew.cmu.edu
*   **Vicky Chen**: vickyc@andrew.cmu.edu
*   **Sen Feng**: senf@andrew.cmu.edu
*   **Matthew Leboffe**: mleboffe@andrew.cmu.edu
*   **Constantine Westerink**: cwesteri@andrew.cmu.edu

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
