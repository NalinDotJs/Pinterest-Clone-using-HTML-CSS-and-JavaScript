const mongoose = require('mongoose');
const { stringify } = require('uuid');
mongoose.connect('mongodb://127.0.0.1:27017/pinterestmini')

// Define the schema for the Post model
const postSchema = new mongoose.Schema({
  imageText: {
    type: String,
    required: true
  },
  image:{
    type: String
  },

  user:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User' 
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
  likes: {
    type: Array,
    default: [] // Default value for likes is 0
  }
});

// Create the Post model using the schema

module.exports = mongoose.model('Post', postSchema );

