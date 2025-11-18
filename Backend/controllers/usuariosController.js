const db = require("../config/database");
const httpError = require("../utils/httpError");

// Obtener todos los usuarios
// Obtener todos los usuarios (alumnos, empleados, visitantes y temporales)
// Obtener todos los usuarios (alumnos, empleados, visitantes y temporales)
exports.obtenerUsuarios = async (req, res) => {
  const [resultados] = await db.query(`
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
      v.Placa,
      v.Color,
      m.Marca
    FROM usuarios u
    LEFT JOIN vehiculos v ON u.ID_Usuario = v.ID_Usuario
    LEFT JOIN marca_vehiculos m ON v.ID_Marca = m.ID_Marca
    ORDER BY u.ID_Usuario ASC
  `);

  res.json(resultados);
};




// Crear usuario + vehículo
exports.registrarUsuarioConVehiculo = async (req, res) => {
  let {
    nombre_completo, matricula, tipoUsuario, licenciatura, area_empleado,
    evento_asiste, hora_ingreso, hora_salida, persona_recoge, relacion_estudiante,
    placa, color, idMarca
  } = req.body;

  const faltan = [];
  if (!nombre_completo || String(nombre_completo).trim() === '') faltan.push('nombre_completo');
  if (tipoUsuario === undefined || tipoUsuario === null || String(tipoUsuario).trim() === '') faltan.push('tipoUsuario');
  if (!placa || String(placa).trim() === '') faltan.push('placa');
  if (faltan.length) throw httpError(400, `Faltan campos: ${faltan.join(', ')}`);

  const placaFinal = String(placa).trim().toUpperCase();
  // Verificar si la placa ya existe ANTES de crear usuario
  const [placasExistentes] = await db.query(
    "SELECT ID_Vehiculo FROM vehiculos WHERE Placa = ?",
    [placaFinal]
  );
  if (placasExistentes.length > 0) {
    // No insertamos nada y regresamos error 409
    throw httpError(409, "Esta placa ya está registrada");
  }
  // 1) Insertar usuario
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

  // 2) Insertar vehículo
  const idUsuario = rU.insertId;
  await db.query(
    `INSERT INTO vehiculos (Placa, Color, ID_Marca, ID_Usuario)
     VALUES (?, ?, ?, ?)`,
    [placaFinal, color || null, idMarca, idUsuario]
  );

  res.status(201).json({ ok: true, ID_Usuario: idUsuario });
};

// Listar visitantes (nuevo y temporal)
// Listar visitantes (nuevo y temporal)
exports.listarVisitantes = async (req, res) => {
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
};


// Obtener usuario por ID
exports.obtenerUsuarioPorId = async (req, res) => {
  const { id } = req.params;
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

  if (resultados.length === 0) throw httpError(404, "Usuario no encontrado");
  res.json(resultados[0]);
};

// Buscar usuario por matrícula
exports.buscarUsuarioPorMatricula = async (req, res) => {
  const { matricula } = req.params;
  const [resultados] = await db.query(`
    SELECT u.*, v.Placa, v.Color, v.ID_Marca
    FROM usuarios u
    LEFT JOIN vehiculos v ON u.ID_Usuario = v.ID_Usuario
    WHERE u.Matricula = ?
  `, [matricula]);

  if (resultados.length === 0) throw httpError(404, "Usuario no encontrado");
  res.json(resultados[0]);
};

exports.actualizarUsuario = async (req, res) => {
  const { id } = req.params;
  const {
    nombre_completo,
    matricula,
    licenciatura,
    area_empleado,
    placa,
    color,
    idMarca,          // <- viene del frontend
    marca,
    nuevaMarcaTexto
  } = req.body;

  // 1) Resolver la marca
  let idMarcaFinal = null;

  if (idMarca) {
    // Si ya viene el ID de la marca desde el front, lo usamos directo
    idMarcaFinal = idMarca;
  } else if (nuevaMarcaTexto) {
    // Crear una marca nueva
    const [insertResult] = await db.query(
      "INSERT INTO marca_vehiculos (Marca) VALUES (?)",
      [nuevaMarcaTexto]
    );
    idMarcaFinal = insertResult.insertId;
  } else if (marca) {
    // Buscar la marca por nombre de texto
    const [marcaRows] = await db.query(
      "SELECT ID_Marca FROM marca_vehiculos WHERE Marca = ?",
      [marca]
    );
    if (marcaRows.length > 0) {
      idMarcaFinal = marcaRows[0].ID_Marca;
    } else {
      throw httpError(400, "La marca especificada no existe");
    }
  } else {
    throw httpError(400, "No se proporcionó marca válida");
  }

  // 2) Actualizar tabla usuarios
  await db.query(
    `UPDATE usuarios SET 
      Nombre_Completo = ?, 
      Matricula = ?, 
      Licenciatura = ?, 
      Area_Empleado = ?
     WHERE ID_Usuario = ?`,
    [nombre_completo, matricula, licenciatura, area_empleado, id]
  );

  // 3) Actualizar tabla vehículos
  await db.query(
    `UPDATE vehiculos SET 
      Placa = ?, 
      Color = ?, 
      ID_Marca = ?
     WHERE ID_Usuario = ?`,
    [placa, color, idMarcaFinal, id]
  );

  res.status(200).json({ mensaje: "Usuario actualizado correctamente" });
};


// Eliminar un usuario
exports.eliminarUsuario = async (req, res) => {
  const { id } = req.params;
  // Eliminar de vehiculos primero por FK
  await db.query('DELETE FROM vehiculos WHERE ID_Usuario = ?', [id]);
  // Luego eliminar de usuarios
  await db.query('DELETE FROM usuarios WHERE ID_Usuario = ?', [id]);
  res.status(200).json({ mensaje: "Usuario eliminado correctamente" });
};
