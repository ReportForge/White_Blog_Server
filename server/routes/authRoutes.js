const express = require('express');
const passport = require('passport');
const router = express.Router();
const authController = require('../controllers/authController');
// Register a new user
router.post('/register', authController.register);

// Login
router.post('/login', authController.login);

// You can add more routes for logout, token refresh, etc.

module.exports = router;
