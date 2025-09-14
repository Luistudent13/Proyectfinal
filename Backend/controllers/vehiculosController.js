const db = require("../config/database");
const httpError = require("../utils/httpError");

// Obtener todos los vehículos
exports.obtenerVehiculos = async (req, res) => {
  const [resultados] = await db.query(`
    SELECT v.*, u.Nombre_Completo, m.Marca
    FROM vehiculos v
    JOIN usuarios u ON v.ID_Usuario = u.ID_Usuario
    JOIN marca_vehiculos m ON v.ID_Marca = m.ID_Marca
    ORDER BY v.ID_Vehiculo DESC
  `);
  res.json(resultados);
};

// Registrar un vehículo adicional
exports.registrarVehiculo = async (req, res) => {
  const { placa, color, idUsuario, idMarca } = req.body;
  if (!placa || !color || !idUsuario || !idMarca) {
    throw httpError(400, "Faltan datos del vehículo");
  }
  await db.query(
    `INSERT INTO vehiculos (Placa, Color, ID_Usuario, ID_Marca)
     VALUES (?, ?, ?, ?)`,
    [placa, color, idUsuario, idMarca]
  );
  res.status(201).json({ mensaje: "Vehículo registrado correctamente" });
};

// Buscar vehículo por placa
exports.buscarVehiculoPorPlaca = async (req, res) => {
  const { placa } = req.params;
  const [resultados] = await db.query(`
    SELECT v.*, u.Nombre_Completo, m.Marca
    FROM vehiculos v
    JOIN usuarios u ON v.ID_Usuario = u.ID_Usuario
    JOIN marca_vehiculos m ON v.ID_Marca = m.ID_Marca
    WHERE v.Placa = ?
  `, [placa]);

  if (resultados.length === 0) {
    throw httpError(404, "Vehículo no encontrado");
  }
  res.json(resultados[0]);
};
