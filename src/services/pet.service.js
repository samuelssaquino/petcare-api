const mongoose = require('mongoose');

const Pet = require('../models/pet.model');
const { NotFoundError, ValidationError } = require('../utils/errors');

function trimString(value) {
  return typeof value === 'string' ? value.trim() : value;
}

function normalizePetData(petData = {}) {
  return {
    name: trimString(petData.name),
    species: trimString(petData.species),
    breed: trimString(petData.breed),
    age: petData.age,
    weight: petData.weight,
    notes: trimString(petData.notes)
  };
}

function validateNonNegativeNumber(value, fieldName) {
  if (value !== undefined && (typeof value !== 'number' || value < 0)) {
    throw new ValidationError(`Pet ${fieldName} must be a non-negative number.`);
  }
}

function validatePetData({ name, age, weight }) {
  if (!name) {
    throw new ValidationError('Pet name is required.');
  }

  validateNonNegativeNumber(age, 'age');
  validateNonNegativeNumber(weight, 'weight');
}

function validatePetId(petId) {
  if (!mongoose.isValidObjectId(petId)) {
    throw new ValidationError('Invalid pet id.');
  }
}

function addDefinedField(target, source, fieldName) {
  if (source[fieldName] !== undefined) {
    target[fieldName] = source[fieldName];
  }
}

function toPublicPet(pet) {
  const petData = typeof pet.toObject === 'function' ? pet.toObject({ virtuals: true }) : pet;
  const publicPet = {};

  addDefinedField(publicPet, petData, 'id');
  addDefinedField(publicPet, petData, 'name');
  addDefinedField(publicPet, petData, 'species');
  addDefinedField(publicPet, petData, 'breed');
  addDefinedField(publicPet, petData, 'age');
  addDefinedField(publicPet, petData, 'weight');
  addDefinedField(publicPet, petData, 'notes');
  addDefinedField(publicPet, petData, 'createdAt');
  addDefinedField(publicPet, petData, 'updatedAt');

  return publicPet;
}

async function createPet(ownerId, petData) {
  const normalizedPetData = normalizePetData(petData);

  validatePetData(normalizedPetData);

  return Pet.create({
    ...normalizedPetData,
    owner: ownerId
  });
}

async function listPets(ownerId) {
  const pets = await Pet.find({ owner: ownerId }).sort({ createdAt: -1 });

  return pets.map(toPublicPet);
}

async function getPetById(ownerId, petId) {
  validatePetId(petId);

  const pet = await Pet.findOne({ _id: petId, owner: ownerId });

  if (!pet) {
    throw new NotFoundError('Pet not found.');
  }

  return toPublicPet(pet);
}

module.exports = {
  createPet,
  getPetById,
  listPets
};

