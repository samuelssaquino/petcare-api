const test = require('node:test');
const assert = require('node:assert/strict');

const petService = require('../../src/services/pet.service');
const petController = require('../../src/controllers/pet.controller');

const originalListPets = petService.listPets;
const originalGetPetById = petService.getPetById;

function restoreMocks() {
  petService.listPets = originalListPets;
  petService.getPetById = originalGetPetById;
}

function createResponse() {
  return {
    statusCode: undefined,
    body: undefined,
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(payload) {
      this.body = payload;
      return this;
    }
  };
}

test.afterEach(() => {
  restoreMocks();
});

test('responds with status 200 and authenticated user pets', async () => {
  const req = {
    user: {
      id: 'user-id'
    }
  };
  const res = createResponse();
  let requestedOwnerId;

  petService.listPets = async (ownerId) => {
    requestedOwnerId = ownerId;

    return [
      {
        id: 'pet-id',
        name: 'Thor',
        species: 'Dog'
      }
    ];
  };

  await petController.listPets(req, res, () => {});

  assert.equal(requestedOwnerId, 'user-id');
  assert.equal(res.statusCode, 200);
  assert.deepEqual(res.body, {
    pets: [
      {
        id: 'pet-id',
        name: 'Thor',
        species: 'Dog'
      }
    ]
  });
});

test('responds with an empty list when authenticated user has no pets', async () => {
  const req = {
    user: {
      id: 'user-id'
    }
  };
  const res = createResponse();

  petService.listPets = async () => [];

  await petController.listPets(req, res, () => {});

  assert.equal(res.statusCode, 200);
  assert.deepEqual(res.body, {
    pets: []
  });
});

test('responds with status 200 and requested authenticated user pet', async () => {
  const req = {
    params: {
      petId: '6636b70158c7a946d60ca100'
    },
    user: {
      id: 'user-id'
    }
  };
  const res = createResponse();
  let requestedOwnerId;
  let requestedPetId;

  petService.getPetById = async (ownerId, petId) => {
    requestedOwnerId = ownerId;
    requestedPetId = petId;

    return {
      id: 'pet-id',
      name: 'Thor',
      species: 'Dog'
    };
  };

  await petController.getPetById(req, res, () => {});

  assert.equal(requestedOwnerId, 'user-id');
  assert.equal(requestedPetId, '6636b70158c7a946d60ca100');
  assert.equal(res.statusCode, 200);
  assert.deepEqual(res.body, {
    id: 'pet-id',
    name: 'Thor',
    species: 'Dog'
  });
});
