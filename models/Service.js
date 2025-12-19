const mongoose = require('mongoose');

const ServiceSchema = new mongoose.Schema({
  id: Number,
  title: String,
  description: String,
  price: String,
  features: [String]
});

module.exports = mongoose.model('Service', ServiceSchema);
