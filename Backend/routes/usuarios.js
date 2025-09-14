// Backend/routes/usuarios.js
const express = require("express");
const router = express.Router();

const usuariosController = require("../controllers/usuariosController");
const { requireFields, sanitize, validators } = require("../middlewares/validate");
const catchAsync = require("../middlewares/catchAsync");

// Orden: rutas específicas primero
router.get("/",            catchAsync(usuariosController.obtenerUsuarios));
router.get("/matricula/:matricula", catchAsync(usuariosController.buscarUsuarioPorMatricula));
router.get("/visitantes",  catchAsync(usuariosController.listarVisitantes));

// Crear usuario + vehículo (VALIDADO)
router.post("/",
  requireFields(["nombre_completo", "tipoUsuario", "placa"]),
  validators.tipoUsuarioValido(),
  validators.placaFormato(),
  sanitize({
    nombre_completo: (v) => String(v).trim(),
    placa: (v) => String(v).trim().toUpperCase(),
  }),
  catchAsync(usuariosController.registrarUsuarioConVehiculo)
);

// Genéricas al final
router.get("/:id",   catchAsync(usuariosController.obtenerUsuarioPorId));
router.put("/:id",   catchAsync(usuariosController.actualizarUsuario));
router.delete("/:id",catchAsync(usuariosController.eliminarUsuario));

module.exports = router;
