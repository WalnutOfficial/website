#!/bin/bash

# Install dependencies
npm install

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
  cp .env.example .env
  echo "Created .env file from .env.example"
  echo "Please update your MongoDB connection string in .env"
fi

# Build TypeScript
npm run build

echo "Setup complete! You can now run:"
echo "npm start    # to start the server"
echo "npm run dev  # to start with nodemon for development" 