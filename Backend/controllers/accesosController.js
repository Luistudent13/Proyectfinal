// Backend/controllers/accesosController.js
const db = require("../config/database");

// ===============================
// POST /api/accesos → Registrar entrada con validación de tipo de cajón
// ===============================
exports.crearAcceso = async (req, res, next) => {
  try {
    // 1. Recibir el flag 'es_discapacidad' desde el Body (Android)
    const { ID_Usuario, ID_Vehiculo, es_discapacidad } = req.body;

    // Convertimos a booleano real (por si viene como string "true" o 1)
    const esDiscapacitado = es_discapacidad === true || es_discapacidad === "true" || es_discapacidad === 1;

    if (!ID_Usuario || !ID_Vehiculo) {
      return res.status(400).json({
        message: "Faltan ID_Usuario o ID_Vehiculo",
        mensaje: "Faltan ID_Usuario o ID_Vehiculo",
      });
    }

    // 2. Validar si el vehículo ya tiene acceso sin salida
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

    // =======================================================================
    // 3. VALIDACIÓN DE CUPO Y ASIGNACIÓN DE CAJÓN (Lógica Dinámica)
    // =======================================================================
    
    // Definimos qué tipo de cajón estamos buscando (0 = Normal, 1 = Discapacitado)
    const tipoCajonBuscado = esDiscapacitado ? 1 : 0;
    
    // Definimos el límite según el tipo (4 para azules, 46 para normales)
    const limitePermitido = esDiscapacitado ? 4 : 46;

    // A) Contar cuántos cajones de ESE TIPO están ocupados (Estado 2)
    const [[conteo]] = await db.query(`
      SELECT COUNT(*) AS ocupados
      FROM cajones_estacionamiento
      WHERE Es_Discapacitado = ? AND ID_Estado = 2
    `, [tipoCajonBuscado]);

    // B) Si llegamos al límite, rechazamos la entrada
    if (conteo.ocupados >= limitePermitido) {
      return res.status(400).json({
        ok: false,
        // Mensaje dinámico según el caso
        message: esDiscapacitado 
          ? "No hay cajones de discapacidad disponibles (Límite 4 alcanzado)" 
          : "Ya no hay cajones normales disponibles",
        mensaje: esDiscapacitado 
          ? "Cupo lleno para discapacidad" 
          : "Estacionamiento lleno",
        code: esDiscapacitado ? "LIMITE_DISCAPACITADOS" : "LIMITE_CAJONES_NORMALES"
      });
    }

    // C) Buscar un cajón LIBRE (Estado 1) del tipo solicitado
    const [[cajonLibre]] = await db.query(`
      SELECT ID_Cajon, Numero_Cajon
      FROM cajones_estacionamiento
      WHERE ID_Estado = 1 AND Es_Discapacitado = ?
      ORDER BY Numero_Cajon ASC
      LIMIT 1
    `, [tipoCajonBuscado]);

    // Si por alguna inconsistencia de la BD no hay cajón aunque el count diga que sí:
    if (!cajonLibre) {
       return res.status(400).json({
         message: "Error interno: No se encuentra un cajón físico disponible.",
         mensaje: "No se encontró cajón físico disponible."
       });
    }

    // =======================================================================
    // 4. REGISTRAR LA ENTRADA Y OCUPAR EL CAJÓN
    // =======================================================================

    const ahora = new Date();
    const fecha = ahora.toISOString().slice(0, 10);
    const hora = ahora.toTimeString().slice(0, 8);
    const fechaHora = `${fecha} ${hora}`;

    // Insertar nuevo acceso
    // NOTA: Si decides agregar la columna 'Es_Discapacidad' a 'registros_acceso' en el futuro, agrégala aquí.
    const [result] = await db.query(
      `
      INSERT INTO registros_acceso (ID_Vehiculo, ID_Usuario, Hora_Entrada, Fecha_Acceso)
      VALUES (?, ?, ?, ?)
      `,
      [ID_Vehiculo, ID_Usuario, fechaHora, fecha]
    );

    // Ocupar el cajón encontrado
    await db.query(`
      UPDATE cajones_estacionamiento
      SET ID_Estado = 2,
          ID_Vehiculo_Ocupando = ?
      WHERE ID_Cajon = ?
    `, [ID_Vehiculo, cajonLibre.ID_Cajon]);

    return res.status(201).json({
      message: "Acceso registrado correctamente",
      mensaje: "Acceso registrado correctamente",
      ID_Acceso: result.insertId,
      Cajon_Asignado: cajonLibre.Numero_Cajon,
      Tipo_Cajon: esDiscapacitado ? "Discapacitado" : "Normal"
    });

  } catch (err) {
    next(err);
  }
};