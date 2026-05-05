const test = require('node:test');
const assert = require('node:assert/strict');
const bcrypt = require('bcryptjs');

const User = require('../../src/models/user.model');
const userService = require('../../src/services/user.service');

const originalFindOne = User.findOne;
const originalCreate = User.create;
const originalHash = bcrypt.hash;

function restoreMocks() {
  User.findOne = originalFindOne;
  User.create = originalCreate;
  bcrypt.hash = originalHash;
}

test.afterEach(() => {
  restoreMocks();
});

test('registers a user with valid data and does not return password', async () => {
  User.findOne = async () => null;
  bcrypt.hash = async () => 'hashed-password';
  User.create = async (payload) => ({
    id: 'user-id',
    name: payload.name,
    email: payload.email,
    password: payload.password
  });

  const result = await userService.registerUser({
    name: ' Samuel Aquino ',
    email: ' SAMUEL@EXAMPLE.COM ',
    password: 'Password123'
  });

  assert.deepEqual(result, {
    id: 'user-id',
    name: 'Samuel Aquino',
    email: 'samuel@example.com'
  });
  assert.equal(Object.hasOwn(result, 'password'), false);
});

test('rejects duplicated email with conflict error', async () => {
  User.findOne = async () => ({ id: 'existing-user' });

  await assert.rejects(
    () => userService.registerUser({
      name: 'Samuel Aquino',
      email: 'samuel@example.com',
      password: 'Password123'
    }),
    (error) => {
      assert.equal(error.statusCode, 409);
      assert.equal(error.message, 'Email is already in use.');
      return true;
    }
  );
});

test('rejects missing required fields with validation error', async () => {
  await assert.rejects(
    () => userService.registerUser({
      email: 'samuel@example.com'
    }),
    (error) => {
      assert.equal(error.statusCode, 400);
      assert.match(error.message, /name/);
      assert.match(error.message, /password/);
      return true;
    }
  );
});

test('rejects invalid email format', async () => {
  await assert.rejects(
    () => userService.registerUser({
      name: 'Samuel Aquino',
      email: 'invalid-email',
      password: 'Password123'
    }),
    (error) => {
      assert.equal(error.statusCode, 400);
      assert.equal(error.message, 'Email must be valid.');
      return true;
    }
  );
});

test('rejects password without minimum policy', async () => {
  await assert.rejects(
    () => userService.registerUser({
      name: 'Samuel Aquino',
      email: 'samuel@example.com',
      password: 'short'
    }),
    (error) => {
      assert.equal(error.statusCode, 400);
      assert.equal(error.message, 'Password must have at least 8 characters, including letters and numbers.');
      return true;
    }
  );
});
