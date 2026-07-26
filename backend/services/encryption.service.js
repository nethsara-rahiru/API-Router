const crypto = require('crypto');

const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 16;

class EncryptionService {
  static getSecretKey() {
    const secret = process.env.ENCRYPTION_SECRET || 'fallback_default_api_router_encryption_secret_key';
    // Use SHA-256 to hash the secret string into an exact 32-byte (256-bit) Buffer for AES-256-GCM
    return crypto.createHash('sha256').update(secret).digest();
  }

  static encrypt(text) {
    const iv = crypto.randomBytes(IV_LENGTH);
    const cipher = crypto.createCipheriv(ALGORITHM, this.getSecretKey(), iv);
    
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    
    const authTag = cipher.getAuthTag().toString('hex');
    
    return {
      encryptedKey: encrypted,
      iv: iv.toString('hex'),
      authTag: authTag,
    };
  }

  static decrypt(encryptedKey, ivHex, authTagHex) {
    const iv = Buffer.from(ivHex, 'hex');
    const authTag = Buffer.from(authTagHex, 'hex');
    
    const decipher = crypto.createDecipheriv(ALGORITHM, this.getSecretKey(), iv);
    decipher.setAuthTag(authTag);
    
    let decrypted = decipher.update(encryptedKey, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    
    return decrypted;
  }
}

module.exports = EncryptionService;
