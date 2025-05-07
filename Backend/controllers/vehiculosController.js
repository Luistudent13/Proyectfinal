const db = require("../config/database");

// 🔹 Obtener todos los vehículos
exports.obtenerVehiculos = async (req, res) => {
  try {
    const [resultados] = await db.query(
      `SELECT v.*, u.Nombre, u.Apellidos, m.Marca
       FROM vehiculos v
       JOIN usuarios u ON v.ID_Usuario = u.ID_Usuario
       JOIN marca_vehiculos m ON v.ID_Marca = m.ID_Marca
       ORDER BY v.ID_Vehiculo DESC`
    );
    res.json(resultados);
  } catch (error) {
    console.error("Error al obtener vehículos:", error);
    res.status(500).json({ error: "Error al obtener vehículos" });
  }
};

// 🔹 Registrar un vehículo adicional
exports.registrarVehiculo = async (req, res) => {
  const { placa, color, idUsuario, idMarca } = req.body;

  if (!placa || !color || !idUsuario || !idMarca) {
    return res.status(400).json({ error: "Faltan datos del vehículo" });
  }

  try {
    await db.query(
      `INSERT INTO vehiculos (Placa, Color, ID_Usuario, ID_Marca)
       VALUES (?, ?, ?, ?)`,
      [placa, color, idUsuario, idMarca]
    );

    res.status(201).json({ mensaje: "Vehículo registrado correctamente" });
  } catch (error) {
    console.error("Error al registrar vehículo:", error);
    res.status(500).json({ error: "Error al registrar vehículo" });
  }
};

// 🔹 Buscar vehículo por placa
exports.buscarVehiculoPorPlaca = async (req, res) => {
  const { placa } = req.params;

  try {
    const [resultados] = await db.query(
      `SELECT v.*, u.Nombre, u.Apellidos, m.Marca
       FROM vehiculos v
       JOIN usuarios u ON v.ID_Usuario = u.ID_Usuario
       JOIN marca_vehiculos m ON v.ID_Marca = m.ID_Marca
       WHERE v.Placa = ?`,
      [placa]
    );

    if (resultados.length === 0) {
      return res.status(404).json({ mensaje: "Vehículo no encontrado" });
    }

    res.json(resultados[0]);
  } catch (error) {
    console.error("Error al buscar vehículo:", error);
    res.status(500).json({ error: "Error al buscar vehículo" });
  }
};
