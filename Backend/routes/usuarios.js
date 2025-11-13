// Backend/routes/usuarios.js
const express = require("express");
const router = express.Router();

const usuariosController = require("../controllers/usuariosController");
const { requireFields, sanitize, validators } = require("../middlewares/validate");
const catchAsync = require("../middlewares/catchAsync");
const { verificarToken } = require("../middlewares/authJWT");

// Listar usuarios (ADMIN, GUARDIA)
router.get(
  "/",
  verificarToken(["ADMIN", "GUARDIA"]),
  catchAsync(usuariosController.obtenerUsuarios)
);

router.get(
  "/matricula/:matricula",
  verificarToken(["ADMIN", "GUARDIA"]),
  catchAsync(usuariosController.buscarUsuarioPorMatricula)
);

router.get(
  "/visitantes",
  verificarToken(["ADMIN", "GUARDIA"]),
  catchAsync(usuariosController.listarVisitantes)
);

// Crear usuario + vehículo (solo ADMIN)
router.post(
  "/",
  verificarToken(["ADMIN"]),
  requireFields(["nombre_completo", "tipoUsuario", "placa"]),
  validators.placaFormato(),
  sanitize({
    nombre_completo: (v) => String(v).trim(),
    placa: (v) => String(v).trim().toUpperCase(),
  }),
  catchAsync(usuariosController.registrarUsuarioConVehiculo)
);

// Detalle por ID (ADMIN, GUARDIA)
router.get(
  "/:id",
  verificarToken(["ADMIN", "GUARDIA"]),
  catchAsync(usuariosController.obtenerUsuarioPorId)
);

// Actualizar usuario (solo ADMIN)
router.put(
  "/:id",
  verificarToken(["ADMIN"]),
  catchAsync(usuariosController.actualizarUsuario)
);

// Eliminar usuario (solo ADMIN)
router.delete(
  "/:id",
  verificarToken(["ADMIN"]),
  catchAsync(usuariosController.eliminarUsuario)
);

module.exports = router;
