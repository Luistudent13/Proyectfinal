require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;               // usa 3001 para coincidir con lo que probaste

app.use(cors());
app.use(express.json());

// 👉 Ruta ABSOLUTA correcta al frontend (respeta minúsculas)
// /home/ricardo/sites/estacionamiento/node  ->  ../frontend/Frontend
const FRONTEND_ROOT = path.join(__dirname, '..', 'frontend', 'Frontend');

// Sirve estáticos (CSS/JS/imagenes)
app.use(express.static(FRONTEND_ROOT));

// Home: tu index real está en screens/index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(FRONTEND_ROOT, 'screens', 'index.html'));
});

// Iniciar servidor aceptando conexiones externas
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
