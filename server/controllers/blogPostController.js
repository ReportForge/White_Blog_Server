const BlogPost = require('../models/BlogPost');
const nodemailer = require('nodemailer');
const User = require('../models/User');

const blogPostController = {
  // Create a new blogPost post
  async createBlogPost(req, res) {
    try {
      const newBlogPost = new BlogPost(req.body);
      await newBlogPost.save();

      // Set up mail transporter
      const transporter = nodemailer.createTransport({
        service: 'gmail', // For Gmail, or use another service
        auth: {
          user: process.env.EMAIL, // Your email
          pass: process.env.EMAIL_PASSWORD, // Your email account password
        },
      });

      // Get all users' emails
      const users = await User.find().select('email -_id'); // Adjust based on your User model

      const mailOptions = {
        from: process.env.EMAIL,
        to: users.map(user => user.email),
        subject: `New Blog Post: ${newBlogPost.title}`,
        html: `
          <p>Check out our latest blog post!</p>
          <h1>${newBlogPost.title}</h1>
          <img src="cid:unique@blogpost.image" alt="Blog Post Image" style="width:100%;max-width:600px;height:auto;">
          <p><a href="http://localhost:3001/full-blog-post/${newBlogPost._id}">Read more</a></p>
        `,
        attachments: [{
          filename: 'image.png',
          path: newBlogPost.mainImage, // If this is a local file path or a URL
          cid: 'unique@blogpost.image' // same cid value as in the html img src
        }]
      };


      // Send email to all users
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.log('Error sending email: ', error);
        }
      });

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
  },

  async handleLikePost(req, res) {
    const { postId } = req.body; 
    const userId = req.user.userId;

    try {
      const post = await BlogPost.findById(postId);

      if (!post) {
        return res.status(404).json({ message: 'Post not found' });
      }

      // Check if the user has already liked the post
      const userIndex = post.likes.findIndex((id) => id.equals(userId));

      if (userIndex === -1) {
        // If the user hasn't liked the post yet, add their ID to the likes array and increment the likeCount
        post.likes.push(userId);
        post.likeCount += 1;
      } else {
        // If the user has already liked the post, remove their ID from the likes array and decrement the likeCount
        post.likes.splice(userIndex, 1);
        post.likeCount -= 1;
      }

      await post.save(); // Save the changes to the post

      res.json(post); // Return the updated post
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  async getLikedPostsByUser(req, res) {
    const userId = req.user.userId;
  
    try {
      const likedPosts = await BlogPost.find({ likes: userId });
      if (!likedPosts) {
        return res.status(404).json({ message: 'No liked posts found for this user.' });
      }
      res.json(likedPosts);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
  

};




module.exports = blogPostController;
