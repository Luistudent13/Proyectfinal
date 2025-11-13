// Backend/routes/reportes.js
const express = require("express");
const router = express.Router();
const reportesController = require("../controllers/reportesController");
const catchAsync = require("../middlewares/catchAsync");
const { verificarToken } = require("../middlewares/authJWT");

// Crear reporte (ADMIN o GUARDIA)
router.post(
  "/",
  verificarToken(["ADMIN", "GUARDIA"]),
  catchAsync(reportesController.registrarReporte)
);

// Ver todos los reportes (solo ADMIN)
router.get(
  "/",
  verificarToken(["ADMIN"]),
  catchAsync(reportesController.obtenerReportes)
);

module.exports = router;
