# User-Post Reference App (Frontend)

## Project Description
This React application provides a user interface for creating users, creating posts, selecting a user from a dropdown, and viewing posts with their associated user information.

The frontend communicates with an Express.js backend API and displays the data stored in MongoDB.

## Technologies Used
- React.js
- Vite
- JavaScript
- Axios
- CSS
- HTML

## Features
- Create a user with name and email.
- Retrieve users from the backend.
- Select a user from a dropdown when creating a post.
- Create a post with a title and content.
- Display posts with the associated user's name and email.
- Communicate with the backend using Axios.

## Installation

1. Open a terminal in the frontend folder.
2. Install the dependencies:

```bash
npm install
```

3. Install Axios if it is not already included:

```bash
npm install axios
```

## Backend Configuration

The frontend connects to the backend at:

```js
const API_URL = 'http://localhost:5000';
```

Make sure this URL matches the address where your backend is running.

## Running the Application

Start the Vite development server:

```bash
npm run dev
```

Open the local URL shown in your terminal, usually:

`http://localhost:5173`

