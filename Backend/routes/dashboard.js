// Importa el framework Express para crear rutas y manejar peticiones HTTP
const express = require("express");

// Crea un router modular (agrupa rutas relacionadas en un solo archivo)
const router = express.Router();

// Importa la conexión a la base de datos MySQL desde la carpeta config
const db = require("../config/database");

// Importa un middleware que encapsula funciones async para manejar errores automáticamente
const catchAsync = require("../middlewares/catchAsync");

// =====================================================================
//  ENDPOINT: /disponibles
//  Obtiene la cantidad de cajones libres (ID_Estado = 1)
// =====================================================================
router.get("/disponibles", catchAsync(async (req, res) => {
  // Ejecuta consulta SQL para contar cuántos cajones están disponibles
  const [rows] = await db.query(`
    SELECT COUNT(*) AS disponibles
    FROM cajones_estacionamiento
    WHERE ID_Estado = 1
  `);
  // Envía la respuesta en formato JSON con el resultado
  res.json(rows[0]); // rows[0] contiene { disponibles: X }
}));

// ==============================
//  OCUPADOS
// ==============================
router.get("/ocupados", catchAsync(async (req, res) => {
  const [rows] = await db.query(`
    SELECT COUNT(*) AS ocupados
    FROM cajones_estacionamiento
    WHERE ID_Estado = 2
  `);
  res.json(rows[0]);
}));

// ==============================
//  TOTAL DE ESPACIOS
// ==============================
router.get("/total", catchAsync(async (req, res) => {
  const [rows] = await db.query(`
    SELECT COUNT(*) AS total
    FROM cajones_estacionamiento
  `);
  res.json(rows[0]);
}));

// ==============================
//  TEMPORALES ACTIVOS HOY
// ==============================
router.get("/temporales", catchAsync(async (req, res) => {
  const [rows] = await db.query(`
    SELECT COUNT(*) AS temporales
    FROM registros_acceso ra
    INNER JOIN usuarios u ON u.ID_Usuario = ra.ID_Usuario
    WHERE u.ID_Tipo_Usuario = 5
      AND ra.Fecha_Acceso = CURDATE()
  `);
  res.json(rows[0]);
}));

// ==============================
//  GENERAL (Resumen completo)
// ==============================
router.get("/general", catchAsync(async (req, res) => {
  const [[disponibles]] = await db.query(`
    SELECT COUNT(*) AS disponibles
    FROM cajones_estacionamiento
    WHERE ID_Estado = 1
  `);

  const [[ocupados]] = await db.query(`
    SELECT COUNT(*) AS ocupados
    FROM cajones_estacionamiento
    WHERE ID_Estado = 2
  `);

  const [[total]] = await db.query(`
    SELECT COUNT(*) AS total
    FROM cajones_estacionamiento
  `);

  const [[temporales]] = await db.query(`
    SELECT COUNT(*) AS temporales
    FROM registros_acceso ra
    INNER JOIN usuarios u ON u.ID_Usuario = ra.ID_Usuario
    WHERE u.ID_Tipo_Usuario = 5
      AND ra.Fecha_Acceso = CURDATE()
  `);

  res.json({
    disponibles: disponibles.disponibles,
    ocupados: ocupados.ocupados,
    total: total.total,
    temporales: temporales.temporales
  });
}));

// =============================================================
//  ANDROID: BUSCAR POR MATRICULA (Tu código existente)
// =============================================================
router.get('/android/buscar/:matricula', async (req, res) => {
    const { matricula } = req.params;

    try {
        const [rows] = await db.execute(`
            SELECT 
                u.ID_Usuario,
                u.Nombre_Completo,
                u.Matricula,
                v.ID_Vehiculo,
                v.Placa,
                v.Color,
                m.Marca,
                c.ID_Cajon,
                c.Numero_Cajon,
                c.ID_Estado
            FROM usuarios u
            LEFT JOIN vehiculos v ON v.ID_Usuario = u.ID_Usuario
            LEFT JOIN marca_vehiculos m ON m.ID_Marca = v.ID_Marca
            LEFT JOIN cajones_estacionamiento c ON c.ID_Vehiculo_Ocupando = v.ID_Vehiculo
            WHERE u.Matricula = ?
        `, [matricula]);

        if (rows.length === 0) {
            return res.status(404).json({ ok: false, message: "No encontrado" });
        }

        res.json({ ok: true, data: rows });

    } catch (error) {
        res.status(500).json({ ok: false, error: error.message });
    }
});

// =============================================================
//  ANDROID: BUSCAR POR PLACA (¡NUEVO! PARA LLENAR DATOS)
//  Este devuelve el JSON exacto que me pediste.
// =============================================================
router.get('/android/buscar-placa/:placa', async (req, res) => {
    const { placa } = req.params;

    try {
        const [rows] = await db.query(`
            SELECT 
                u.ID_Usuario,
                u.Nombre_Completo,
                u.Matricula,
                u.ID_Tipo_Usuario,
                u.Licenciatura,
                u.Area_Empleado,
                u.Evento_Asiste,
                u.Horario,
                u.Persona_Recoge,
                u.Relacion_Estudiante,
                u.Fecha_Registro,
                v.ID_Vehiculo,   
                v.Placa,
                v.Color,
                m.Marca
            FROM usuarios u
            JOIN vehiculos v ON u.ID_Usuario = v.ID_Usuario
            LEFT JOIN marca_vehiculos m ON v.ID_Marca = m.ID_Marca
            WHERE v.Placa = ?
        `, [placa]);

        if (rows.length === 0) {
            // Android espera un 404 si no existe para saber que debe registrarlo
            return res.status(404).json({ message: "No se encontró usuario con esa placa" });
        }

        // Devolvemos el objeto directo (sin {data: ...}) para que coincida con tu petición
        res.json(rows[0]);

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error en el servidor al buscar placa" });
    }
});

// ¡IMPORTANTE! Esto debe ir SIEMPRE al final de todo
module.exports = router;