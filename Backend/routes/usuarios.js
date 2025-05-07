const express = require("express");
const router = express.Router();
const usuariosController = require("../controllers/usuariosController");

// 🔹 GET /usuarios → obtener todos los usuarios
router.get("/", usuariosController.obtenerUsuarios);

// 🔹 POST /usuarios → registrar un nuevo usuario
router.post("/", usuariosController.registrarUsuario);

// 🔹 GET /usuarios/matricula/:matricula → buscar usuario por matrícula
router.get("/matricula/:matricula", usuariosController.buscarUsuarioPorMatricula);

// 🔹 PUT /usuarios/:id → actualizar un usuario
router.put("/:id", usuariosController.actualizarUsuario);

module.exports = router;
