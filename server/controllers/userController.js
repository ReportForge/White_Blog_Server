const User = require('../models/User');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const bcrypt = require('bcryptjs');


const userController = {
  // Get a user profile
  async getUserProfile(req, res) {
    try {
      const user = await User.findById(req.params.id);
      if (!user) {
        return res.status(404).json({ message: 'User not found!' });
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Update a user profile
  async updateUserProfile(req, res) {
    try {
      const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
      res.json(updatedUser);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  async getAllUsers(req, res) {
    try {
      const users = await User.find({});
      res.json(users);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Set a user as an editor
  async setUserAsEditor(req, res) {
    try {
      const user = await User.findByIdAndUpdate(req.params.id, { $set: { isEditor: true } }, { new: true });
      if (!user) {
        return res.status(404).json({ message: 'User not found!' });
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Remove editor status from a user
  async removeEditorStatus(req, res) {
    try {
      const user = await User.findByIdAndUpdate(req.params.id, { $set: { isEditor: false } }, { new: true });
      if (!user) {
        return res.status(404).json({ message: 'User not found!' });
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  async requestPasswordReset(req, res) {
    try {
      const { email } = req.body;
      const user = await User.findOne({ email });

      if (!user) {
        return res.status(404).json({ message: 'User not found!' });
      }

      // Generate a password reset token
      const resetToken = crypto.randomBytes(20).toString('hex');
      // Set token validity for 1 hour
      const resetTokenExpire = Date.now() + 3600000; // 1 hour in milliseconds

      // Update user with reset token and expiry
      user.resetPasswordToken = resetToken;
      user.resetPasswordExpire = resetTokenExpire;
      await user.save();

      // Set up mail transporter
      const transporter = nodemailer.createTransport({
        service: 'gmail', // For Gmail, or use another service
        auth: {
          user: process.env.EMAIL, // Your email
          pass: process.env.EMAIL_PASSWORD, // Your email account password
        },
      });

      // Define mail options
      const mailOptions = {
        from: process.env.EMAIL, // Sender address
        to: user.email, // Recipient address
        subject: 'Password Reset Request',
        html: `
          <h1>Password Reset Request</h1>
          <p>You have requested a password reset. Please click on the following link, or paste this into your browser to complete the process:</p>
          <a href="http://localhost:3001/password-reset/${resetToken}">Reset Password</a>
          <p>If you did not request this, please ignore this email.</p>
        `,
      };

      // Send the email
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.log('Error sending password reset email: ', error);
          throw error;
        } else {
          console.log('Password reset email sent: ' + info.response);
          res.status(200).json({ message: 'Password reset email sent.' });
        }
      });
    } catch (error) {
      console.error('requestPasswordReset error:', error);
      res.status(500).json({ message: 'Error requesting password reset.' });
    }
  },

  // Function to submit a new password after password reset request
  async submitNewPassword(req, res) {
    try {
      const { token, newPassword } = req.body;
      // Find user by resetPasswordToken
      const user = await User.findOne({
        resetPasswordToken: token,
        resetPasswordExpire: { $gt: Date.now() }, // Check if the token is not expired
      });

      if (!user) {
        return res.status(400).json({ message: 'Invalid or expired password reset token.' });
      }

      // Hash the new password
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(newPassword, salt);

      // Clear the resetPasswordToken and resetPasswordExpire fields
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;

      await user.save();

      res.status(200).json({ message: 'Password has been updated successfully.' });
    } catch (error) {
      console.error('submitNewPassword error:', error);
      res.status(500).json({ message: 'Error resetting password.' });
    }
  },

};//end


module.exports = userController;
