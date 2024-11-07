import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import Admin from '../models/admin.model.js';
import User from '../models/user.modal.js';
import { errorHandler } from '../utils/error.js';

export const adminLogin = async (req, res, next) => {
  const { username, password } = req.body;
  try {
    const admin = await Admin.findOne({ username });
    if (!admin) return next(errorHandler(404, 'Admin not found!'));

    const isPasswordValid = await bcrypt.compare(password, admin.password);
    if (!isPasswordValid) return next(errorHandler(400, 'Invalid credentials'));

    const token = jwt.sign(
      { id: admin._id, username: admin.username, isAdmin: true },
      process.env.JWT_SECRET_ADMIN,
      { expiresIn: '1h' }
    );

    res.cookie('access_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 3600000, // 1 hour cookie expiry
    })
      .status(200)
      .json({
        success: true,
        message: 'Admin logged in successfully',
        token,
        isAdmin: true, // Add this line
        username: admin.username,
      });
    
  } catch (error) {
    next(error);
  }
};

export const getUsers = async (req, res, next) => {
  try {
    const users = await User.find().select('-password');
    res.status(200).json({ users });
  } catch (error) {
    next(errorHandler(500, error.message));
  }
};

export const createUser = async (req, res, next) => {
  const { username, email, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, email, password: hashedPassword });
    await newUser.save();
    res.status(201).json({ message: 'User created successfully', newUser });
  } catch (error) {
    next(errorHandler(500, error.message));
  }
};

export const deleteUser = async (req, res, next) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.userId);
    if (deletedUser) res.status(200).json({ message: 'User deleted successfully' });
    else res.status(404).json({ message: 'User not found' });
  } catch (error) {
    next(errorHandler(500, error.message));
  }
};


export const getAdminDashboard = async (req, res, next) => {
  try {
    const userCount = await User.countDocuments();
    res.status(200).json({ totalUsers: userCount });
  } catch (error) {
    next(errorHandler(500, error.message));
  }
};