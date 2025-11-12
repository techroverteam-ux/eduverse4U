#!/bin/bash

echo "Starting EduVerse Backend Server..."

cd backend

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "Installing dependencies..."
    npm install
fi

# Create uploads directory
mkdir -p uploads/students

# Start the development server
echo "Starting server on port 3001..."
npm run start:dev