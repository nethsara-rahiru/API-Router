const mongoose = require('mongoose');

const usageLogSchema = new mongoose.Schema({
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
  applicationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Application',
  },
  provider: {
    type: String,
    required: true,
  },
  model: {
    type: String,
    required: true,
  },
  inputTokens: {
    type: Number,
    default: 0,
  },
  outputTokens: {
    type: Number,
    default: 0,
  },
  totalTokens: {
    type: Number,
    default: 0,
  },
  responseTimeMs: {
    type: Number,
  },
  status: {
    type: Number,
    required: true,
  }
}, { timestamps: true });

module.exports = mongoose.model('UsageLog', usageLogSchema);
