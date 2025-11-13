// Backend/routes/marcas.js
const express = require("express");
const router = express.Router();
const marcasController = require("../controllers/marcasController");
const catchAsync = require("../middlewares/catchAsync");
const { verificarToken } = require("../middlewares/authJWT");

// Consultar marcas (ADMIN, GUARDIA)
router.get(
  "/",
  verificarToken(["ADMIN", "GUARDIA"]),
  catchAsync(marcasController.obtenerMarcas)
);

// Registrar marca (solo ADMIN)
router.post(
  "/",
  verificarToken(["ADMIN"]),
  catchAsync(marcasController.registrarMarca)
);

module.exports = router;
