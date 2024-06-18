const mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/pinterestmini');

const plm = require('passport-local-mongoose')

// Define the schema for the User model
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String
  },
  fullname: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  dp: {
    type: String // Assuming dp is a URL pointing to the display picture
  },
  posts: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post' // Reference from Post model
  }]
});

userSchema.plugin(plm);

// Create the User model using the schema
  
module.exports = mongoose.model('User', userSchema);
