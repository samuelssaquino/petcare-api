const test = require('node:test');
const assert = require('node:assert/strict');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../../src/models/user.model');
const authService = require('../../src/services/auth.service');

const originalFindOne = User.findOne;
const originalCompare = bcrypt.compare;
const originalSign = jwt.sign;

function restoreMocks() {
  User.findOne = originalFindOne;
  bcrypt.compare = originalCompare;
  jwt.sign = originalSign;
}

test.afterEach(() => {
  restoreMocks();
});

test('logs in a user with valid credentials and returns an auth token', async () => {
  let findOneQuery;
  let selectedField;
  let signPayload;
  let signOptions;

  User.findOne = (query) => {
    findOneQuery = query;

    return {
      select: async (field) => {
        selectedField = field;

        return {
          id: 'user-id',
          name: 'Samuel Aquino',
          email: 'samuel@example.com',
          password: 'hashed-password'
        };
      }
    };
  };
  bcrypt.compare = async (password, hashedPassword) => {
    assert.equal(password, 'Password123');
    assert.equal(hashedPassword, 'hashed-password');
    return true;
  };
  jwt.sign = (payload, secret, options) => {
    signPayload = payload;
    signOptions = options;

    assert.equal(secret, 'change-me');
    return 'auth-token';
  };

  const result = await authService.login({
    email: ' SAMUEL@EXAMPLE.COM ',
    password: 'Password123'
  });

  assert.deepEqual(findOneQuery, { email: 'samuel@example.com' });
  assert.equal(selectedField, '+password');
  assert.deepEqual(signPayload, { email: 'samuel@example.com' });
  assert.equal(signOptions.subject, 'user-id');
  assert.equal(signOptions.expiresIn, '1d');
  assert.deepEqual(result, {
    token: 'auth-token',
    user: {
      id: 'user-id',
      name: 'Samuel Aquino',
      email: 'samuel@example.com'
    }
  });
});

test('rejects login when email does not exist with generic unauthorized error', async () => {
  User.findOne = () => ({
    select: async () => null
  });

  await assert.rejects(
    () => authService.login({
      email: 'samuel@example.com',
      password: 'Password123'
    }),
    (error) => {
      assert.equal(error.statusCode, 401);
      assert.equal(error.message, 'Invalid credentials.');
      return true;
    }
  );
});

test('rejects login when password does not match with generic unauthorized error', async () => {
  User.findOne = () => ({
    select: async () => ({
      id: 'user-id',
      email: 'samuel@example.com',
      password: 'hashed-password'
    })
  });
  bcrypt.compare = async () => false;

  await assert.rejects(
    () => authService.login({
      email: 'samuel@example.com',
      password: 'WrongPassword123'
    }),
    (error) => {
      assert.equal(error.statusCode, 401);
      assert.equal(error.message, 'Invalid credentials.');
      return true;
    }
  );
});

test('rejects login without required fields and lists missing fields', async () => {
  await assert.rejects(
    () => authService.login({}),
    (error) => {
      assert.equal(error.statusCode, 400);
      assert.match(error.message, /email/);
      assert.match(error.message, /password/);
      return true;
    }
  );
});
