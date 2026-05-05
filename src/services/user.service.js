const bcrypt = require('bcryptjs');
const User = require('../models/user.model');
const { ConflictError, ValidationError } = require('../utils/errors');

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PASSWORD_REGEX = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/;

function normalizeUserData(userData = {}) {
  return {
    name: typeof userData.name === 'string' ? userData.name.trim() : userData.name,
    email: typeof userData.email === 'string' ? userData.email.trim().toLowerCase() : userData.email,
    password: userData.password
  };
}

function validateRequiredFields({ name, email, password }) {
  const missingFields = [];

  if (!name) {
    missingFields.push('name');
  }

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

function validateEmail(email) {
  if (!EMAIL_REGEX.test(email)) {
    throw new ValidationError('Email must be valid.');
  }
}

function validatePassword(password) {
  if (!PASSWORD_REGEX.test(password)) {
    throw new ValidationError('Password must have at least 8 characters, including letters and numbers.');
  }
}

async function registerUser(userData) {
  const { name, email, password } = normalizeUserData(userData);

  validateRequiredFields({ name, email, password });
  validateEmail(email);
  validatePassword(password);

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    throw new ConflictError('Email is already in use.');
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await User.create({
    name,
    email,
    password: hashedPassword
  });

  return {
    id: user.id,
    name: user.name,
    email: user.email
  };
}

module.exports = {
  registerUser
};

