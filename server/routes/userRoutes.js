const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { isAuthenticated } = require('../middleware/authMiddleware');

// Get user profile - Only accessible by the user themselves or an admin
router.get('/:id', isAuthenticated, userController.getUserProfile);

// Update user profile - Only accessible by the user themselves
router.put('/:id', isAuthenticated, userController.updateUserProfile);

// You might add more routes for admin operations like listing all users, deleting users, etc.

module.exports = router;
