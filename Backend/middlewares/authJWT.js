// Backend/middlewares/authJWT.js
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error("JWT_SECRET no está definido en las variables de entorno");
}

function verificarToken(roles = []) {
  return (req, res, next) => {
    try {
      const authHeader = req.headers["authorization"] || "";
      const [scheme, token] = authHeader.split(" ");

      if (!token || scheme !== "Bearer") {
        return res.status(401).json({ mensaje: "Token no proporcionado" });
      }

      const decoded = jwt.verify(token, JWT_SECRET);

      if (Array.isArray(roles) && roles.length > 0 && !roles.includes(decoded.rol)) {
        return res.status(403).json({ mensaje: "Acceso denegado" });
      }

      req.usuario = decoded;
      next();
    } catch (err) {
      console.error("Error verificando token:", err.message);
      return res.status(401).json({ mensaje: "Token inválido o expirado" });
    }
  };
}

module.exports = { verificarToken };
