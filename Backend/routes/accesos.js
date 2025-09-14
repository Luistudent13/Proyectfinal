const express = require('express');
const router = express.Router();
const accesosCtrl = require('../controllers/accesosController');
const catchAsync = require("../middlewares/catchAsync");

// GET /accesos -> historial
router.get('/',          catchAsync(accesosCtrl.listarAccesos));

// POST /accesos -> ingreso
router.post('/',         catchAsync(accesosCtrl.crearAcceso));

// POST /accesos/salida -> salida por placa
router.post('/salida',   catchAsync(accesosCtrl.registrarSalidaPorPlaca));

module.exports = router;
