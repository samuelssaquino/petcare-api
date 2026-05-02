const Pet = require('../models/pet.model');
const { ValidationError } = require('../utils/errors');

async function createPet(ownerId, petData) {
  if (!petData.name) {
    throw new ValidationError('Pet name is required.');
  }

  return Pet.create({
    ...petData,
    owner: ownerId
  });
}

async function listPets(ownerId) {
  return Pet.find({ owner: ownerId }).sort({ createdAt: -1 });
}

module.exports = {
  createPet,
  listPets
};

