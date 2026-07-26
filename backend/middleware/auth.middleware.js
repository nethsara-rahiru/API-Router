const jwt = require('jsonwebtoken');
const KeyService = require('../services/key.service');

const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Authentication token missing or invalid' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
};

// Middleware supporting BOTH developer API keys (apr_live_...) AND JWT bearer tokens for /v1/chat/completions
const gatewayAuthMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Missing Authorization header' });
    }

    const token = authHeader.split(' ')[1];

    if (token.startsWith('apr_live_')) {
      // Validate Developer API Key
      const keyDoc = await KeyService.validateAPIKey(token);
      if (!keyDoc) {
        return res.status(401).json({ error: 'Invalid or revoked developer API key' });
      }
      req.user = { userId: keyDoc.userId._id, organizationId: keyDoc.organizationId._id, role: 'developer' };
      return next();
    }

    // Fallback: Validate JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Authentication failed' });
  }
};

const adminMiddleware = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ error: 'Requires admin privileges' });
  }
};

module.exports = { authMiddleware, gatewayAuthMiddleware, adminMiddleware };
