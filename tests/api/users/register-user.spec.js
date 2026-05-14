const request = require('supertest');

let expect;

before(async () => {
  ({ expect } = await import('chai'));
});

function getBaseUrl() {
  if (!process.env.BASE_URL) {
    throw new Error('BASE_URL is required. Example: BASE_URL=http://localhost:3000 npm run test:api');
  }

  return process.env.BASE_URL;
}

function uniqueEmail(caseId) {
  const uniqueSuffix = `${Date.now()}-${Math.random().toString(16).slice(2)}`;

  return `cdp1-${caseId}-${uniqueSuffix}@example.com`;
}

function validatePublicRegisteredUser(responseBody, expectedUser) {
  expect(responseBody).to.be.an('object');
  expect(responseBody).to.have.property('id').that.is.a('string').and.is.not.empty;
  expect(responseBody).to.have.property('name', expectedUser.name);
  expect(responseBody).to.have.property('email', expectedUser.email);
  expect(responseBody).to.not.have.property('password');
  expect(responseBody).to.not.have.property('passwordHash');
}

describe('CDP-1 - Registrar usuario na petcare-api', () => {
  describe('POST /api/users', () => {
    it('CT-CDP-1-001 - registra usuario com dados obrigatorios validos', async () => {
      const email = uniqueEmail('001');
      const payload = {
        name: 'Ana Silva',
        email,
        password: 'Password123'
      };

      const response = await request(getBaseUrl())
        .post('/api/users')
        .set('Content-Type', 'application/json')
        .send(payload)
        .expect(201);

      validatePublicRegisteredUser(response.body, {
        name: payload.name,
        email
      });
    });

    it('CT-CDP-1-002 - registra usuario valido normalizando espacos e e-mail em maiusculas', async () => {
      const email = uniqueEmail('002');
      const payload = {
        name: '  Bruno Costa  ',
        email: `  ${email.toUpperCase()}  `,
        password: 'Password123'
      };

      const response = await request(getBaseUrl())
        .post('/api/users')
        .set('Content-Type', 'application/json')
        .send(payload)
        .expect(201);

      validatePublicRegisteredUser(response.body, {
        name: 'Bruno Costa',
        email
      });
    });

    it('CT-CDP-1-003 - registra usuario com nome valido contendo caracteres acentuados', async () => {
      const email = uniqueEmail('003');
      const payload = {
        name: 'João Luís Ávila',
        email,
        password: 'Password123'
      };

      const response = await request(getBaseUrl())
        .post('/api/users')
        .set('Content-Type', 'application/json')
        .send(payload)
        .expect(201);

      validatePublicRegisteredUser(response.body, {
        name: payload.name,
        email
      });
    });
  });
});
