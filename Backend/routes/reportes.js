const express = require("express");
const router = express.Router();
const reportesController = require("../controllers/reportesController");

router.post("/", reportesController.registrarReporte);
router.get("/", reportesController.obtenerReportes);

module.exports = router;
