const express = require('express');
const UsageController = require('../controllers/usage.controller');
const { authMiddleware } = require('../middleware/auth.middleware');

const router = express.Router();

router.use(authMiddleware);
router.get('/stats', UsageController.getStats);
router.get('/logs', UsageController.getLogs);
router.get('/chart', UsageController.getChartData);

module.exports = router;
