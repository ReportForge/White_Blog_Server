// models/Blog.js

const mongoose = require('mongoose');
const ContentBlockSchema = require('./ContentBlock'); // Import the ContentBlock schema

const BlogSchema = new mongoose.Schema({
  title: { type: String, required: true },
  authors: [{
    name: String,
    image: String, // URL or path to the image
  }],
  publishDate: { type: Date, default: Date.now },
  readTime: String, // e.g., '5 min'
  tags: [String], // Array of strings
  content: [ContentBlockSchema], // Array of content blocks
  summary: String,
  references: [String], // Array of URLs or references
});

const Blog = mongoose.model('Blog', BlogSchema);

module.exports = Blog;
