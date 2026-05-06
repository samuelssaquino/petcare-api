const petService = require('../services/pet.service');

async function createPet(req, res, next) {
  try {
    const pet = await petService.createPet(req.user.id, req.body);
    res.status(201).json(pet);
  } catch (error) {
    next(error);
  }
}

async function listPets(req, res, next) {
  try {
    const pets = await petService.listPets(req.user.id);
    res.status(200).json({ pets });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  createPet,
  listPets
};

