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
});

const BlogPost = mongoose.model('BlogPost', BlogPostSchema);

module.exports = BlogPost;
