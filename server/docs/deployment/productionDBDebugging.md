# Debugging Production Database Issues

Follow these steps to diagnose and resolve issues with the production database.

1. **Check the Logs:**
   Open Google Cloud Logging to identify the type of issue you are facing. Look specifically for errors related to migration, connections, or runtime exceptions.

2. **Choose an Approach:**
   * **Simple issues:** Use the SQL editor provided in the Cloud SQL console. *(No need to continue with the rest of this guide).*
   * **Complex issues:** Connect locally via the Cloud SQL proxy. *(Continue to Step 3).*

3. **Setup (If Needed):**
   If you haven't already, download and install the Google Cloud SDK and Cloud SQL Proxy. Run the following commands in your terminal:
   ```bash
   brew install --cask google-cloud-sdk
   echo 'export PATH=/opt/homebrew/share/google-cloud-sdk/bin:"$PATH"' >> ~/.zshrc
   source ~/.zshrc
   brew install cloud-sql-proxy
   ```

4. **Authenticate Locally:**
   Log in to the Google Cloud CLI. Make sure to log in with an email account that has access to the target Google Cloud project:
   ```bash
   gcloud auth application-default login
   ```

5. **Connect via Cloud SQL Proxy:**
   Create a secure local tunnel to the production database:
   ```bash
   cloud-sql-proxy trail-pgh-issue-tracker:us-central1:trail-pgh-prod --port 5433
   ```
   *Note: This gives you local access to the production database. Leave this terminal window open and running. Open a **new** terminal window for the following steps. Feel free to change the port if `5433` is already in use.*

6. **Set your Database URL:**
   In your new terminal window, point your environment variables to the local proxy:
   ```bash
   export DATABASE_URL="postgresql://{user}:{password}@localhost:5433/{database_name}"
   ```
   *Note: Replace `{user}`, `{password}`, and `{database_name}` with the correct credentials, which can be found in our internal documentation.*

7. **Execute Prisma Commands:**
   Depending on your issue, run one of the following commands:
   
   **For data modification:**
   To manually adjust database entries, open Prisma Studio (this will launch a web interface):
   ```bash
   npx prisma studio
   ```
   
   **For migration problems:**
   Try resolving the migration conflict manually first. 
   
   > **⚠️ WARNING: LAST RESORT**
   > If manual resolution is impossible, you can reset the database. **This command will permanently delete all data.**
   > ```bash
   > # Drops the database, recreates it, and runs migrations
   > npx prisma migrate reset
   > 
   > # (Optional) Generate initial seed data
   > npx ts-node src/prisma/seed.ts
   > ```
