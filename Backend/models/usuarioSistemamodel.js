// Backend/models/usuarioSistemamodel.js
const db = require("../config/database");

async function buscarPorUsername(username) {
  const [rows] = await db.query(
    "SELECT id, username, password_hash, rol, activo FROM usuarios_sistema WHERE username = ?",
    [username]
  );
  return rows[0] || null;
}

module.exports = { buscarPorUsername };
