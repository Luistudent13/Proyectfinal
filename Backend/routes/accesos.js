// accesos.js (Router)
const express = require('express');
const router = express.Router();
const accesosCtrl = require('../controllers/accesosController');

// GET /accesos  -> historial
router.get('/', accesosCtrl.listarAccesos); // si ya lo tienes, déjalo igual

// POST /accesos -> ingreso con anti-duplicado
router.post('/', accesosCtrl.crearAcceso);

// POST /accesos/salida -> salida por placa con validación de abierto
router.post('/salida', accesosCtrl.registrarSalidaPorPlaca);

module.exports = router;
