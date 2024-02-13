const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { isAuthenticated } = require('../middleware/authMiddleware');

// Get user profile - Only accessible by the user themselves or an admin
router.get('/:id', isAuthenticated, userController.getUserProfile);

// Update user profile - Only accessible by the user themselves
router.put('/:id', isAuthenticated, userController.updateUserProfile);

router.get('/',isAuthenticated, userController.getAllUsers);

// Route to set a user as an editor
router.put('/:id/set-editor', isAuthenticated, userController.setUserAsEditor);

// Route to remove editor status from a user
router.put('/:id/remove-editor', isAuthenticated, userController.removeEditorStatus);

module.exports = router;
