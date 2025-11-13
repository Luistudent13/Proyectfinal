// Backend/controllers/loginController.js
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { buscarPorUsername } = require("../models/usuarioSistemamodel");

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "8h";

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET no está definido en las variables de entorno");
}

exports.login = async (req, res, next) => {
  try {
    const username = (req.body.usuario || req.body.username || "").trim();
    const password = (req.body.contrasena || req.body.password || "").trim();

    if (!username || !password) {
      return res.status(400).json({ mensaje: "Usuario y contraseña son obligatorios" });
    }

    const user = await buscarPorUsername(username);
    if (!user || !user.activo) {
      return res.status(401).json({ mensaje: "Credenciales inválidas" });
    }

    const ok = await bcrypt.compare(password, user.password_hash);
    if (!ok) {
      return res.status(401).json({ mensaje: "Credenciales inválidas" });
    }

    const payload = {
      id: user.id,
      username: user.username,
      rol: user.rol,
    };

    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

    return res.json({
      mensaje: "Inicio de sesión exitoso",
      usuario: user.username,
      rol: user.rol,
      token,
    });
  } catch (error) {
    next(error);
  }
};
