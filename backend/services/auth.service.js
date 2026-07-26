const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Organization = require('../models/Organization');
const logger = require('../utils/logger');

class AuthService {
  static async registerUser(name, email, password) {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new Error('Email already registered');
    }

    const organization = new Organization({
      name: `${name}'s Organization`,
    });

    const user = new User({
      name,
      email,
      passwordHash: password,
      role: 'developer',
      organizationId: organization._id,
    });

    organization.ownerId = user._id;

    await organization.save();
    await user.save();

    logger.info(`New user registered: ${email}`);
    return user;
  }

  static async loginUser(email, password) {
    const user = await User.findOne({ email }).populate('organizationId');
    if (!user) {
      throw new Error('Invalid email or password');
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      throw new Error('Invalid email or password');
    }

    if (user.status !== 'active') {
      throw new Error('Account is not active');
    }

    const token = jwt.sign(
      { userId: user._id, role: user.role, organizationId: user.organizationId._id },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    return { user, token };
  }
}

module.exports = AuthService;
