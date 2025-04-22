#!/bin/sh

# Run migrations
echo "Running database migrations..."
npx prisma migrate deploy --schema=/app/prisma/schema.prisma

# Start the application
echo "Starting the application..."
exec npm start 