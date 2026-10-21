const express = require('express');
const router = express.Router();
const authController = require('../controllers/AuthController');

// Ruta para iniciar sesión (POST a /api/auth/login)
router.post('/login', authController.login);

module.exports = router;