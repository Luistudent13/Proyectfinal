// Backend/routes/vehiculos.js
const express = require("express");
const router = express.Router();
const vehiculosController = require("../controllers/vehiculosController");
const catchAsync = require("../middlewares/catchAsync");
const { verificarToken } = require("../middlewares/authJWT");

// ADMIN y GUARDIA pueden consultar y registrar
router.get(
  "/",
  verificarToken(["ADMIN", "GUARDIA"]),
  catchAsync(vehiculosController.obtenerVehiculos)
);

router.post(
  "/",
  verificarToken(["ADMIN", "GUARDIA"]),
  catchAsync(vehiculosController.registrarVehiculo)
);

router.get(
  "/placa/:placa",
  verificarToken(["ADMIN", "GUARDIA"]),
  catchAsync(vehiculosController.buscarVehiculoPorPlaca)
);

module.exports = router;
