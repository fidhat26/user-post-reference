# User-Post Reference API (Backend)

## Project Description
This backend application uses Node.js, Express.js, and MongoDB with Mongoose to manage users and posts. Each post is linked to a user through a MongoDB ObjectId reference. The API uses Mongoose's `populate()` method to retrieve the associated user's name and email when displaying posts.

## Technologies Used
- Node.js
- Express.js
- MongoDB Atlas
- Mongoose
- dotenv
- CORS

## Features
- Create a new user with name and email.
- Retrieve all users.
- Create a post linked to an existing user.
- Retrieve all posts with the associated user's name and email.
- Validate required fields and user IDs.
- Handle duplicate email addresses and other errors.


## Installation

1. Install Node.js.
2. Open a terminal in the backend folder.
3. Install dependencies:

```bash
npm install
```

## Environment Variables

Create a `.env` file in the backend folder:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
```

Replace `your_mongodb_connection_string` with your MongoDB Atlas connection string. Do not upload your real connection string or database password to a public repository.

## Running the Server

Start the development server:

```bash
npm run dev
```

The API runs at:

`http://localhost:5000`
