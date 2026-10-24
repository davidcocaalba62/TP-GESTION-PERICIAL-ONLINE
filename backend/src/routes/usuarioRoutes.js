const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/UsuarioController');

// Ruta para crear un nuevo usuario (Alta de perito)
router.post('/', usuarioController.crearUsuario);

// Ruta para listar todos los usuarios
router.get('/', usuarioController.listarUsuarios);

// Ruta para blanquear/resetear la contraseña de un usuario
router.put('/reset-password', usuarioController.resetPassword);

// (Arriba ya deberías tener definido "const router = express.Router();" y el controlador)

router.post('/login', usuarioController.login); // Nueva ruta para iniciar sesión

module.exports = router;