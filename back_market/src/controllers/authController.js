// src/controllers/authController.js
const pool = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// 1. REGISTRO DE USUARIO (POST /users)
const register = async (req, res) => {
  try {
    const { name, email, password, picture, city } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Nombre, email y contraseña son obligatorios' });
    }

    const userExist = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (userExist.rows.length > 0) {
      return res.status(400).json({ message: 'El correo electrónico ya está registrado' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await pool.query(
      `INSERT INTO users (name, email, password, picture, city) 
       VALUES ($1, $2, $3, $4, $5) 
       RETURNING id, name, email, picture, city`,
      [name, email, hashedPassword, picture || null, city || null]
    );

    res.status(201).json({
      message: 'Usuario registrado exitosamente',
      user: newUser.rows[0],
    });
  } catch (error) {
    console.error('Error en register:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

// 2. INICIO DE SESIÓN (POST /login)
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email y contraseña son obligatorios' });
    }

    const userResult = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (userResult.rows.length === 0) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    const user = userResult.rows[0];

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    const payload = {
      id: user.id,
      email: user.email,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '8h' });

    res.status(200).json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        picture: user.picture,
        city: user.city,
      },
    });
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

// 3. OBTENER PERFIL (GET /users/me)
const getProfile = async (req, res) => {
  try {
    const userResult = await pool.query(
      'SELECT id, name, email, picture, city FROM users WHERE id = $1',
      [req.user.id]
    );

    if (userResult.rows.length === 0) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    res.status(200).json(userResult.rows[0]);
  } catch (error) {
    console.error('Error en getProfile:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

module.exports = {
  register,
  login,
  getProfile,
};