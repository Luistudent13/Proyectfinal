const express = require("express");
const router = express.Router();
const usuariosController = require("../controllers/usuariosController");

// Rutas específicas primero
router.get("/", usuariosController.obtenerUsuarios);
router.get("/matricula/:matricula", usuariosController.buscarUsuarioPorMatricula);
router.get("/visitantes", usuariosController.listarVisitantes);

// Luego las que usan parámetros genéricos
router.get("/:id", usuariosController.obtenerUsuarioPorId);
router.post("/", usuariosController.registrarUsuarioConVehiculo);
router.put("/:id", usuariosController.actualizarUsuario);
router.delete("/:id", usuariosController.eliminarUsuario);

module.exports = router;
// routes/usuarios.js
router.get('/visitantes', usuariosController.listarVisitantes);

// controllers/usuariosController.js
exports.listarVisitantes = async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT u.*, v.Placa, v.Modelo, v.Color, m.Marca
      FROM usuarios u
      LEFT JOIN vehiculos v ON v.ID_Usuario = u.ID_Usuario
      LEFT JOIN marca_vehiculos m ON m.ID_Marca = v.ID_Marca
      WHERE u.ID_Tipo_Usuario IN (4,5)
      ORDER BY u.Fecha_Registro DESC, u.ID_Usuario DESC
    `);
    res.json(rows);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Error al listar visitantes' });
  }
};

