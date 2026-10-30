const express = require('express');
const router = express.Router({ mergeParams: true });
const evidenciaController = require('../controllers/EvidenciaController');
const upload = require('../middlewares/uploadMiddleware');
const { verificarToken } = require('../middlewares/authMiddleware');

// ¡ESTA ES LA LÍNEA NUEVA! Ruta para leer y listar todas las evidencias del caso
router.get('/', verificarToken, evidenciaController.listarEvidencias);

// Ruta para subir evidencia (Protegida con JWT para registrar qué perito la subió)
router.post('/', verificarToken, upload.single('archivo'), evidenciaController.subirEvidencia);

// Ruta para descargar una evidencia específica (Protegida con JWT)
router.get('/:evidenciaId/descargar', verificarToken, evidenciaController.descargarEvidencia);

module.exports = router;