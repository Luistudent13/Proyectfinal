require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();

// Usa el puerto del .env (fallback 3001)
const PORT = process.env.PORT || 3001;

// Rutas absolutas seguras
const FRONTEND_DIR = path.join(__dirname, '..', 'Frontend');
const INDEX_HTML = path.join(FRONTEND_DIR, 'screens', 'index.html'); // ajusta 'screens' si tu estructura es otra

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.static(FRONTEND_DIR));

// Rutas API
app.use('/reportes', require('./routes/reportes'));
app.use('/usuarios', require('./routes/usuarios'));
app.use('/vehiculos', require('./routes/vehiculos'));
app.use('/accesos', require('./routes/accesos'));
app.use('/marcas', require('./routes/marcas'));

// Ruta raíz
app.get('/', (_req, res) => res.sendFile(INDEX_HTML));

// (Opcional) Catch-all para SPA: sirve index.html en rutas no-API
app.get(/^(?!\/(usuarios|vehiculos|accesos|marcas|reportes)).*$/, (_req, res) => {
  res.sendFile(INDEX_HTML);
});

// Manejo de errores
app.use(require('./middlewares/errorHandler'));

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
