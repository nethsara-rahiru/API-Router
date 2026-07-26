const mongoose = require('mongoose');

const providerKeySchema = new mongoose.Schema({
  provider: {
    type: String,
    required: true,
    lowercase: true,
  },
  encryptedKey: {
    type: String,
    required: true,
  },
  iv: {
    type: String,
    required: true,
  },
  authTag: {
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
  status: {
    type: String,
    enum: ['active', 'disabled', 'rate_limited', 'invalid'],
    default: 'active',
  },
  validationStatus: {
    type: String,
    enum: ['pending', 'valid', 'invalid'],
    default: 'pending',
  }
}, { timestamps: true });

module.exports = mongoose.model('ProviderKey', providerKeySchema);
