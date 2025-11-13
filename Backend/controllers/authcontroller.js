const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { buscarPorUsername } = require('../models/usuarioSistemamodel');

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '8h';

if (!JWT_SECRET) {
  throw new Error('JWT_SECRET no está definido en .env');
}

async function login(req, res, next) {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ ok: false, message: 'Usuario y contraseña son obligatorios' });
    }

    const user = await buscarPorUsername(username);
    if (!user || !user.activo) {
      return res.status(401).json({ ok: false, message: 'Credenciales inválidas' });
    }

    const esValido = await bcrypt.compare(password, user.password_hash);
    if (!esValido) {
      return res.status(401).json({ ok: false, message: 'Credenciales inválidas' });
    }

    const payload = {
      id: user.id,
      username: user.username,
      rol: user.rol,
    };

    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

    return res.json({
      ok: true,
      message: 'Login exitoso',
      token,
      rol: user.rol,
      username: user.username,
    });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  login,
};
