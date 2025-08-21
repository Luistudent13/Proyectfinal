const db = require("../config/database");

// 🔹 Obtener todas las marcas
exports.obtenerMarcas = async (req, res) => {
  try {
    const [resultados] = await db.query("SELECT * FROM marca_vehiculos ORDER BY Marca ASC");
    res.json(resultados);
  } catch (error) {
    console.error("Error al obtener marcas:", error);
    res.status(500).json({ error: "Error al obtener marcas" });
  }
};

// 🔹 Agregar una nueva marca
exports.registrarMarca = async (req, res) => {
  const { nombre } = req.body;

  if (!nombre) {
    return res.status(400).json({ error: "El nombre de la marca es obligatorio" });
  }

  try {
    await db.query("INSERT INTO marca_vehiculos (Marca) VALUES (?)", [nombre]);
    res.status(201).json({ mensaje: "Marca registrada correctamente" });
  } catch (error) {
    console.error("Error al registrar marca:", error);
    res.status(500).json({ error: "Error al registrar marca" });
  }
};
