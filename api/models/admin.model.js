import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

// Admin Schema
const adminSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,  // Ensure admin username is unique
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,  // Minimum password length
    },
  },
  {
    timestamps: true,  // Automatically add createdAt and updatedAt fields
  }
);

// Hash the password before saving it to the database
adminSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    // Hash the password with a salt
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

// Method to compare entered password with stored hashed password
adminSchema.methods.isPasswordValid = async function (password) {
  return await bcrypt.compare(password, this.password);
};

// Create the Admin model
const Admin = mongoose.model('Admin', adminSchema);

export default Admin;
