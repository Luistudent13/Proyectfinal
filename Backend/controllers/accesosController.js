const db = require("../config/database");

// 🔹 Obtener todos los accesos registrados
exports.obtenerAccesos = async (req, res) => {
  try {
    const [resultados] = await db.query(`
  SELECT ra.*, u.Nombre_Completo, v.Placa
  FROM registros_acceso ra
  JOIN usuarios u ON ra.ID_Usuario = u.ID_Usuario
  JOIN vehiculos v ON v.ID_Usuario = u.ID_Usuario
  ORDER BY ra.Fecha_Acceso ASC, ra.Hora_Entrada ASC

`);

    res.json(resultados);
  } catch (error) {
    console.error("Error al obtener accesos:", error);
    res.status(500).json({ error: "Error al obtener accesos" });
  }
};

// 🔹 Registrar un nuevo acceso (entrada o salida)
exports.registrarAcceso = async (req, res) => {
  const { ID_Usuario, ID_Vehiculo } = req.body;

  if (!ID_Usuario || !ID_Vehiculo) {
    return res.status(400).json({ error: "Faltan datos requeridos" });
  }

  try {
    const [resultado] = await db.query(
  "INSERT INTO registros_acceso (ID_Vehiculo, ID_Usuario, Hora_Entrada, Fecha_Acceso) VALUES (?, ?, NOW(), CURDATE())",
  [ID_Vehiculo, ID_Usuario]
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
       ORDER BY ra.Fecha_Acceso DESC`,
      [matricula]
    );

    res.json(resultados);
  } catch (error) {
    console.error("Error al buscar accesos por matrícula:", error);
    res.status(500).json({ error: "Error al buscar accesos" });
  }
};

exports.registrarSalida = async (req, res) => {
  const { placa } = req.body;

  try {
    const [vehiculo] = await db.query(
      'SELECT ID_Vehiculo FROM vehiculos WHERE Placa = ?', [placa]
    );

    if (vehiculo.length === 0) {
      return res.status(404).json({ mensaje: 'Vehículo no encontrado.' });
    }

    const idVehiculo = vehiculo[0].ID_Vehiculo;

    const [resultado] = await db.query(
      `UPDATE registros_acceso 
       SET Hora_Salida = CURRENT_TIME()
       WHERE ID_Vehiculo = ? AND Hora_Salida IS NULL
       ORDER BY ID_Acceso DESC LIMIT 1`,
      [idVehiculo]
    );

    
    if (resultado.affectedRows === 0) {
      return res.status(404).json({ mensaje: 'No se encontró un registro de entrada pendiente para esta placa.' });
    }

    res.status(200).json({ mensaje: 'Salida registrada correctamente.' });
  } catch (error) {
    console.error('Error al registrar salida:', error);
    res.status(500).json({ mensaje: 'Error en el servidor.' });
  }
};
