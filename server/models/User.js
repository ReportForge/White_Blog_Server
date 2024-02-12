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
  isEditor: { type: Boolean, default: false } // Added field to indicate if the user is an editor
});


const User = mongoose.model('User', UserSchema);

module.exports = User;
