// Backend/routes/usuarios.js
const express = require("express");
const router = express.Router();
const usuariosController = require("../controllers/usuariosController");
const { requireFields, sanitize, validators } = require("../middlewares/validate");

// Rutas específicas primero
router.get("/", usuariosController.obtenerUsuarios);
router.get("/matricula/:matricula", usuariosController.buscarUsuarioPorMatricula);
router.get("/visitantes", usuariosController.listarVisitantes);

// Crear usuario + vehículo (VALIDADO)
router.post("/",
  requireFields(["nombre_completo", "tipoUsuario", "placa"]),
  validators.tipoUsuarioValido(),
  validators.placaFormato(),
  sanitize({
    nombre_completo: (v) => String(v).trim(),
    placa: (v) => String(v).trim().toUpperCase(),
  }),
  usuariosController.registrarUsuarioConVehiculo
);

// Luego las que usan parámetros genéricos
router.get("/:id", usuariosController.obtenerUsuarioPorId);
router.put("/:id", usuariosController.actualizarUsuario);
router.delete("/:id", usuariosController.eliminarUsuario);

module.exports = router;
