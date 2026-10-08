// src/controllers/favController.js
const pool = require('../config/db');

// 1. OBTENER FAVORITOS DEL USUARIO LOGUEADO (GET /favorites - Privada)
const getFavorites = async (req, res) => {
  try {
    const user_id = req.user.id;

    const query = `
      SELECT f.id AS favorite_id, p.id AS post_id, p.title, p.description, p.price, p.aroma_type, p.img_url,
             u.name AS vendor_name, u.city AS vendor_city
      FROM favorites f
      JOIN posts p ON f.post_id = p.id
      JOIN users u ON p.user_id = u.id
      WHERE f.user_id = $1
      ORDER BY f.id DESC
    `;
    const result = await pool.query(query, [user_id]);

    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error en getFavorites:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

// 2. AGREGAR A FAVORITOS (POST /favorites - Privada)
const addFavorite = async (req, res) => {
  try {
    const { post_id } = req.body;
    const user_id = req.user.id;

    if (!post_id) {
      return res.status(400).json({ message: 'El ID de la publicación es requerido' });
    }

    // Verificar si existe la publicación
    const postCheck = await pool.query('SELECT * FROM posts WHERE id = $1', [post_id]);
    if (postCheck.rows.length === 0) {
      return res.status(404).json({ message: 'Publicación no encontrada' });
    }

    // Insertar en favoritos
    const query = `
      INSERT INTO favorites (user_id, post_id)
      VALUES ($1, $2)
      RETURNING *
    `;
    const newFavorite = await pool.query(query, [user_id, post_id]);

    res.status(201).json({
      message: 'Añadido a favoritos exitosamente',
      favorite: newFavorite.rows[0]
    });
  } catch (error) {
    // Manejar duplicados (UNIQUE constraint)
    if (error.code === '23505') {
      return res.status(400).json({ message: 'Esta publicación ya está en tus favoritos' });
    }
    console.error('Error en addFavorite:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

// 3. ELIMINAR DE FAVORITOS (DELETE /favorites/:id - Privada)
const removeFavorite = async (req, res) => {
  try {
    const { id } = req.params; // ID de la publicación (post_id) o del registro favorito
    const user_id = req.user.id;

    const query = 'DELETE FROM favorites WHERE post_id = $1 AND user_id = $2 RETURNING *';
    const result = await pool.query(query, [id, user_id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Favorito no encontrado' });
    }

    res.status(200).json({ message: 'Eliminado de favoritos correctamente' });
  } catch (error) {
    console.error('Error en removeFavorite:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

module.exports = {
  getFavorites,
  addFavorite,
  removeFavorite
};