const express = require("express");
const router = express.Router();
const accesosController = require("../controllers/accesosController");

// 🔹 GET /accesos
router.get("/", accesosController.obtenerAccesos);

// 🔹 POST /accesos
router.post("/", accesosController.registrarAcceso);

// 🔹 GET /accesos/matricula/:matricula
router.get("/matricula/:matricula", accesosController.buscarAccesosPorMatricula);

router.post("/salida", accesosController.registrarSalida);


module.exports = router;
