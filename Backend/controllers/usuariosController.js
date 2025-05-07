const db = require("../config/database");

// 🔹 Obtener todos los usuarios
exports.obtenerUsuarios = async (req, res) => {
  try {
    const [resultados] = await db.query("SELECT * FROM usuarios ORDER BY ID_Usuario DESC");
    res.json(resultados);
  } catch (error) {
    console.error("Error al obtener usuarios:", error);
    res.status(500).json({ error: "Error al obtener usuarios" });
  }
};

// 🔹 Registrar nuevo usuario (Alumno, Empleado, Visitante, etc.)
exports.registrarUsuario = async (req, res) => {
  const {
    nombre,
    apellidos,
    matricula,
    placa,
    color,
    marca,
    tipoUsuario,
    licenciatura,
    areaEmpleado,
    personaRecoge,
    relacionEstudiante,
  } = req.body;

  try {
    // Insertar usuario
    const [usuarioResultado] = await db.query(
      `INSERT INTO usuarios (Nombre, Apellidos, Matricula, ID_Tipo_Usuario, Licenciatura, Area_Empleado, Persona_Recoge, Relacion_Estudiante)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [nombre, apellidos, matricula, tipoUsuario, licenciatura, areaEmpleado, personaRecoge, relacionEstudiante]
    );

    const idUsuario = usuarioResultado.insertId;

    // Insertar vehículo (si aplica)
    if (placa && color && marca) {
      await db.query(
        `INSERT INTO vehiculos (Placa, Color, ID_Usuario, ID_Marca)
         VALUES (?, ?, ?, ?)`,
        [placa, color, idUsuario, marca]
      );
    }

    res.status(201).json({ mensaje: "Usuario registrado exitosamente", idUsuario });
  } catch (error) {
    console.error("Error al registrar usuario:", error);
    res.status(500).json({ error: "Error al registrar usuario" });
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
    nombre,
    apellidos,
    matricula,
    licenciatura,
    areaEmpleado,
    personaRecoge,
    relacionEstudiante,
  } = req.body;

  try {
    await db.query(
      `UPDATE usuarios SET
        Nombre = ?, Apellidos = ?, Matricula = ?,
        Licenciatura = ?, Area_Empleado = ?, Persona_Recoge = ?, Relacion_Estudiante = ?
       WHERE ID_Usuario = ?`,
      [nombre, apellidos, matricula, licenciatura, areaEmpleado, personaRecoge, relacionEstudiante, id]
    );

    res.json({ mensaje: "Usuario actualizado correctamente" });
  } catch (error) {
    console.error("Error al actualizar usuario:", error);
    res.status(500).json({ error: "Error al actualizar usuario" });
  }
};
