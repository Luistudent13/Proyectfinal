// Backend/controllers/accesosController.js
const db = require("../config/database");

// ======================================================================
// 1. ENTRADA + ASIGNACIÓN DE CAJÓN
// ======================================================================
exports.crearAcceso = async (req, res, next) => {
  try {
    const { ID_Usuario, ID_Vehiculo, esDiscapacitado } = req.body;

    if (!ID_Usuario || !ID_Vehiculo) {
      return res.status(400).json({
        message: "Faltan ID_Usuario o ID_Vehiculo",
        mensaje: "Faltan ID_Usuario o ID_Vehiculo",
      });
    }

    // ¿ya existe acceso ABIERTO para ese vehículo?
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

    // ---------------------------------------------------------------
    // A) Buscar cajón disponible (NORMAL o DISCAPACITADO)
    // ---------------------------------------------------------------
    const queryCajon = esDiscapacitado
      ? "SELECT ID_Cajon FROM cajones_estacionamiento WHERE ID_Estado = 1 AND Es_Discapacitado = 1 LIMIT 1"
      : "SELECT ID_Cajon FROM cajones_estacionamiento WHERE ID_Estado = 1 AND Es_Discapacitado = 0 LIMIT 1";

    const [cajonDisponible] = await db.query(queryCajon);

    if (cajonDisponible.length === 0) {
      return res.status(400).json({
        message: "No hay cajones disponibles",
        mensaje: "No hay cajones disponibles",
      });
    }

    const idCajon = cajonDisponible[0].ID_Cajon;

    // ---------------------------------------------------------------
    // B) Registrar ENTRADA (tu lógica original)
    // ---------------------------------------------------------------
    const ahora = new Date();
    const fecha = ahora.toISOString().slice(0, 10);
    const hora = ahora.toTimeString().slice(0, 8);

    const [result] = await db.query(
      `INSERT INTO registros_acceso (ID_Vehiculo, ID_Usuario, Hora_Entrada, Fecha_Acceso)
       VALUES (?, ?, ?, ?)`,
      [ID_Vehiculo, ID_Usuario, hora, fecha]
    );

    // ---------------------------------------------------------------
    // C) Asignar cajón (nuevo)
    // ---------------------------------------------------------------
    await db.query(
      `UPDATE cajones_estacionamiento
       SET ID_Estado = 2, ID_Vehiculo_Ocupando = ?
       WHERE ID_Cajon = ?`,
      [ID_Vehiculo, idCajon]
    );

    // ---------------------------------------------------------------
    // D) Respuesta final
    // ---------------------------------------------------------------
    return res.status(201).json({
      message: "Acceso registrado y cajón asignado",
      mensaje: "Acceso registrado y cajón asignado",
      ID_Acceso: result.insertId,
      ID_Cajon_Asignado: idCajon,
    });

  } catch (err) {
    next(err);
  }
};

// ======================================================================
// 2. SALIDA + LIBERAR CAJÓN
// ======================================================================
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

    // 2) Buscar el último registro de acceso
    const [ultimos] = await db.query(
      `SELECT ID_Acceso, Hora_Salida
       FROM registros_acceso
       WHERE ID_Vehiculo = ?
       ORDER BY ID_Acceso DESC
       LIMIT 1`,
      [idVehiculo]
    );

    if (ultimos.length === 0) {
      return res.status(400).json({
        message: "Este vehículo no tiene registros de entrada",
        mensaje: "Este vehículo no tiene registros de entrada",
      });
    }

    const ultimo = ultimos[0];

    if (ultimo.Hora_Salida) {
      return res.status(400).json({
        message: "Este vehículo ya egresó",
        mensaje: "Este vehículo ya egresó",
        code: "VEHICULO_YA_EGRESO",
      });
    }

    // 3) Registrar hora de salida
    const ahora = new Date();
    const horaSalida = ahora.toTimeString().slice(0, 8);

    await db.query(
      "UPDATE registros_acceso SET Hora_Salida = ? WHERE ID_Acceso = ?",
      [horaSalida, ultimo.ID_Acceso]
    );

    // ---------------------------------------------------------------
    // 4) LIBERAR el cajón automáticamente (nuevo)
    // ---------------------------------------------------------------
    await db.query(
      `UPDATE cajones_estacionamiento
       SET ID_Estado = 1,
           ID_Vehiculo_Ocupando = NULL
       WHERE ID_Vehiculo_Ocupando = ?`,
      [idVehiculo]
    );

    return res.json({
      message: "Salida registrada y cajón liberado",
      mensaje: "Salida registrada y cajón liberado",
    });

  } catch (err) {
    next(err);
  }
};

// ======================================================================
// 3. HISTORIAL COMPLETO (NO SE TOCA)
// ======================================================================
exports.listarAccesos = async (req, res, next) => {
  try {
    const [rows] = await db.query(
      `SELECT ra.ID_Acceso,
              ra.Fecha_Registro,
              ra.Hora_Entrada,
              ra.Hora_Salida,
              ra.Fecha_Acceso,
              v.Placa,
              u.Nombre_Completo
       FROM registros_acceso ra
       JOIN vehiculos v ON ra.ID_Vehiculo = v.ID_Vehiculo
       JOIN usuarios u ON ra.ID_Usuario = u.ID_Usuario
       ORDER BY ra.ID_Acceso DESC`
    );
    res.json(rows);
  } catch (err) {
    next(err);
  }
};