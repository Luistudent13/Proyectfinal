const express = require("express");
const router = express.Router();
const reportesController = require("../controllers/reportesController");
const catchAsync = require("../middlewares/catchAsync");

router.post("/", catchAsync(reportesController.registrarReporte));
router.get("/",  catchAsync(reportesController.obtenerReportes));

module.exports = router;
