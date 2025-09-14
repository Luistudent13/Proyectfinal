// middlewares/errorHandler.js
module.exports = (err, req, res, next) => {
  console.error("❌ Error global:", err);

  // Mapeos útiles (MySQL, validaciones, etc.)
  let status = err.status || 500;
  let mensaje = err.mensaje || err.message || "Error interno del servidor";

  if (err.code === "ER_DUP_ENTRY") {
    status = 409;
    mensaje = "Registro duplicado.";
  }

  res.status(status).json({
    ok: false,
    mensaje,
    ...(process.env.NODE_ENV !== "production" && { stack: err.stack })
  });
};
