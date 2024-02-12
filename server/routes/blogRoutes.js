const express = require('express');
const router = express.Router();
const blogController = require('../controllers/blogController');
const { isAuthenticated, isEditor } = require('../middleware/authMiddleware');

// Get all blog posts
router.get('/', blogController.getAllBlogs);

// Get a single blog post by ID
router.get('/:id', blogController.getBlogById);

// Create a new blog post - Only accessible by editors
router.post('/', isAuthenticated, isEditor, blogController.createBlog);

// Update a blog post - Only accessible by the original author or an editor
router.put('/:id', isAuthenticated, isEditor, blogController.updateBlog);

// Delete a blog post - Only accessible by the original author or an editor
router.delete('/:id', isAuthenticated, isEditor, blogController.deleteBlog);

module.exports = router;
