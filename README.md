# Walnut - Smart Note-taking Platform

This repository contains both the frontend and backend code for the Walnut application.

## Project Structure

- Frontend: HTML, CSS, and JavaScript files in the root directory
- Backend: TypeScript Node.js/Express server in the `server` directory

## Setup Instructions

### Frontend

The frontend is a static website that can be served directly from the file system or through a web server.

### Backend

The backend is written in TypeScript and requires compilation before use.

1. Navigate to the server directory:
   ```
   cd server
   ```

2. Run the setup script to install dependencies and create the environment file:
   ```
   ./setup.sh
   ```
   
   Alternatively, you can manually install and build:
   ```
   npm install
   cp .env.example .env  # if .env doesn't exist
   npm run build
   ```

3. Update the `.env` file with your MongoDB connection string and other settings.

4. Start the server:
   ```
   npm start
   ```
   
   For development with auto-restart:
   ```
   npm run dev
   ```

## API Endpoints

### POST /api/submit-form

Adds a user to the waitlist.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "year": "2"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User added to waitlist successfully",
  "userId": "60f7b0b3e6b3f32a4c9e4d7a"
}
```

## Running the Full Application

1. Start the backend server following the steps above
2. Serve the frontend files using a local web server
3. Access the application at http://localhost:3000 (or your configured port) 