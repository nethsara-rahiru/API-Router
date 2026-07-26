const express = require('express');
const KeyController = require('../controllers/key.controller');
const { authMiddleware } = require('../middleware/auth.middleware');

const router = express.Router();

router.use(authMiddleware);
router.post('/', KeyController.create);
router.get('/', KeyController.list);
router.patch('/:id/revoke', KeyController.revoke);
router.delete('/:id', KeyController.remove);

module.exports = router;
