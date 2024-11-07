import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';  // Import dotenv
import cookieParser from 'cookie-parser';
import cors from 'cors';

import adminRoutes from './routes/admin.routes.js';
import userRoutes from './routes/user.route.js';
import authRoutes from './routes/auth.routes.js';

// Load environment variables from .env file
dotenv.config();  // Make sure this is called before accessing any variables

const app = express();

// Middleware
const corsOptions = {
  origin: ['http://localhost:3000', 'http://localhost:5173'],
  credentials: true, // Allow cookies to be sent
};

app.use(cors(corsOptions));
app.use(express.json()); // To parse incoming JSON requests
app.use(cookieParser()); // To parse cookies

// Log the MongoDB URI to ensure it's loaded correctly
if (!process.env.MONGO_URI) {
  console.error("Mongo URI is not defined in .env file");
  process.exit(1); // Exit if the URI is missing
} else {
  console.log('MongoDB URI:', process.env.MONGO_URI); // Log it for debugging
}

// Connect to MongoDB using the correct environment variable
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/admin', adminRoutes); // Admin routes
app.use('/api/user', userRoutes); // User routes
app.use('/api/auth', authRoutes); // Authentication routes

// Global error handler
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  res.status(statusCode).json({ success: false, message, statusCode });
});

// Start the server
app.listen(5000, () => {
  console.log('Server is running on port 5000');
});
