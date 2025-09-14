const express = require("express");
const router = express.Router();
const marcasController = require("../controllers/marcasController");
const catchAsync = require("../middlewares/catchAsync");

router.get("/",  catchAsync(marcasController.obtenerMarcas));
router.post("/", catchAsync(marcasController.registrarMarca));

module.exports = router;
