const test = require('node:test');
const assert = require('node:assert/strict');

const Pet = require('../../src/models/pet.model');
const petService = require('../../src/services/pet.service');

const originalCreate = Pet.create;
const originalFind = Pet.find;

function restoreMocks() {
  Pet.create = originalCreate;
  Pet.find = originalFind;
}

test.afterEach(() => {
  restoreMocks();
});

test('creates a pet with valid data and associates it with the owner', async () => {
  let createdPayload;

  Pet.create = async (payload) => {
    createdPayload = payload;

    return {
      id: 'pet-id',
      ...payload
    };
  };

  const result = await petService.createPet('user-id', {
    name: ' Thor ',
    species: ' Dog ',
    breed: ' Golden Retriever ',
    age: 3,
    weight: 28.5,
    notes: ' Friendly and playful. '
  });

  assert.deepEqual(createdPayload, {
    name: 'Thor',
    species: 'Dog',
    breed: 'Golden Retriever',
    age: 3,
    weight: 28.5,
    notes: 'Friendly and playful.',
    owner: 'user-id'
  });
  assert.deepEqual(result, {
    id: 'pet-id',
    ...createdPayload
  });
});

test('rejects pet creation without name', async () => {
  await assert.rejects(
    () => petService.createPet('user-id', {
      species: 'Dog'
    }),
    (error) => {
      assert.equal(error.statusCode, 400);
      assert.equal(error.message, 'Pet name is required.');
      return true;
    }
  );
});

test('rejects pet creation with blank name', async () => {
  await assert.rejects(
    () => petService.createPet('user-id', {
      name: '   '
    }),
    (error) => {
      assert.equal(error.statusCode, 400);
      assert.equal(error.message, 'Pet name is required.');
      return true;
    }
  );
});

test('rejects pet creation with invalid age', async () => {
  await assert.rejects(
    () => petService.createPet('user-id', {
      name: 'Thor',
      age: -1
    }),
    (error) => {
      assert.equal(error.statusCode, 400);
      assert.equal(error.message, 'Pet age must be a non-negative number.');
      return true;
    }
  );
});

test('rejects pet creation with invalid weight', async () => {
  await assert.rejects(
    () => petService.createPet('user-id', {
      name: 'Thor',
      weight: 'heavy'
    }),
    (error) => {
      assert.equal(error.statusCode, 400);
      assert.equal(error.message, 'Pet weight must be a non-negative number.');
      return true;
    }
  );
});

test('lists pets associated with the owner ordered by creation date', async () => {
  let findQuery;
  let sortQuery;

  Pet.find = (query) => {
    findQuery = query;

    return {
      sort: async (sort) => {
        sortQuery = sort;
        return [{
          id: 'pet-id',
          name: 'Thor',
          species: 'Dog',
          owner: 'user-id',
          __v: 0
        }];
      }
    };
  };

  const result = await petService.listPets('user-id');

  assert.deepEqual(findQuery, { owner: 'user-id' });
  assert.deepEqual(sortQuery, { createdAt: -1 });
  assert.deepEqual(result, [{ id: 'pet-id', name: 'Thor', species: 'Dog' }]);
});

test('returns an empty list when owner has no pets', async () => {
  Pet.find = () => ({
    sort: async () => []
  });

  const result = await petService.listPets('user-id');

  assert.deepEqual(result, []);
});
