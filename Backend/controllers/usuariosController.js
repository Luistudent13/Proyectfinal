const db = require("../config/database");

// 🔹 Obtener todos los usuarios
exports.obtenerUsuarios = async (req, res) => {
  try {
    const [resultados] = await db.query(`
      SELECT 
        u.ID_Usuario,
        u.Nombre_Completo,
        u.Matricula,
        u.ID_Tipo_Usuario,
        u.Licenciatura,
        u.Area_Empleado,
        v.Placa,
        v.Color,
        m.Marca
      FROM usuarios u
      LEFT JOIN vehiculos v ON u.ID_Usuario = v.ID_Usuario
      LEFT JOIN marca_vehiculos m ON v.ID_Marca = m.ID_Marca
      ORDER BY u.ID_Usuario ASC
    `);

    res.json(resultados);
  } catch (error) {
    console.error("Error al obtener usuarios:", error);
    res.status(500).json({ error: "Error al obtener usuarios" });
  }
};


// controllers/usuariosController.js
exports.registrarUsuarioConVehiculo = async (req, res) => {
  const {
    nombre_completo, matricula, tipoUsuario, licenciatura, area_empleado,
    evento_asiste, hora_ingreso, hora_salida, persona_recoge, relacion_estudiante,
    placa, color, idMarca
  } = req.body;

  try {
    const [rU] = await db.query(
      `INSERT INTO usuarios
       (Nombre_Completo, Matricula, ID_Tipo_Usuario, Licenciatura, Area_Empleado,
        Evento_Asiste, Horario, Hora_Salida, Persona_Recoge, Relacion_Estudiante)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        nombre_completo || null, matricula || null, tipoUsuario,
        licenciatura || null, area_empleado || null,
        evento_asiste || null, hora_ingreso || null, hora_salida || null,
        persona_recoge || null, relacion_estudiante || null
      ]
    );

    const idUsuario = rU.insertId;
    await db.query(
      `INSERT INTO vehiculos (Placa, Color, ID_Marca, ID_Usuario)
       VALUES (?, ?, ?, ?)`,
      [placa, color || null, idMarca, idUsuario]
    );

    res.json({ ok: true, ID_Usuario: idUsuario });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Error al registrar usuario' });
  }
};

//modificado

// Listar visitantes (nuevo y temporal)
exports.listarVisitantes = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        u.ID_Usuario,
        u.Nombre_Completo,
        u.ID_Tipo_Usuario,
        u.Matricula,
        u.Licenciatura,
        u.Area_Empleado,
        u.Evento_Asiste,
        u.Horario,
        u.Hora_Salida, 
        u.Persona_Recoge,
        u.Relacion_Estudiante,
        u.Fecha_Registro,
        v.Placa,
        v.Color,
        m.Marca
      FROM usuarios u
      LEFT JOIN vehiculos v ON v.ID_Usuario = u.ID_Usuario
      LEFT JOIN marca_vehiculos m ON m.ID_Marca = v.ID_Marca
      WHERE u.ID_Tipo_Usuario IN (4, 5)
      ORDER BY u.Fecha_Registro DESC, u.ID_Usuario DESC
    `);
    res.json(rows);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Error al listar visitantes' });
  }
};


// 🔹 Buscar usuario por ID
exports.obtenerUsuarioPorId = async (req, res) => {
  const { id } = req.params;

  try {
    const [resultados] = await db.query(`
      SELECT 
        u.ID_Usuario,
        u.Nombre_Completo,
        u.Matricula,
        u.ID_Tipo_Usuario,
        u.Licenciatura,
        u.Area_Empleado,
        v.Placa,
        v.Color,
        m.Marca
      FROM usuarios u
      LEFT JOIN vehiculos v ON u.ID_Usuario = v.ID_Usuario
      LEFT JOIN marca_vehiculos m ON v.ID_Marca = m.ID_Marca
      WHERE u.ID_Usuario = ?
    `, [id]);

    if (resultados.length === 0) {
      return res.status(404).json({ mensaje: "Usuario no encontrado" });
    }

    res.json(resultados[0]);
  } catch (error) {
    console.error("Error al obtener usuario:", error);
    res.status(500).json({ error: "Error al obtener usuario" });
  }
};




// 🔹 Buscar usuario por matrícula
exports.buscarUsuarioPorMatricula = async (req, res) => {
  const { matricula } = req.params;

  try {
    const [resultados] = await db.query(
      `SELECT u.*, v.Placa, v.Color, v.ID_Marca
       FROM usuarios u
       LEFT JOIN vehiculos v ON u.ID_Usuario = v.ID_Usuario
       WHERE u.Matricula = ?`,
      [matricula]
    );

    if (resultados.length === 0) {
      return res.status(404).json({ mensaje: "Usuario no encontrado" });
    }

    res.json(resultados[0]);
  } catch (error) {
    console.error("Error al buscar usuario:", error);
    res.status(500).json({ error: "Error al buscar usuario" });
  }
};

// 🔹 Actualizar usuario existente
exports.actualizarUsuario = async (req, res) => {
  const { id } = req.params;
  const {
    nombre_completo,
    matricula,
    licenciatura,
    area_empleado,
    placa,
    color,
    marca,  
    nuevaMarcaTexto // ← TE FALTA ESTO// ← esta es la marca que llega como texto desde el frontend
  } = req.body;

  try {
    // 1️⃣ Validar o insertar la marca
    let idMarcaFinal;

if (nuevaMarcaTexto) {
  // Insertar nueva marca si se proporcionó
  const [insertResult] = await db.query(
    "INSERT INTO marca_vehiculos (Marca) VALUES (?)",
    [nuevaMarcaTexto]
  );
  idMarcaFinal = insertResult.insertId;
} else if (marca) {
  // Buscar ID de la marca existente
  const [marcaRows] = await db.query(
    "SELECT ID_Marca FROM marca_vehiculos WHERE Marca = ?",
    [marca]
  );
  if (marcaRows.length > 0) {
    idMarcaFinal = marcaRows[0].ID_Marca;
  } else {
    return res.status(400).json({ mensaje: "La marca especificada no existe" });
  }
} else {
  return res.status(400).json({ mensaje: "No se proporcionó marca válida" });
}


    // 2️⃣ Actualizar tabla usuarios
    await db.query(
      `UPDATE usuarios SET 
        Nombre_Completo = ?, 
        Matricula = ?, 
        Licenciatura = ?, 
        Area_Empleado = ?
      WHERE ID_Usuario = ?`,
      [nombre_completo, matricula, licenciatura, area_empleado, id]
    );

    // 3️⃣ Actualizar tabla vehículos
    await db.query(
      `UPDATE vehiculos SET 
        Placa = ?, 
        Color = ?, 
        ID_Marca = ?
      WHERE ID_Usuario = ?`,
      [placa, color, idMarcaFinal, id]
    );

    res.status(200).json({ mensaje: "Usuario actualizado correctamente" });

  } catch (error) {
    console.error("Error al actualizar usuario:", error);
    res.status(500).json({ mensaje: "Error al actualizar usuario" });
  }
};


// 🔹 Eliminar un usuario
exports.eliminarUsuario = async (req, res) => {
  const { id } = req.params;

  try {
    // Eliminar de vehiculos primero por FK
    await db.query('DELETE FROM vehiculos WHERE ID_Usuario = ?', [id]);

    // Luego eliminar de usuarios
    await db.query('DELETE FROM usuarios WHERE ID_Usuario = ?', [id]);

    res.status(200).json({ mensaje: "Usuario eliminado correctamente" });
  } catch (error) {
    console.error("Error al eliminar usuario:", error);
    res.status(500).json({ error: "Error al eliminar usuario" });
  }
};
