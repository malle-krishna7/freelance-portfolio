const mongoose = require('mongoose');

const TestimonialSchema = new mongoose.Schema({
  id: Number,
  client: String,
  company: String,
  message: String,
  rating: Number,
  image: String
});

module.exports = mongoose.model('Testimonial', TestimonialSchema);
