const express = require('express');
const AuthController = require('../controllers/auth.controller');
const { authMiddleware } = require('../middleware/auth.middleware');

const router = express.Router();

router.post('/register', AuthController.register);
router.post('/login', AuthController.login);

// Example protected route
router.get('/me', authMiddleware, (req, res) => {
  res.status(200).json({ user: req.user });
});

module.exports = router;
