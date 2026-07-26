require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');
const connectDB = require('./config/database');
const logger = require('./utils/logger');

// Initialize Express App
const app = express();

// Connect to Database
connectDB();

// Middleware
app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors());
app.use(express.json());
app.use(morgan('combined', { stream: { write: message => logger.info(message.trim()) } }));
app.use(express.static(path.join(__dirname, 'public')));

// Basic health check route
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'API Router is running' });
});

// Import Routes
const authRoutes = require('./routes/auth.routes');
const gatewayRoutes = require('./routes/gateway.routes');
const providerRoutes = require('./routes/provider.routes');
const keyRoutes = require('./routes/key.routes');
const usageRoutes = require('./routes/usage.routes');

// Use Routes
app.use('/v1/auth', authRoutes);
app.use('/v1/chat/completions', gatewayRoutes);
app.use('/v1/providers', providerRoutes);
app.use('/v1/keys', keyRoutes);
app.use('/v1/usage', usageRoutes);

// Global Error Handler
const errorHandler = require('./middleware/error.middleware');
app.use(errorHandler);

const PORT = process.env.PORT || 3000;

app.listen(PORT, async () => {
  logger.info(`Server is running on port ${PORT}`);
  // Seed default providers
  try {
    const ProviderService = require('./services/provider.service');
    await ProviderService.seedProviders();
  } catch (e) {
    logger.error(`Seeding failed: ${e.message}`);
  }
});
