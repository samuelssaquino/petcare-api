const test = require('node:test');
const assert = require('node:assert/strict');
const jwt = require('jsonwebtoken');

const { authMiddleware } = require('../../src/middlewares/auth.middleware');

const originalVerify = jwt.verify;

function restoreMocks() {
  jwt.verify = originalVerify;
}

test.afterEach(() => {
  restoreMocks();
});

test('rejects requests without authentication token', () => {
  const req = {
    headers: {}
  };
  let nextError;

  authMiddleware(req, {}, (error) => {
    nextError = error;
  });

  assert.equal(nextError.statusCode, 401);
  assert.equal(nextError.message, 'Authentication token is required.');
});

test('sets authenticated user from a valid bearer token', () => {
  const req = {
    headers: {
      authorization: 'Bearer valid-token'
    }
  };
  let nextError;
  let verifiedToken;

  jwt.verify = (token) => {
    verifiedToken = token;
    return {
      sub: 'user-id',
      email: 'samuel@example.com'
    };
  };

  authMiddleware(req, {}, (error) => {
    nextError = error;
  });

  assert.equal(verifiedToken, 'valid-token');
  assert.equal(nextError, undefined);
  assert.deepEqual(req.user, {
    id: 'user-id',
    email: 'samuel@example.com'
  });
});
