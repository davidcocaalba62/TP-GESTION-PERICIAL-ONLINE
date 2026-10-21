const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/UsuarioController');

// Rutas para usuarios
router.post('/', usuarioController.crearUsuario);
router.get('/', usuarioController.listarUsuarios);

module.exports = router;