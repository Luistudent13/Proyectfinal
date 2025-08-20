// server.js
require('dotenv').config({ path: '/home/ricardo/sites/estacionamiento/node/.env' });

const express = require('express');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// --- FRONTEND ABSOLUTO (respeta minúsculas) ---
const FRONTEND_ROOT = '/home/ricardo/sites/estacionamiento/frontend/Frontend';
console.log('FRONTEND_ROOT =', FRONTEND_ROOT);

// Sirve /styles.css, /js/*, /assets/*, etc.
app.use(express.static(FRONTEND_ROOT));

// Home -> tu index real está en Frontend/screens/index.html
app.get('/', (_req, res) => {
  res.sendFile(path.join(FRONTEND_ROOT, 'screens', 'index.html'));
});

// (Opcional) health simple para verificar que este archivo sí es el que corre
app.get('/healthz', (_req, res) => res.json({ ok: true, root: FRONTEND_ROOT }));

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
