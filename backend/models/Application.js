const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  organizationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Organization',
    required: true,
  },
  apiKeyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'APIKey',
  },
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active',
  }
}, { timestamps: true });

module.exports = mongoose.model('Application', applicationSchema);
