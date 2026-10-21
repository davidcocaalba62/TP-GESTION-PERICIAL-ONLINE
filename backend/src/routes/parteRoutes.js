const express = require('express');
// El "mergeParams: true" es clave acá para que esta ruta pueda leer el "casoId" de la URL principal
const router = express.Router({ mergeParams: true }); 
const parteController = require('../controllers/ParteController');

// Estas rutas ya están protegidas porque las vamos a "colgar" de la ruta principal de casos
router.post('/', parteController.crearParte);
router.get('/', parteController.listarPartesPorCaso);

module.exports = router;