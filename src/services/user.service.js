const bcrypt = require('bcryptjs');
const User = require('../models/user.model');
const { ConflictError, ValidationError } = require('../utils/errors');

async function registerUser({ name, email, password }) {
  if (!name || !email || !password) {
    throw new ValidationError('Name, email and password are required.');
  }

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

