// src/routes/authRoutes.js
const express = require('express');
const router = express.Router();

// Importar controladores de autenticación y middleware
const { register, login, getProfile } = require('../controllers/authController');
const verifyToken = require('../middlewares/authMiddleware');

// Ruta pública: Registro de nuevos usuarios
router.post('/users', register);

// Ruta pública: Inicio de sesión
router.post('/login', login);

// Ruta privada: Obtener datos del perfil actual (requiere JWT)
router.get('/users/me', verifyToken, getProfile);

module.exports = router;