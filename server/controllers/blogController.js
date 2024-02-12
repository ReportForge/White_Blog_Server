const Blog = require('../models/Blog');

const blogController = {
  // Create a new blog post
  async createBlog(req, res) {
    try {
      const newBlog = new Blog(req.body);
      await newBlog.save();
      res.status(201).json(newBlog);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Get all blog posts
  async getAllBlogs(req, res) {
    try {
      const blogs = await Blog.find();
      res.json(blogs);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Get a single blog post by ID
  async getBlogById(req, res) {
    try {
      const blog = await Blog.findById(req.params.id);
      if (!blog) {
        return res.status(404).json({ message: 'Blog not found!' });
      }
      res.json(blog);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Update a blog post
  async updateBlog(req, res) {
    try {
      const updatedBlog = await Blog.findByIdAndUpdate(req.params.id, req.body, { new: true });
      res.json(updatedBlog);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Delete a blog post
  async deleteBlog(req, res) {
    try {
      await Blog.findByIdAndDelete(req.params.id);
      res.json({ message: 'Blog deleted successfully!' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
};

module.exports = blogController;
