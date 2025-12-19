const mongoose = require('mongoose');

const SocialSchema = new mongoose.Schema({
  github: String,
  linkedin: String,
  twitter: String
}, { _id: false });

const ProfileSchema = new mongoose.Schema({
  name: String,
  title: String,
  bio: String,
  email: String,
  phone: String,
  location: String,
  profileImage: String,
  social: SocialSchema
});

module.exports = mongoose.model('Profile', ProfileSchema);
