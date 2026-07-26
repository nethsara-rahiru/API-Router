const mongoose = require('mongoose');

const apiKeySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  keyHash: {
    type: String,
    required: true,
  },
  prefix: {
    type: String,
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  organizationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Organization',
    required: true,
  },
  status: {
    type: String,
    enum: ['active', 'revoked'],
    default: 'active',
  }
}, { timestamps: true });

module.exports = mongoose.model('APIKey', apiKeySchema);
