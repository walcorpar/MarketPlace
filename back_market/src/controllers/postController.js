// src/controllers/postController.js
const pool = require('../config/db');

// 1. OBTENER TODAS LAS PUBLICACIONES (GET /posts - Pública)
const getPosts = async (req, res) => {
  try {
    const query = `
      SELECT p.id, p.title, p.description, p.price, p.aroma_type, p.img_url, p.created_at,
             u.id AS vendor_id, u.name AS vendor_name, u.city AS vendor_city
      FROM posts p
      JOIN users u ON p.user_id = u.id
      ORDER BY p.created_at DESC
    `;
    const result = await pool.query(query);
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error en getPosts:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

// 2. OBTENER DETALLE DE UNA VELA (GET /posts/:id - Pública)
const getPostById = async (req, res) => {
  try {
    const { id } = req.params;
    const query = `
      SELECT p.id, p.title, p.description, p.price, p.aroma_type, p.img_url, p.created_at,
             u.id AS vendor_id, u.name AS vendor_name, u.email AS vendor_email, u.city AS vendor_city
      FROM posts p
      JOIN users u ON p.user_id = u.id
      WHERE p.id = $1
    `;
    const result = await pool.query(query, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Publicación no encontrada' });
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error('Error en getPostById:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

// 3. CREAR NUEVA PUBLICACIÓN (POST /posts - Privada)
const createPost = async (req, res) => {
  try {
    const { title, description, price, aroma_type, img_url } = req.body;
    const user_id = req.user.id; // Obtenido desde el middleware JWT

    if (!title || !description || !price) {
      return res.status(400).json({ message: 'Título, descripción y precio son requeridos' });
    }

    const query = `
      INSERT INTO posts (user_id, title, description, price, aroma_type, img_url)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `;
    const values = [user_id, title, description, price, aroma_type || null, img_url || null];
    const newPost = await pool.query(query, values);

    res.status(201).json({
      message: 'Publicación creada exitosamente',
      post: newPost.rows[0]
    });
  } catch (error) {
    console.error('Error en createPost:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

// 4. ELIMINAR PUBLICACIÓN PROPIA (DELETE /posts/:id - Privada)
const deletePost = async (req, res) => {
  try {
    const { id } = req.params;
    const user_id = req.user.id;

    // Verificar si la publicación pertenece al usuario
    const postCheck = await pool.query('SELECT * FROM posts WHERE id = $1', [id]);
    
    if (postCheck.rows.length === 0) {
      return res.status(404).json({ message: 'Publicación no encontrada' });
    }

    if (postCheck.rows[0].user_id !== user_id) {
      return res.status(403).json({ message: 'No tienes permiso para eliminar esta publicación' });
    }

    await pool.query('DELETE FROM posts WHERE id = $1', [id]);
    res.status(200).json({ message: 'Publicación eliminada correctamente' });
  } catch (error) {
    console.error('Error en deletePost:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

module.exports = {
  getPosts,
  getPostById,
  createPost,
  deletePost
};