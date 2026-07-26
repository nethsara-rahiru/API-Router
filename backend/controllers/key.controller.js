const KeyService = require('../services/key.service');

class KeyController {
  static async create(req, res, next) {
    try {
      const { name } = req.body;
      if (!name) return res.status(400).json({ error: 'Key name is required' });
      const { apiKey, rawKey } = await KeyService.createAPIKey(name, req.user.userId, req.user.organizationId);
      res.status(201).json({ message: 'API Key created', apiKey, rawKey });
    } catch (error) { next(error); }
  }

  static async list(req, res, next) {
    try {
      const keys = await KeyService.listAPIKeys(req.user.userId);
      res.json({ keys });
    } catch (error) { next(error); }
  }

  static async revoke(req, res, next) {
    try {
      const key = await KeyService.revokeAPIKey(req.params.id, req.user.userId);
      res.json({ message: 'Key revoked', key });
    } catch (error) { next(error); }
  }

  static async remove(req, res, next) {
    try {
      await KeyService.deleteAPIKey(req.params.id, req.user.userId);
      res.json({ message: 'Key deleted' });
    } catch (error) { next(error); }
  }
}

module.exports = KeyController;
