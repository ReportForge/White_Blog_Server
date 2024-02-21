const express = require('express');
const router = express.Router();
const blogPostController = require('../controllers/blogPostController');
const { isAuthenticated, isEditor } = require('../middleware/authMiddleware');

// Get all blogPost posts
router.get('/', blogPostController.getAllBlogPosts);

// Create a new blogPost post - Only accessible by editors
router.post('/', isAuthenticated, isEditor, blogPostController.createBlogPost);

// Get the current user's draft post - Only accessible by authenticated users
router.get('/draft', isAuthenticated, blogPostController.getDraftPost);


// Delete the current user's draft post - Only accessible by authenticated users
router.delete('/draft', isAuthenticated, blogPostController.deleteDraftPost);

// Save or update the current user's draft post - Only accessible by authenticated users
router.post('/draft', isAuthenticated, blogPostController.saveDraft);

// Route for liking/unliking a blogPost post - Only accessible by authenticated users
router.put('/like', isAuthenticated, blogPostController.handleLikePost);

// Route to get liked posts by the current user - Only accessible by authenticated users
router.get('/liked', isAuthenticated, blogPostController.getLikedPostsByUser);

// Route to fetch posts created by the currently authenticated user
router.get('/by-author',isAuthenticated, blogPostController.fetchPostsByAuthorName);

// Get a single blogPost post by ID - placed after the '/draft' route to avoid conflicts
router.get('/:id', blogPostController.getBlogPostById);

// Update a blogPost post - Only accessible by the original author or an editor
router.put('/:id', isAuthenticated, isEditor, blogPostController.updateBlogPost);

// Delete a blogPost post - Only accessible by the original author or an editor
router.delete('/:id', isAuthenticated, isEditor, blogPostController.deleteBlogPost);




module.exports = router;
