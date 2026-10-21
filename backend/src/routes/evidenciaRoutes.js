const express = require('express');
const router = express.Router({ mergeParams: true }); // Para poder leer el ID del caso de la URL
const evidenciaController = require('../controllers/EvidenciaController');
const upload = require('../middlewares/uploadMiddleware'); // Importamos a nuestro guardia de archivos

// La ruta usa el middleware "upload.single('archivo')" para interceptar y guardar el archivo 
// antes de pasarle los datos al controlador. 'archivo' es el nombre del campo que usaremos.
router.post('/', upload.single('archivo'), evidenciaController.subirEvidencia);

module.exports = router;