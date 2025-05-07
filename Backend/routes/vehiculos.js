const express = require("express");
const router = express.Router();
const vehiculosController = require("../controllers/vehiculosController");

// 🔹 GET /vehiculos → obtener todos los vehículos
router.get("/", vehiculosController.obtenerVehiculos);

// 🔹 POST /vehiculos → registrar un nuevo vehículo
router.post("/", vehiculosController.registrarVehiculo);

// 🔹 GET /vehiculos/placa/:placa → buscar un vehículo por placa
router.get("/placa/:placa", vehiculosController.buscarVehiculoPorPlaca);

module.exports = router;
