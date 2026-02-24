# Express Server

## Getting Started

This guide walks you through setting up and running the Express server **locally for development and testing**.

### 1. Navigate to the server directory:

```sh
cd server
```

### 2. Install dependencies:

```sh
npm install
```

### 3. Set up the database:

- Download and install **PostgreSQL v17** from [https://www.postgresql.org/download/](https://www.postgresql.org/download/)
    - During installation, set a password for the default `postgres` user and remember it.
    - After installation, PostgreSQL should be running as a service on your machine.

- Download and install **pgAdmin 4 v9.1** from [https://www.pgadmin.org/download/](https://www.pgadmin.org/download/)

- Open pgAdmin and connect to the PostgreSQL server:
    - Use `localhost` as the host.
    - Use `postgres` as the username.
    - Enter the password you set during installation.

- In pgAdmin, create a new database (e.g., `myappdb`):
    - Right-click on "Databases" > "Create" > "Database..."
    - Enter the name and click "Save".

- In the `server` directory, create a `.env` file if it doesn't exist and add the following line:

    ```env
    DATABASE_URL="postgresql://postgres:pass1234@localhost:5432/<name of db in pgadmin>"
    MAILGUN_API_KEY="<your-mailgun-api-key>"
    MAILGUN_DOMAIN="<your-mailgun-domain>"
    MAILGUN_FROM_EMAIL="Trail Pittsburgh <no-reply@<your-mailgun-domain>>"
    MAILGUN_REPLY_TO="alannac@andrew.cmu.edu"
    SERVER_URL="http://localhost:3000"
    ISSUE_NOTIFICATION_UNSUBSCRIBE_SECRET="<random-long-secret>"
    ```

    Replace `<name of db in pgadmin>` with the actual name of the database you just created.

    `ISSUE_NOTIFICATION_UNSUBSCRIBE_SECRET` is optional but recommended. If omitted, the server uses `JWT_SECRET`.

- Run the following commands:

    ```sh
    npx prisma generate
    npx prisma migrate dev
    npm run seed
    ```

    If there is an issue with running the seed file, you may need to run: 

    ```sh
    npx prisma db push
    ```

### 4. Start the development server:

```sh
npm run dev
```

### 5. **Verify the server is running:**

   Open your browser and go to [http://localhost:3000/api/parks/](http://localhost:3000/api/parks/)  
   You should see a response similar to:
```json
{"parks":[
    {"parkId":1,"name":"Alameda Park","county":"Butler","isActive":true,"createdAt":"2025-05-02T04:13:04.102Z"},
    {"parkId":2,"name":"Bavington","county":"Washington","isActive":true,"createdAt":"2025-05-02T04:13:04.102Z"} ...]
}
```

## Testing

Use the following commands to run tests:

```sh
npm run test             # Run all tests
npm run test:unit        # Run only unit tests
npm run test:integration # Run only integration tests
```