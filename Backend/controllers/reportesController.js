const db = require("../config/database");

exports.registrarReporte = async (req, res) => {
  try {
    const { nombre, tipo, problema } = req.body;  // CAMBIO AQUÍ
    const sql = `INSERT INTO reportes (Nombre, Tipo_Usuario, Problema) VALUES (?, ?, ?)`;  // CAMBIO AQUÍ
    await db.query(sql, [nombre, tipo, problema]);  // CAMBIO AQUÍ
    res.status(200).json({ message: "Reporte guardado correctamente" });
  } catch (error) {
    console.error("Error al registrar reporte:", error);
    res.status(500).json({ error: "Error al guardar el reporte" });
  }
};

exports.obtenerReportes = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM reportes ORDER BY Fecha DESC");
    res.json(rows);
  } catch (error) {
    console.error("Error al obtener reportes:", error);
    res.status(500).json({ error: "Error al consultar reportes" });
  }
};
