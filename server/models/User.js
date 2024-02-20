const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true, // Always convert email to lowercase
    trim: true // Remove whitespace from both ends
  },
  password: { type: String, required: true },
  isEditor: { type: Boolean, default: false }, // Existing field to indicate if the user is an editor
  profilePicture: { type: String, default: '' }, // New field for the profile image path, optional
  verificationCode: { type: String, required: false }, // Field for the email verification code
  emailVerified: { type: Boolean, default: false } // Field to indicate if the email has been verified
});

const User = mongoose.model('User', UserSchema);

module.exports = User;
