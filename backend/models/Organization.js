const mongoose = require('mongoose');

const organizationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  limits: {
    monthlyRequests: {
      type: Number,
      default: 10000,
    },
    monthlyTokens: {
      type: Number,
      default: 1000000,
    }
  },
  status: {
    type: String,
    enum: ['active', 'suspended'],
    default: 'active',
  }
}, { timestamps: true });

module.exports = mongoose.model('Organization', organizationSchema);
