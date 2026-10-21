const express = require('express');
const router = express.Router({ mergeParams: true });
const evidenciaController = require('../controllers/EvidenciaController');
const upload = require('../middlewares/uploadMiddleware');

// Ruta para subir evidencia (ya la tenías)
router.post('/', upload.single('archivo'), evidenciaController.subirEvidencia);

// NUEVA RUTA: Para descargar una evidencia específica (ej: /api/casos/2/evidencias/1/descargar)
router.get('/:evidenciaId/descargar', evidenciaController.descargarEvidencia);

module.exports = router;