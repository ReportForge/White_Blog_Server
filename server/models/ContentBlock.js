// models/ContentBlock.js

const mongoose = require('mongoose');

const ContentBlockSchema = new mongoose.Schema({
  type: { type: String, required: true },
  content: mongoose.Schema.Types.Mixed,
});

module.exports = ContentBlockSchema;
