const { Router } = require('express');
const petController = require('../controllers/pet.controller');
const { authMiddleware } = require('../middlewares/auth.middleware');

const router = Router();

router.post('/pets', authMiddleware, petController.createPet);
router.get('/pets', authMiddleware, petController.listPets);
router.get('/pets/:petId', authMiddleware, petController.getPetById);

module.exports = router;

