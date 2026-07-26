const ProviderKey = require('../models/ProviderKey');
const EncryptionService = require('./encryption.service');
const logger = require('../utils/logger');

class RoutingService {
  /**
   * Selects the best provider key based on the strategy.
   * For Phase 1, we implement a simple Round Robin strategy.
   */
  static async selectBestKey(organizationId, providerCode = 'groq', strategy = 'round_robin') {
    // Fetch all active, valid keys for the organization and provider
    const keys = await ProviderKey.find({
      organizationId,
      provider: providerCode,
      status: 'active',
      validationStatus: 'valid'
    });

    if (!keys || keys.length === 0) {
      throw new Error(`No available keys for provider: ${providerCode}`);
    }

    // Round Robin implementation
    // For a real production app, we would store the last used index in Redis or DB.
    // For Phase 1, we randomly select one (mock round robin) or just pick the first.
    // Let's implement a randomized selection to distribute load.
    const selectedKeyDoc = keys[Math.floor(Math.random() * keys.length)];

    // Decrypt the key
    try {
      const decryptedKey = EncryptionService.decrypt(
        selectedKeyDoc.encryptedKey, 
        selectedKeyDoc.iv, 
        selectedKeyDoc.authTag
      );
      
      return {
        keyId: selectedKeyDoc._id,
        apiKey: decryptedKey
      };
    } catch (error) {
      logger.error(`Error decrypting provider key ${selectedKeyDoc._id}: ${error.message}`);
      throw new Error('Internal server error during key decryption');
    }
  }
}

module.exports = RoutingService;
