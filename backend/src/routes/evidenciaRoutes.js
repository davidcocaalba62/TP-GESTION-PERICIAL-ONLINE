const express = require('express');
const router = express.Router({ mergeParams: true });
const evidenciaController = require('../controllers/EvidenciaController');
const upload = require('../middlewares/uploadMiddleware');
const { verificarToken } = require('../middlewares/authMiddleware'); // <-- 1. Importar el verificador

// Ruta para subir evidencia (Protegida con JWT para registrar qué perito la subió)
router.post('/', verificarToken, upload.single('archivo'), evidenciaController.subirEvidencia);

// Ruta para descargar una evidencia específica (Protegida con JWT)
router.get('/:evidenciaId/descargar', verificarToken, evidenciaController.descargarEvidencia);

module.exports = router;