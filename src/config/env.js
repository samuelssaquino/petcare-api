require('dotenv').config();

const env = {
  port: process.env.PORT || 3000,
  baseUrl: process.env.BASE_URL || `http://localhost:${process.env.PORT || 3000}`,
  mongodbUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/petcare-api',
  jwtSecret: process.env.JWT_SECRET || 'change-me',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '1d'
};

module.exports = env;

