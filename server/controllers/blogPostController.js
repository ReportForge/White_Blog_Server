const BlogPost = require('../models/BlogPost');

const blogPostController = {
  // Create a new blogPost post
  async createBlogPost(req, res) {
    try {
      const newBlogPost = new BlogPost(req.body);
      await newBlogPost.save();
      res.status(201).json(newBlogPost);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Get all blogPost posts
  async getAllBlogPosts(req, res) {
    try {
      const blogPosts = await BlogPost.find();
      res.json(blogPosts);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Get a single blogPost post by ID
  async getBlogPostById(req, res) {
    try {
      const blogPost = await BlogPost.findById(req.params.id);
      if (!blogPost) {
        return res.status(404).json({ message: 'BlogPost not found!' });
      }
      res.json(blogPost);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Update a blogPost post
  async updateBlogPost(req, res) {
    try {
      const updatedBlogPost = await BlogPost.findByIdAndUpdate(req.params.id, req.body, { new: true });
      res.json(updatedBlogPost);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Delete a blogPost post
  async deleteBlogPost(req, res) {
    try {
      await BlogPost.findByIdAndDelete(req.params.id);
      res.json({ message: 'BlogPost deleted successfully!' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
};

module.exports = blogPostController;
