// server.js
require('dotenv').config({ path: '/home/ricardo/sites/estacionamiento/node/.env' });

const express = require('express');
const cors = require('cors');
const path = require('path');

// --- App ---
const app = express();
const PORT = process.env.PORT || 3001;

// --- Middlewares ---
app.use(cors());
app.use(express.json());

// --- Frontend (estático) ---
// Estructura real: /home/ricardo/sites/estacionamiento/frontend/Frontend
const FRONTEND_ROOT = path.join(__dirname, '..', 'frontend', 'Frontend');
app.use(express.static(FRONTEND_ROOT));

// Home -> tu index está en Frontend/screens/index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(FRONTEND_ROOT, 'screens', 'index.html'));
});

// (Opcional) atajos a otras pantallas HTML dentro de /screens
// app.get('/menu', (req, res) => res.sendFile(path.join(FRONTEND_ROOT, 'screens', 'menu.html')));

// --- Rutas API ---
const usuariosRoutes  = require('./routes/usuarios');
const vehiculosRoutes = require('./routes/vehiculos');
const accesosRoutes   = require('./routes/accesos');
const marcasRoutes    = require('./routes/marcas');
const reportesRoutes  = require('./routes/reportes');

app.use('/usuarios', usuariosRoutes);
app.use('/vehiculos', vehiculosRoutes);
app.use('/accesos',  accesosRoutes);
app.use('/marcas',   marcasRoutes);
app.use('/reportes', reportesRoutes);

// --- Healthchecks ---
const db = require('./config/database');
app.get('/health',  (req, res) => res.json({ ok: true, uptime: process.uptime() }));
app.get('/healthz', async (req, res) => {
  try {
    await db.query('SELECT 1');
    res.json({ db: 'ok' });
  } catch (e) {
    res.status(500).json({ db: 'fail', error: e.code || String(e) });
  }
});

// --- 404 para APIs (deja que los assets estáticos los maneje express.static) ---
app.use((req, res, next) => {
  if (req.path.startsWith('/usuarios') || req.path.startsWith('/vehiculos') ||
      req.path.startsWith('/accesos')  || req.path.startsWith('/marcas')   ||
      req.path.startsWith('/reportes')) {
    return res.status(404).json({ error: 'Not Found' });
  }
  return next();
});

// --- Start ---
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
