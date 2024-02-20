// models/Blog.js

const mongoose = require('mongoose');
const ContentBlockSchema = require('./ContentBlock'); // Import the ContentBlock schema

const BlogPostSchema = new mongoose.Schema({
  title: { type: String, required: true },
  subTitle: { type: String },
  authors: [{
    name: String,
    image: String,
  }],
  publishDate: { type: Date, default: Date.now },
  readTime: String, // e.g., '5 min'
  tags: [String], // Array of strings
  mainImage: String,
  contentBlocks: [ContentBlockSchema], // Array of content blocks
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Reference to the User model
  isDraft: { type: Boolean, default: false }, // Indicates if the blog post is a draft
  // New fields for likes
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // Array of user IDs who liked the post
  likeCount: { type: Number, default: 0 }, // Count of likes
});

const BlogPost = mongoose.model('BlogPost', BlogPostSchema);

module.exports = BlogPost;
