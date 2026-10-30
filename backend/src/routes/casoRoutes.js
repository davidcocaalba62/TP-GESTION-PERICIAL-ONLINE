const express = require('express');
const router = express.Router();
const casoController = require('../controllers/CasoController');
const { verificarToken, soloAdmin, adminOSenior } = require('../middlewares/authMiddleware');
const parteRoutes = require('./parteRoutes');
const evidenciaRoutes = require('./evidenciaRoutes');

// TODAS las rutas de casos van a requerir estar logueado (verificarToken)
router.use(verificarToken);

// Solo Admin o Senior pueden listar los casos
router.get('/', casoController.listarCasos);

// Cualquier perito logueado puede crear un caso nuevo
router.post('/', casoController.crearCaso);

// Cualquier petición que termine en /evidencias se delega al enrutador de evidencias
router.use('/:casoId/evidencias', evidenciaRoutes);

module.exports = router;
// Cualquier petición que termine en /partes se delega al enrutador de partes
router.use('/:casoId/partes', parteRoutes);