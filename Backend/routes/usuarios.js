const express = require("express");
const router = express.Router();
const usuariosController = require("../controllers/usuariosController");

router.get("/:id", usuariosController.obtenerUsuarioPorId);
// 🔹 GET /usuarios → obtener todos los usuarios
router.get("/", usuariosController.obtenerUsuarios);
// 🔹 POST /usuarios → registrar un nuevo usuario
router.post("/", usuariosController.registrarUsuarioConVehiculo);
// 🔹 GET /usuarios/matricula/:matricula → buscar usuario por matrícula
router.get("/matricula/:matricula", usuariosController.buscarUsuarioPorMatricula);
// 🔹 PUT /usuarios/:id → actualizar un usuario
router.put("/:id", usuariosController.actualizarUsuario);
// 🔹 DELETE /usuarios/:id → eliminar un usuario
router.delete("/:id", usuariosController.eliminarUsuario);
module.exports = router;
