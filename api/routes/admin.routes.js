import express from 'express';
import { adminLogin, getUsers, createUser, deleteUser, getAdminDashboard } from '../controllers/adminController.js';
import { verifyToken } from '../utils/varifyAdmin.js';  // Corrected import

const router = express.Router();

// Admin routes
router.post('/login', adminLogin);                // Admin login route
router.get('/users', verifyToken, getUsers);      // Protected route to get all users
router.post('/user', verifyToken, createUser);    // Protected route to create a user
router.delete('/user/:userId', verifyToken, deleteUser);  // Protected route to delete a user
router.get('/dashboard', verifyToken, getAdminDashboard);  // Protected route to get dashboard data

export default router;
