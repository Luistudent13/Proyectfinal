console.log("🔥 EL SERVIDOR QUE ESTÁ CORRIENDO ES ESTE:", __filename);
// Backend/server.js
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares base
app.use(cors());
app.use(express.json());

console.log("Frontend REAL:", path.join(__dirname, "../Frontend"));
// Frontend estático
app.use(express.static(path.join(__dirname, "../Frontend")));

// Rutas API
const authRoutes = require("./routes/auth");
const usuariosRoutes = require("./routes/usuarios");
const vehiculosRoutes = require("./routes/vehiculos");
const accesosRoutes = require("./routes/accesos");
const marcasRoutes = require("./routes/marcas");
const reportesRoutes = require("./routes/reportes");
const dashboardRoutes = require("./routes/dashboard");
const cajonesRoutes = require("./routes/cajones");



app.use("/api/auth", authRoutes);
app.use("/api/usuarios", usuariosRoutes);
app.use("/api/vehiculos", vehiculosRoutes);
app.use("/api/accesos", accesosRoutes);
app.use("/api/marcas", marcasRoutes);
app.use("/api/reportes", reportesRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/cajones", cajonesRoutes);


// Ruta raíz → pantalla principal
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../Frontend/screens/index.html"));
});

// Manejo global de errores
const errorHandler = require("./middlewares/errorHandler");
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
