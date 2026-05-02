const userService = require('../services/user.service');

async function registerUser(req, res, next) {
  try {
    const user = await userService.registerUser(req.body);
    res.status(201).json(user);
  } catch (error) {
    next(error);
  }
}

module.exports = {
  registerUser
};

