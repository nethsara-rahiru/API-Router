const AuthService = require('../services/auth.service');

class AuthController {
  static async register(req, res, next) {
    try {
      const { name, email, password } = req.body;
      if (!name || !email || !password) {
        return res.status(400).json({ error: 'Name, email, and password are required' });
      }
      
      const user = await AuthService.registerUser(name, email, password);
      res.status(201).json({ 
        message: 'Registration successful',
        user: { id: user._id, name: user.name, email: user.email }
      });
    } catch (error) {
      if (error.message === 'Email already registered') {
        return res.status(400).json({ error: error.message });
      }
      next(error);
    }
  }

  static async login(req, res, next) {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
      }

      const { user, token } = await AuthService.loginUser(email, password);
      res.status(200).json({
        message: 'Login successful',
        token,
        user: { 
          id: user._id, 
          name: user.name, 
          email: user.email, 
          role: user.role,
          organizationId: user.organizationId._id
        }
      });
    } catch (error) {
      if (error.message === 'Invalid email or password' || error.message === 'Account is not active') {
        return res.status(401).json({ error: error.message });
      }
      next(error);
    }
  }
}

module.exports = AuthController;
