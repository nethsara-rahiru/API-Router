const express = require('express');
const GatewayController = require('../controllers/gateway.controller');
const { gatewayAuthMiddleware } = require('../middleware/auth.middleware');

const router = express.Router();

// Supports both JWT tokens and Developer API Keys (apr_live_...)
router.post('/', gatewayAuthMiddleware, GatewayController.chatCompletions);

module.exports = router;
