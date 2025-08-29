
const express = require('express');
const { connectDB } = require('./utils/connectDB');
const { listenPort } = require('./utils/listenPort');
const config = require('./config');

const userRoutes = require('./routes/userRoutes');

const app = express();
app.use(express.json());

// Health check endpoint
app.get('/', (req, res) => res.send('Server is running'));

// API routes
app.use('/api/users', userRoutes);

const startServer = async () => {
  try {
    await connectDB();
    listenPort(app, config.PORT);
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
};

startServer();