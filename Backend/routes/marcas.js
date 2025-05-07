const express = require("express");
const router = express.Router();
const marcasController = require("../controllers/marcasController");

// 🔹 GET /marcas → obtener todas las marcas
router.get("/", marcasController.obtenerMarcas);

// 🔹 POST /marcas → registrar una nueva marca
router.post("/", marcasController.registrarMarca);

module.exports = router;
