const mongoose = require('mongoose');

const providerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  code: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  status: {
    type: String,
    enum: ['enabled', 'disabled'],
    default: 'enabled',
  }
}, { timestamps: true });

module.exports = mongoose.model('Provider', providerSchema);
