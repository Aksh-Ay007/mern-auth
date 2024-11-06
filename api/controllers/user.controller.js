import User from '../models/user.modal.js';
import { errorHandler } from '../utils/error.js';
import bcryptjs from 'bcryptjs';

export const test = (req, res) => {
  res.json({
    message: 'API is working!',
  });
};

// Update user


export const updateUser = async (req, res, next) => {
  if (req.user.id !== req.params.id) {
    return next(errorHandler(401, 'You can update only your account!'));
  }

  try {
    // Prepare updated data
    const updateFields = { ...req.body };

    // Hash the password if it's being updated
    if (req.body.password) {
      updateFields.password = bcryptjs.hashSync(req.body.password, 10);
    }

    // Update the user in the database
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { $set: updateFields },
      { new: true }
    );

    // Exclude password from response and return the updated user without password
    const { password, ...rest } = updatedUser._doc;

    // Respond with the updated user data
    res.status(200).json(rest);
  } catch (error) {
    next(error);
  }
};

  

// Delete user
export const deleteUser = async (req, res, next) => {
  // Check if the user is trying to delete their own account
  if (req.user.id !== req.params.id) {
    return next(errorHandler(401, 'You can delete only your account!'));
  }

  try {
    // Delete the user
    await User.findByIdAndDelete(req.params.id);
    res.status(204).json(); // No content is returned after successful deletion
  } catch (error) {
    next(error);
  }
};
