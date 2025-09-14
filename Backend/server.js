require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = 3000;

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../Frontend')));

// Rutas
const usuariosRoutes = require('./routes/usuarios');
const vehiculosRoutes = require('./routes/vehiculos');
const accesosRoutes = require('./routes/accesos');
const marcasRoutes = require('./routes/marcas');
const reportesRoutes = require('./routes/reportes');

app.use('/reportes', reportesRoutes);
app.use('/usuarios', usuariosRoutes);
app.use('/vehiculos', vehiculosRoutes);
app.use('/accesos', accesosRoutes);
app.use('/marcas', marcasRoutes);

// Ruta raíz
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../Frontend/screens/index.html'));
});

// ⛑️ Middleware global de errores SIEMPRE al final
const errorHandler = require('./middlewares/errorHandler');
app.use(errorHandler);

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
