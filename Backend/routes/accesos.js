// Backend/routes/accesos.js
const express = require("express");
const router = express.Router();
const accesosCtrl = require("../controllers/accesosController");
const catchAsync = require("../middlewares/catchAsync");
const { verificarToken } = require("../middlewares/authJWT");

// Historial de accesos
router.get(
  "/",
  verificarToken(["ADMIN", "GUARDIA"]),
  catchAsync(accesosCtrl.listarAccesos)
);

// Registrar ingreso
router.post(
  "/",
  verificarToken(["ADMIN", "GUARDIA"]),
  catchAsync(accesosCtrl.crearAcceso)
);

// Registrar salida por placa
router.post(
  "/salida",
  verificarToken(["ADMIN", "GUARDIA"]),
  catchAsync(accesosCtrl.registrarSalidaPorPlaca)
);

module.exports = router;
