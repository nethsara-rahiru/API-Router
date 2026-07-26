const express = require('express');
const ProviderController = require('../controllers/provider.controller');
const { authMiddleware } = require('../middleware/auth.middleware');

const router = express.Router();

router.use(authMiddleware);
router.post('/keys', ProviderController.addKey);
router.get('/keys', ProviderController.listKeys);
router.patch('/keys/:id/status', ProviderController.updateStatus);
router.delete('/keys/:id', ProviderController.deleteKey);

module.exports = router;
