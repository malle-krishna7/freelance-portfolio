const mongoose = require('mongoose');

const SkillGroupSchema = new mongoose.Schema({
  category: String,
  items: [String]
});

module.exports = mongoose.model('SkillGroup', SkillGroupSchema);
