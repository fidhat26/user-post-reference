const dns = require('node:dns');
dns.setServers(['8.8.8.8', '8.8.4.4']);

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const User = require('./models/User');
const Post = require('./models/Post');

const app = express();

app.use(cors());
app.use(express.json());

// Home route
app.get('/', (req, res) => {
  res.json({ message: 'User and Post API is running' });
});

// GET /users - Retrieve all users for the dropdown
app.get('/users', async (req, res) => {
  try {
    const users = await User.find().sort({ name: 1 });
    res.status(200).json(users);
  } catch (error) {
    console.error('Failed to retrieve users:', error.message);
    res.status(500).json({
      message: 'Failed to retrieve users'
    });
  }
});

// POST /users - Create a new user
app.post('/users', async (req, res) => {
  try {
    const { name, email } = req.body;

    if (!name?.trim() || !email?.trim()) {
      return res.status(400).json({
        message: 'Name and email are required'
      });
    }

    const user = await User.create({
      name,
      email
    });

    res.status(201).json({
      message: 'User created successfully',
      user
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        message: 'This email is already registered'
      });
    }

    if (error.name === 'ValidationError') {
      return res.status(400).json({
        message: error.message
      });
    }

    res.status(500).json({
      message: 'Failed to create user'
    });
  }
});

// POST /posts - Create a post linked to a user
app.post('/posts', async (req, res) => {
  try {
    const { title, content, userId } = req.body;

    if (!title?.trim() || !content?.trim() || !userId) {
      return res.status(400).json({
        message: 'Title, content, and userId are required'
      });
    }

    if (!mongoose.isValidObjectId(userId)) {
      return res.status(400).json({
        message: 'Invalid user ID'
      });
    }

    const userExists = await User.findById(userId);

    if (!userExists) {
      return res.status(404).json({
        message: 'User not found'
      });
    }

    const post = await Post.create({
      title,
      content,
      user: userId
    });

    const populatedPost = await post.populate(
      'user',
      'name email'
    );

    res.status(201).json({
      message: 'Post created successfully',
      post: populatedPost
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        message: error.message
      });
    }

    res.status(500).json({
      message: 'Failed to create post'
    });
  }
});

// GET /posts - Retrieve all posts with user information
app.get('/posts', async (req, res) => {
  try {
    const posts = await Post.find()
      .populate('user', 'name email')
      .sort({ _id: -1 });

    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({
      message: 'Failed to retrieve posts'
    });
  }
});

// Connect to MongoDB, then start the server
const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error('MONGO_URI is missing from .env');
    }

    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected successfully');

    app.listen(PORT, '0.0.0.0', () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Server startup failed:', error.message);
    process.exit(1);
  }
}

startServer();
