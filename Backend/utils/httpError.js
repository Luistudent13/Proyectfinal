// utils/httpError.js
module.exports = function httpError(status, mensaje) {
  const e = new Error(mensaje);
  e.status = status;
  e.mensaje = mensaje;
  return e;
};
