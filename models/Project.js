const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema({
  id: Number,
  title: String,
  description: String,
  category: String,
  image: String,
  technologies: [String],
  link: String,
  github: String,
  featured: { type: Boolean, default: false }
});

module.exports = mongoose.model('Project', ProjectSchema);
