const db = require("../config/database");
const httpError = require("../utils/httpError");

exports.registrarReporte = async (req, res) => {
  const { nombre, tipo, problema } = req.body;
  if (!nombre || !tipo || !problema) {
    throw httpError(400, "Campos incompletos para el reporte");
  }
  const sql = `INSERT INTO reportes (Nombre, Tipo_Usuario, Problema) VALUES (?, ?, ?)`;
  await db.query(sql, [nombre, tipo, problema]);
  res.status(200).json({ mensaje: "Reporte guardado correctamente" });
};

exports.obtenerReportes = async (req, res) => {
  const [rows] = await db.query("SELECT * FROM reportes ORDER BY Fecha DESC");
  res.json(rows);
};
