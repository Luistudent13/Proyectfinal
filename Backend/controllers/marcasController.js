const db = require("../config/database");
const httpError = require("../utils/httpError");

// Obtener todas las marcas
exports.obtenerMarcas = async (req, res) => {
  const [resultados] = await db.query(
    "SELECT * FROM marca_vehiculos ORDER BY Marca ASC"
  );
  res.json(resultados);
};

// Agregar una nueva marca
exports.registrarMarca = async (req, res) => {
  const { nombre } = req.body;
  if (!nombre || String(nombre).trim() === "") {
    throw httpError(400, "El nombre de la marca es obligatorio");
  }
  await db.query("INSERT INTO marca_vehiculos (Marca) VALUES (?)", [nombre]);
  res.status(201).json({ mensaje: "Marca registrada correctamente" });
};
