const { Router } = require('express');
const authRoutes = require('./auth.routes');
const petRoutes = require('./pet.routes');
const userRoutes = require('./user.routes');

const router = Router();

router.use(userRoutes);
router.use(authRoutes);
router.use(petRoutes);

module.exports = router;

