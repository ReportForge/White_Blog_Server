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
  },

  // Function to save or update a draft blog post
  async saveDraft(req, res) {
    // Use the userId from req.user, which is set by the isAuthenticated middleware
    const userId = req.user.userId;

    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    try {
      const postData = req.body; // Use the rest of the request body as post data
      // Look for an existing draft by this user
      const existingDraft = await BlogPost.findOne({ userId, isDraft: true });

      if (existingDraft) {
        // If an existing draft is found, update it with the new data
        Object.assign(existingDraft, postData, { isDraft: true });
        await existingDraft.save();
        res.json(existingDraft);
      } else {
        // If no existing draft is found, create a new one
        const newDraft = new BlogPost({ ...postData, userId, isDraft: true });
        await newDraft.save();
        res.status(201).json(newDraft);
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
  

  async getDraftPost(req, res) {
    try {
      //using the middleware
      const userId = req.user.userId;
      const draftPost = await BlogPost.findOne({ userId, isDraft: true });

      if (!draftPost) {
        return res.status(404).json({ message: 'No draft post found for this user.' });
      }

      res.json(draftPost);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  async deleteDraftPost(req, res) {
    try {
      // Assuming you're using some kind of middleware to extract user ID from the token and attaching it to req.user
      const userId = req.user.userId;

      const result = await BlogPost.deleteOne({ userId, isDraft: true });

      if (result.deletedCount === 0) {
        return res.status(404).json({ message: 'No draft post found for this user to delete.' });
      }

      res.json({ message: 'Draft post deleted successfully.' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }


};




module.exports = blogPostController;
