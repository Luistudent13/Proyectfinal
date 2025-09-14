const express = require("express");
const router = express.Router();
const vehiculosController = require("../controllers/vehiculosController");
const catchAsync = require("../middlewares/catchAsync");

router.get("/",                 catchAsync(vehiculosController.obtenerVehiculos));
router.post("/",                catchAsync(vehiculosController.registrarVehiculo));
router.get("/placa/:placa",     catchAsync(vehiculosController.buscarVehiculoPorPlaca));

module.exports = router;
