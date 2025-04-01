# Step 1: Use the official Node.js runtime image
FROM node:lts-slim

# Step 2: Set the working directory in the container
WORKDIR /usr/src/app

# Step 3: Copy the package.json and package-lock.json files to install dependencies
COPY server/package*.json ./

# Step 4: Install dependencies
RUN npm install

# Step 5: Copy the TypeScript source code (only if you plan to compile in the container)
COPY server/src/ ./server/src/

# Step 6: Compile TypeScript to JavaScript (you can also use a local build step for this instead)
RUN npx tsc

# Step 7: Copy only the compiled JavaScript files (the `dist/` folder)
COPY server/dist/ ./server/dist/

# Step 8: Expose the port your Express app will run on
EXPOSE 8080

# Step 9: Start the Express app (run the compiled JavaScript)
CMD ["node", "server/dist/server.js"]
