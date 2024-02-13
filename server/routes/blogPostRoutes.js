const express = require('express');
const router = express.Router();
const blogPostController = require('../controllers/blogPostController');
const { isAuthenticated, isEditor } = require('../middleware/authMiddleware');

// Get all blogPost posts
router.get('/', blogPostController.getAllBlogPosts);

// Get a single blogPost post by ID
router.get('/:id', blogPostController.getBlogPostById);

// Create a new blogPost post - Only accessible by editors
router.post('/', isAuthenticated, isEditor, blogPostController.createBlogPost);

// Update a blogPost post - Only accessible by the original author or an editor
router.put('/:id', isAuthenticated, isEditor, blogPostController.updateBlogPost);

// Delete a blogPost post - Only accessible by the original author or an editor
router.delete('/:id', isAuthenticated, isEditor, blogPostController.deleteBlogPost);

module.exports = router;
