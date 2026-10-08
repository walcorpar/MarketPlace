// src/routes/postRoutes.js
const express = require('express');
const router = express.Router();

const { getPosts, getPostById, createPost, deletePost } = require('../controllers/postController');
const verifyToken = require('../middlewares/authMiddleware');

router.get('/', getPosts);
router.get('/:id', getPostById);

// Línea 12: Si verifyToken o createPost son undefined, falla aquí
router.post('/', verifyToken, createPost); 
router.delete('/:id', verifyToken, deletePost);

module.exports = router;