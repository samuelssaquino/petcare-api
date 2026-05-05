const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const env = require('../config/env');
const User = require('../models/user.model');
const { UnauthorizedError, ValidationError } = require('../utils/errors');

function normalizeCredentials(credentials = {}) {
  return {
    email: typeof credentials.email === 'string' ? credentials.email.trim().toLowerCase() : credentials.email,
    password: credentials.password
  };
}

function validateRequiredFields({ email, password }) {
  const missingFields = [];

  if (!email) {
    missingFields.push('email');
  }

  if (!password) {
    missingFields.push('password');
  }

  if (missingFields.length > 0) {
    throw new ValidationError(`Missing required fields: ${missingFields.join(', ')}.`);
  }
}

async function login(credentials) {
  const { email, password } = normalizeCredentials(credentials);

  validateRequiredFields({ email, password });

  const user = await User.findOne({ email }).select('+password');

  if (!user) {
    throw new UnauthorizedError('Invalid credentials.');
  }

  const passwordMatches = await bcrypt.compare(password, user.password);

  if (!passwordMatches) {
    throw new UnauthorizedError('Invalid credentials.');
  }

  const token = jwt.sign({ email: user.email }, env.jwtSecret, {
    subject: user.id,
    expiresIn: env.jwtExpiresIn
  });

  return {
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email
    }
  };
}

module.exports = {
  login
};

