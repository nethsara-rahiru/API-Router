const ProviderService = require('../services/provider.service');

class ProviderController {
  static async addKey(req, res, next) {
    try {
      const { provider, key } = req.body;
      if (!provider || !key) return res.status(400).json({ error: 'provider and key are required' });
      const providerKey = await ProviderService.addProviderKey(
        provider, key, req.user.userId, req.user.organizationId
      );
      res.status(201).json({ message: 'Provider key added and validated', providerKey });
    } catch (error) {
      if (error.message === 'Invalid API key') return res.status(400).json({ error: error.message });
      next(error);
    }
  }

  static async listKeys(req, res, next) {
    try {
      const keys = await ProviderService.listProviderKeys(req.user.organizationId);
      res.json({ keys });
    } catch (error) { next(error); }
  }

  static async updateStatus(req, res, next) {
    try {
      const { status } = req.body;
      const key = await ProviderService.updateKeyStatus(req.params.id, req.user.organizationId, status);
      res.json({ message: 'Status updated', key });
    } catch (error) { next(error); }
  }

  static async deleteKey(req, res, next) {
    try {
      await ProviderService.deleteProviderKey(req.params.id, req.user.organizationId);
      res.json({ message: 'Provider key deleted' });
    } catch (error) { next(error); }
  }
}

module.exports = ProviderController;
