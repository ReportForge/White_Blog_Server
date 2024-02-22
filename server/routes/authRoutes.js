const express = require('express');
const passport = require('passport');
const router = express.Router();
const authController = require('../controllers/authController');

// Register a new user
router.post('/register', authController.register);

// Login
router.post('/login', authController.login);

// Email verification
router.post('/verify-email', authController.verifyEmail);

// New route for Google authentication
router.post('/google-login', authController.googleLogin);

module.exports = router;
