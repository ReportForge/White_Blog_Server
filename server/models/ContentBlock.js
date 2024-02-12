// models/ContentBlock.js

const mongoose = require('mongoose');

const ContentBlockSchema = new mongoose.Schema({
  type: { type: String, required: true },
  content: mongoose.Schema.Types.Mixed, // Can be text, URL, image path, etc.
  altText: String, // For images, for accessibility
  caption: String // For images or videos
});

module.exports = ContentBlockSchema;
