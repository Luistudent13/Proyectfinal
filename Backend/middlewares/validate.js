// middlewares/validate.js
module.exports.requireFields = (fields) => (req, res, next) => {
  const missing = [];
  for (const f of fields) {
    const v = req.body?.[f];
    if (v === undefined || v === null || (typeof v === 'string' && v.trim() === '')) {
      missing.push(f);
    }
  }
  if (missing.length) {
    return res.status(400).json({ mensaje: `Faltan campos: ${missing.join(', ')}` });
  }
  next();
};

module.exports.sanitize = (map) => (req, res, next) => {
  for (const [field, fn] of Object.entries(map)) {
    if (req.body[field] !== undefined && req.body[field] !== null) {
      req.body[field] = fn(req.body[field]);
    }
  }
  next();
};

// Validaciones puntuales sencillas
module.exports.validators = {
  placaFormato: () => (req, res, next) => {
    const placa = req.body.placa;
    // Acepta letras/números/guiones y 5-10 chars (ajústalo a tu realidad)
    const ok = /^[A-Z0-9-]{5,10}$/i.test(String(placa || ''));
    if (!ok) return res.status(400).json({ mensaje: "Formato de placa inválido" });
    next();
  },
  tipoUsuarioValido: () => (req, res, next) => {
    const t = Number(req.body.tipoUsuario);
    const permitidos = new Set([1,2,3,4,5]); // alumno, empleado, catedrático, visitante, temporal (ajústalo)
    if (!permitidos.has(t)) {
      return res.status(400).json({ mensaje: "tipoUsuario inválido" });
    }
    next();
  }
};
