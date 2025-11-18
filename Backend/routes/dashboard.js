const express = require("express");
const router = express.Router();
const db = require("../config/database");
const catchAsync = require("../middlewares/catchAsync");

// ==============================
//  DISPONIBLES
// ==============================
router.get("/disponibles", catchAsync(async (req, res) => {
  const [rows] = await db.query(`
    SELECT COUNT(*) AS disponibles
    FROM cajones_estacionamiento
    WHERE ID_Estado = 1
  `);
  res.json(rows[0]);
}));

// ==============================
//  OCUPADOS
// ==============================
router.get("/ocupados", catchAsync(async (req, res) => {
  const [rows] = await db.query(`
    SELECT COUNT(*) AS ocupados
    FROM cajones_estacionamiento
    WHERE ID_Estado = 2
  `);
  res.json(rows[0]);
}));

// ==============================
//  TOTAL DE ESPACIOS
// ==============================
router.get("/total", catchAsync(async (req, res) => {
  const [rows] = await db.query(`
    SELECT COUNT(*) AS total
    FROM cajones_estacionamiento
  `);
  res.json(rows[0]);
}));

// ==============================
//  TEMPORALES ACTIVOS HOY
// ==============================
router.get("/temporales", catchAsync(async (req, res) => {
  const [rows] = await db.query(`
    SELECT COUNT(*) AS temporales
    FROM registros_acceso ra
    INNER JOIN usuarios u ON u.ID_Usuario = ra.ID_Usuario
    WHERE u.ID_Tipo_Usuario = 5
      AND ra.Fecha_Acceso = CURDATE()
  `);
  res.json(rows[0]);
}));

// ==============================
//  GENERAL
// ==============================
router.get("/general", catchAsync(async (req, res) => {

  const [[disponibles]] = await db.query(`
    SELECT COUNT(*) AS disponibles
    FROM cajones_estacionamiento
    WHERE ID_Estado = 1
  `);

  const [[ocupados]] = await db.query(`
    SELECT COUNT(*) AS ocupados
    FROM cajones_estacionamiento
    WHERE ID_Estado = 2
  `);

  const [[total]] = await db.query(`
    SELECT COUNT(*) AS total
    FROM cajones_estacionamiento
  `);

  const [[temporales]] = await db.query(`
    SELECT COUNT(*) AS temporales
    FROM registros_acceso ra
    INNER JOIN usuarios u ON u.ID_Usuario = ra.ID_Usuario
    WHERE u.ID_Tipo_Usuario = 5
      AND ra.Fecha_Acceso = CURDATE()
  `);

  res.json({
    disponibles: disponibles.disponibles,
    ocupados: ocupados.ocupados,
    total: total.total,
    temporales: temporales.temporales
  });
}));

module.exports = router;