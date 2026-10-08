// src/routes/favRoutes.js
const express = require('express');
const router = express.Router();
const { getFavorites, addFavorite, removeFavorite } = require('../controllers/favController');
const verifyToken = require('../middlewares/authMiddleware');

// Todas las rutas de favoritos son privadas y requieren token JWT
router.use(verifyToken);

router.get('/', getFavorites);
router.post('/', addFavorite);
router.delete('/:id', removeFavorite);

module.exports = router;