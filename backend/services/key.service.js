const crypto = require('crypto');
const bcrypt = require('bcrypt');
const APIKey = require('../models/APIKey');
const logger = require('../utils/logger');

class KeyService {
  // --- Developer API Keys ---

  static async createAPIKey(name, userId, organizationId) {
    // Generate a random key: apr_live_<random>
    const rawKey = `apr_live_${crypto.randomBytes(24).toString('hex')}`;
    const prefix = rawKey.substring(0, 16); // Store prefix for display
    const keyHash = await bcrypt.hash(rawKey, 10);

    const apiKey = await APIKey.create({
      name,
      keyHash,
      prefix,
      userId,
      organizationId,
    });

    // Return the raw key ONCE — never stored in plaintext
    return { apiKey, rawKey };
  }

  static async listAPIKeys(userId) {
    return APIKey.find({ userId }).select('-keyHash').sort({ createdAt: -1 });
  }

  static async revokeAPIKey(keyId, userId) {
    const key = await APIKey.findOneAndUpdate(
      { _id: keyId, userId },
      { status: 'revoked' },
      { new: true }
    );
    if (!key) throw new Error('Key not found');
    return key;
  }

  static async deleteAPIKey(keyId, userId) {
    const key = await APIKey.findOneAndDelete({ _id: keyId, userId });
    if (!key) throw new Error('Key not found');
    return key;
  }

  // Validate a developer API key (used by gateway middleware)
  static async validateAPIKey(rawKey) {
    const keys = await APIKey.find({ status: 'active' }).populate('userId organizationId');
    for (const key of keys) {
      const match = await bcrypt.compare(rawKey, key.keyHash);
      if (match) return key;
    }
    return null;
  }
}

module.exports = KeyService;
