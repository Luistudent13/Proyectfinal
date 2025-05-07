const db = require("../config/database");

// 🔹 Obtener todos los accesos registrados
exports.obtenerAccesos = async (req, res) => {
  try {
    const [resultados] = await db.query("SELECT * FROM registros_acceso ORDER BY Fecha DESC");
    res.json(resultados);
  } catch (error) {
    console.error("Error al obtener accesos:", error);
    res.status(500).json({ error: "Error al obtener accesos" });
  }
};

// 🔹 Registrar un nuevo acceso (entrada o salida)
exports.registrarAcceso = async (req, res) => {
  const { ID_Usuario, Tipo_Acceso } = req.body;

  if (!ID_Usuario || !Tipo_Acceso) {
    return res.status(400).json({ error: "Faltan datos requeridos" });
  }

  try {
    const [resultado] = await db.query(
      "INSERT INTO registros_acceso (ID_Usuario, Tipo_Acceso, Fecha) VALUES (?, ?, NOW())",
      [ID_Usuario, Tipo_Acceso]
    );

    res.status(201).json({ mensaje: "Acceso registrado exitosamente", ID_Acceso: resultado.insertId });
  } catch (error) {
    console.error("Error al registrar acceso:", error);
    res.status(500).json({ error: "Error al registrar acceso" });
  }
};

// 🔹 Buscar accesos por matrícula
exports.buscarAccesosPorMatricula = async (req, res) => {
  const { matricula } = req.params;

  try {
    const [resultados] = await db.query(
      `SELECT ra.*, u.Nombre, u.Apellidos, v.Placa
       FROM registros_acceso ra
       JOIN usuarios u ON ra.ID_Usuario = u.ID_Usuario
       JOIN vehiculos v ON v.ID_Usuario = u.ID_Usuario
       WHERE v.Placa = ?
       ORDER BY ra.Fecha DESC`,
      [matricula]
    );

    res.json(resultados);
  } catch (error) {
    console.error("Error al buscar accesos por matrícula:", error);
    res.status(500).json({ error: "Error al buscar accesos" });
  }
};
