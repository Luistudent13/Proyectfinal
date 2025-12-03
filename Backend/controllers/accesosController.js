// Backend/controllers/accesosController.js
const db = require("../config/database");

// ===============================
// POST /api/accesos → Registrar entrada
// ===============================
exports.crearAcceso = async (req, res, next) => {
  try {
    const { ID_Usuario, ID_Vehiculo } = req.body;

    if (!ID_Usuario || !ID_Vehiculo) {
      return res.status(400).json({
        message: "Faltan ID_Usuario o ID_Vehiculo",
        mensaje: "Faltan ID_Usuario o ID_Vehiculo",
      });
    }

    // Validar si el vehículo ya tiene acceso sin salida
    const [activos] = await db.query(
      "SELECT ID_Acceso FROM registros_acceso WHERE ID_Vehiculo = ? AND Hora_Salida IS NULL",
      [ID_Vehiculo]
    );

    if (activos.length > 0) {
      return res.status(400).json({
        message: "Este vehículo no ha salido",
        mensaje: "Este vehículo no ha salido",
        code: "VEHICULO_NO_HA_SALIDO",
      });
    }

    // FORMATO DATETIME → YYYY-MM-DD HH:MM:SS
    const ahora = new Date();
    const fecha = ahora.toISOString().slice(0, 10);
    const hora = ahora.toTimeString().slice(0, 8);
    const fechaHora = `${fecha} ${hora}`;

    // Insertar nuevo acceso
    const [result] = await db.query(
      `
      INSERT INTO registros_acceso (ID_Vehiculo, ID_Usuario, Hora_Entrada, Fecha_Acceso)
      VALUES (?, ?, ?, ?)
      `,
      [ID_Vehiculo, ID_Usuario, fechaHora, fecha]
    );

        // Validar límite de cajones normales (46 máximo)
    const [[countNormal]] = await db.query(`
      SELECT COUNT(*) AS ocupados
      FROM cajones_estacionamiento
      WHERE Es_Discapacitado = 0 AND ID_Estado = 2
    `);

    if (countNormal.ocupados >= 46) {
      return res.status(400).json({
        ok: false,
        message: "Ya no hay cajones disponibles para usuarios normales",
        code: "LIMITE_CAJONES_NORMALES"
      });
    }


    //  🔥🔥🔥 BLOQUE QUE FALTABA — OCUPAR AUTOMÁTICAMENTE UN CAJÓN 🔥🔥🔥
    // Buscar un cajón disponible
    const [[cajonLibre]] = await db.query(`
      SELECT ID_Cajon
      FROM cajones_estacionamiento
      WHERE ID_Estado = 1
      ORDER BY Numero_Cajon ASC
      LIMIT 1
    `);

    if (cajonLibre) {
      // Ocupa ese cajón con el vehículo
      await db.query(`
        UPDATE cajones_estacionamiento
        SET ID_Estado = 2,
            ID_Vehiculo_Ocupando = ?
        WHERE ID_Cajon = ?
      `, [ID_Vehiculo, cajonLibre.ID_Cajon]);
    }
    // -----------------------------------------------------------------------


    return res.status(201).json({
      message: "Acceso registrado correctamente",
      mensaje: "Acceso registrado correctamente",
      ID_Acceso: result.insertId,
    });
  } catch (err) {
    next(err);
  }
};




// ===============================
// POST /api/accesos/salida → Registrar salida por placa
// ===============================
exports.registrarSalidaPorPlaca = async (req, res, next) => {
  try {
    const { placa } = req.body;

    if (!placa) {
      return res.status(400).json({
        message: "La placa es obligatoria",
        mensaje: "La placa es obligatoria",
      });
    }

    // 1) Buscar vehículo
    const [vehiculos] = await db.query(
      "SELECT ID_Vehiculo FROM vehiculos WHERE Placa = ?",
      [placa]
    );

    if (vehiculos.length === 0) {
      return res.status(404).json({
        message: "Vehículo no encontrado",
        mensaje: "Vehículo no encontrado",
      });
    }

    const idVehiculo = vehiculos[0].ID_Vehiculo;

    // 2) Buscar el último acceso
    const [ultimos] = await db.query(
      `
      SELECT ID_Acceso, Hora_Salida
      FROM registros_acceso
      WHERE ID_Vehiculo = ?
      ORDER BY ID_Acceso DESC
      LIMIT 1
      `,
      [idVehiculo]
    );

    if (ultimos.length === 0) {
      return res.status(400).json({
        message: "Este vehículo no tiene registros de entrada",
        mensaje: "Este vehículo no tiene registros de entrada",
      });
    }

    const ultimo = ultimos[0];

    // 3) Ya salió antes
    if (ultimo.Hora_Salida) {
      return res.status(400).json({
        message: "Este vehículo ya egresó",
        mensaje: "Este vehículo ya egresó",
        code: "VEHICULO_YA_EGRESO",
      });
    }

    // 4) Registrar la salida correctamente (DATETIME)
    const ahora = new Date();
    const fecha = ahora.toISOString().slice(0, 10);
    const hora = ahora.toTimeString().slice(0, 8);
    const fechaHora = `${fecha} ${hora}`;

    await db.query(
      "UPDATE registros_acceso SET Hora_Salida = ? WHERE ID_Acceso = ?",
      [fechaHora, ultimo.ID_Acceso]
    );

    // 5) Liberar el cajón que tenía este vehículo
    await db.query(`
    UPDATE cajones_estacionamiento
    SET ID_Estado = 1,
    ID_Vehiculo_Ocupando = NULL
    WHERE ID_Vehiculo_Ocupando = ?;
` ,  [idVehiculo]);


    return res.json({
      message: "Salida registrada correctamente",
      mensaje: "Salida registrada correctamente",
    });
  } catch (err) {
    next(err);
  }
};



// ===============================
// GET /api/accesos → Historial completo
// ===============================
exports.listarAccesos = async (req, res, next) => {
  try {
    const [rows] = await db.query(
      `
      SELECT 
        ra.ID_Acceso,
        ra.Fecha_Registro,
        ra.Hora_Entrada,
        ra.Hora_Salida,
        ra.Fecha_Acceso,
        v.Placa,
        u.Nombre_Completo
      FROM registros_acceso ra
      JOIN vehiculos v ON ra.ID_Vehiculo = v.ID_Vehiculo
      JOIN usuarios u ON ra.ID_Usuario = u.ID_Usuario
      ORDER BY ra.ID_Acceso DESC
      `
    );

    res.json(rows);
  } catch (err) {
    next(err);
  }
};