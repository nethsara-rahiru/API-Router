const ProviderKey = require('../models/ProviderKey');
const Provider = require('../models/Provider');
const EncryptionService = require('./encryption.service');
const GroqAdapter = require('../providers/groq/groq.adapter');
const logger = require('../utils/logger');

class ProviderService {

  static async addProviderKey(provider, rawKey, ownerId, organizationId) {
    // Step 1: Validate the key against the provider's API
    await this.validateKey(provider, rawKey);

    // Step 2: Encrypt the key
    const { encryptedKey, iv, authTag } = EncryptionService.encrypt(rawKey);

    // Step 3: Store encrypted key
    const providerKey = await ProviderKey.create({
      provider,
      encryptedKey,
      iv,
      authTag,
      ownerId,
      organizationId,
      validationStatus: 'valid',
      status: 'active',
    });

    return providerKey;
  }

  static async validateKey(provider, rawKey) {
    if (provider === 'groq') {
      const adapter = new GroqAdapter(rawKey);
      try {
        // Make a minimal test request
        await adapter.chatCompletions({
          model: 'llama-3.1-8b-instant',
          messages: [{ role: 'user', content: 'Hi' }],
          max_tokens: 1,
        });
      } catch (error) {
        const status = error.response?.status;
        if (status === 401) throw new Error('Invalid API key');
        if (status === 429) return; // Rate limited but key is valid
        if (status >= 400 && status < 500) throw new Error('Invalid API key');
        // For other errors (network, etc), assume key may be valid
      }
    }
  }

  static async listProviderKeys(organizationId) {
    const keys = await ProviderKey.find({ organizationId })
      .select('-encryptedKey -iv -authTag')
      .sort({ createdAt: -1 });
    return keys;
  }

  static async updateKeyStatus(keyId, organizationId, status) {
    const key = await ProviderKey.findOneAndUpdate(
      { _id: keyId, organizationId },
      { status },
      { new: true }
    ).select('-encryptedKey -iv -authTag');
    if (!key) throw new Error('Key not found');
    return key;
  }

  static async deleteProviderKey(keyId, organizationId) {
    const key = await ProviderKey.findOneAndDelete({ _id: keyId, organizationId });
    if (!key) throw new Error('Key not found');
    return key;
  }

  // Seed default providers if not present
  static async seedProviders() {
    const count = await Provider.countDocuments();
    if (count === 0) {
      await Provider.create({ name: 'Groq', code: 'groq', status: 'enabled' });
      logger.info('Seeded default provider: Groq');
    }
  }
}

module.exports = ProviderService;
