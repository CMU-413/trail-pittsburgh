# Express Server

## Getting Started

Follow these steps to set up and run the Express server:

1. **Navigate to the server directory:**

    ```sh
    cd server
    ```

2. **Install dependencies:**

    ```sh
    npm install
    ```

3. **Set up the database:**

    ```sh
    npx prisma generate
    npx prisma migrate dev
    npm run seed
    ```

    If there is an issue with running the seed file, you may need to run: 
    ```
    npx prisma db push
    ```

4. **Start the development server:**

    ```sh
    npm run dev
    ```

5. **Verify the server is running:**

   Open your browser and go to [http://localhost:3000/health](http://localhost:3000/health).  
   You should see a response similar to:

    ```json
    { "status": "ok" }
    ```