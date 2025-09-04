const db = require("../config/database");

// 🔹 POST /accesos → Registrar un nuevo acceso (entrada)
exports.registrarAcceso = async (req, res) => {
  try {
    const { ID_Usuario, ID_Vehiculo } = req.body;
    if (!ID_Usuario || !ID_Vehiculo) {
      return res.status(400).json({ mensaje: "Faltan ID_Usuario o ID_Vehiculo" });
    }

    // 1) Anti-duplicado: ¿ya hay un acceso abierto para este vehículo?
    const [accesosActivos] = await db.query(
      `SELECT ID_Acceso
       FROM registros_acceso
       WHERE ID_Vehiculo = ? AND Hora_Salida IS NULL`,
      [ID_Vehiculo]
    );
    if (accesosActivos.length > 0) {
      return res.status(409).json({ mensaje: "Este vehículo ya está dentro." });
    }

    // 2) Insertar acceso
    const [resultado] = await db.query(
      `INSERT INTO registros_acceso (ID_Vehiculo, ID_Usuario, Hora_Entrada, Fecha_Acceso)
       VALUES (?, ?, CURRENT_TIME(), CURDATE())`,
      [ID_Vehiculo, ID_Usuario]
    );

    return res.status(201).json({
      mensaje: "Acceso registrado exitosamente",
      ID_Acceso: resultado.insertId
    });
  } catch (err) {
    console.error("Error registrarAcceso:", err);
    return res.status(500).json({ mensaje: "Error del servidor" });
  }
};

// 🔹 POST /accesos/salida → Registrar salida por placa
exports.registrarSalida = async (req, res) => {
  try {
    let { placa } = req.body;
    if (!placa) return res.status(400).json({ mensaje: "Falta placa" });
    placa = String(placa).trim().toUpperCase();

    // 1) Resolver vehículo por placa
    const [vehRows] = await db.query(
      `SELECT ID_Vehiculo
       FROM vehiculos
       WHERE UPPER(Placa) = ?
       LIMIT 1`,
      [placa]
    );
    if (vehRows.length === 0) {
      return res.status(404).json({ mensaje: "Placa no registrada" });
    }
    const { ID_Vehiculo } = vehRows[0];

    // 2) Buscar acceso abierto
    const [accRows] = await db.query(
      `SELECT ID_Acceso
       FROM registros_acceso
       WHERE ID_Vehiculo = ? AND Hora_Salida IS NULL
       ORDER BY ID_Acceso DESC
       LIMIT 1`,
      [ID_Vehiculo]
    );
    if (accRows.length === 0) {
      return res.status(404).json({ mensaje: "No hay un acceso abierto para esta placa." });
    }

    const { ID_Acceso } = accRows[0];

    // 3) Cerrar acceso
    await db.query(
      `UPDATE registros_acceso
       SET Hora_Salida = CURRENT_TIME()
       WHERE ID_Acceso = ?`,
      [ID_Acceso]
    );

    return res.json({ mensaje: "Salida registrada" });
  } catch (err) {
    console.error("Error registrarSalida:", err);
    return res.status(500).json({ mensaje: "Error del servidor" });
  }
};

// Alias y exportación unificada
module.exports = {
  listarAccesos: async (req, res) => {
    try {
      const [rows] = await db.query(`
        SELECT 
          ra.ID_Acceso,
          u.Nombre_Completo,
          v.Placa,
          ra.Fecha_Acceso,
          ra.Hora_Entrada,
          ra.Hora_Salida
        FROM registros_acceso ra
        JOIN usuarios u ON u.ID_Usuario = ra.ID_Usuario
        JOIN vehiculos v ON v.ID_Vehiculo = ra.ID_Vehiculo
        ORDER BY ra.ID_Acceso DESC
      `);
      res.json(rows);
    } catch (err) {
      console.error("Error listarAccesos:", err);
      res.status(500).json({ mensaje: "Error al obtener accesos" });
    }
  },

  // Renombramos registrarAcceso → crearAcceso
  crearAcceso: exports.registrarAcceso,

  // Renombramos registrarSalida → registrarSalidaPorPlaca
  registrarSalidaPorPlaca: exports.registrarSalida
};

