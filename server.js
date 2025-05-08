require('dotenv').config();
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// Configuración de la base de datos
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

db.connect(err => {
    if (err) {
        console.error('Error al conectar con MySQL:', err);
    } else {
        console.log('Conectado a MySQL');
    }
});

app.get('/usuarios', (req, res) => {
    const query = `
        SELECT u.ID_Usuario, u.Nombre_Completo, u.Matricula, u.ID_Tipo_Usuario,
               u.Licenciatura, v.Placa, m.Marca AS Marca, v.Color
        FROM Usuarios u
        LEFT JOIN Vehiculos v ON u.ID_Usuario = v.ID_Usuario
        LEFT JOIN marca_vehiculos m ON v.ID_Marca = m.ID_Marca
    `;

    db.query(query, (err, results) => {
        if (err) {
            console.error("🚨 Error en la consulta:", err);
            return res.status(500).json({ error: err });
        }
        res.json(results);
    });
});




app.post('/usuarios', (req, res) => {
    const { Nombre_Completo, ID_Tipo_Usuario, Matricula, Licenciatura = "", Persona_Recoge = "", Relacion_Estudiante = "" } = req.body;

    const matriculaNormalizada = Matricula.trim().toUpperCase();

    // Verifica si ya existe la matrícula
    db.query('SELECT * FROM Usuarios WHERE UPPER(TRIM(Matricula)) = ?', [matriculaNormalizada], (err, results) => {
        if (err) return res.status(500).json({ error: err });

        if (results.length > 0) {
            return res.status(400).json({ error: 'Ya existe un usuario con esa matrícula.' });
        }

        // Si no existe, insertar
        db.query(
            'INSERT INTO Usuarios (Nombre_Completo, ID_Tipo_Usuario, Matricula, Licenciatura, Persona_Recoge, Relacion_Estudiante) VALUES (?, ?, ?, ?, ?, ?)',
            [Nombre_Completo, ID_Tipo_Usuario, matriculaNormalizada, Licenciatura, Persona_Recoge, Relacion_Estudiante],
        
            (err, result) => {
                if (err) return res.status(500).json({ error: err });
                res.json({ message: 'Usuario registrado', userId: result.insertId });
            }
        );
    });
});


// 🚗 Rutas de vehículos
app.get('/vehiculos', (req, res) => {
    db.query('SELECT * FROM Vehiculos', (err, results) => {
        if (err) return res.status(500).json({ error: err });
        res.json(results);
    });
});

app.post('/vehiculos', (req, res) => {
    const { ID_Usuario, Placa, ID_Marca, Modelo = "", Color, ID_Discapacidad = null } = req.body;

    const placaNormalizada = Placa.trim().toUpperCase();

    // Verifica si ya existe la placa
    db.query('SELECT * FROM Vehiculos WHERE UPPER(TRIM(Placa)) = ?', [placaNormalizada], (err, results) => {
        if (err) return res.status(500).json({ error: err });

        if (results.length > 0) {
            return res.status(400).json({ error: 'Ya existe un vehículo con esa placa.' });
        }

        // Si no existe, insertar
        db.query(
            'INSERT INTO Vehiculos (ID_Usuario, Placa, ID_Marca, Modelo, Color, ID_Discapacidad) VALUES (?, ?, ?, ?, ?, ?)',
            [ID_Usuario, placaNormalizada, ID_Marca, Modelo, Color, ID_Discapacidad],
            (err, result) => {
                if (err) return res.status(500).json({ error: err });
                res.json({ message: 'Vehículo registrado', vehicleId: result.insertId });
            }
        );
    });
});

// 📌 Rutas de cajones
app.get('/cajones', (req, res) => {
    db.query('SELECT * FROM Cajones_Estacionamiento', (err, results) => {
        if (err) return res.status(500).json({ error: err });
        res.json(results);
    });
});

app.post('/asignar-cajon', (req, res) => {
    const { ID_Cajon, ID_Vehiculo } = req.body;
    db.query(
        'INSERT INTO Asignacion_Cajones (ID_Cajon, ID_Vehiculo) VALUES (?, ?)',
        [ID_Cajon, ID_Vehiculo],
        (err, result) => {
            if (err) return res.status(500).json({ error: err });
            res.json({ message: 'Cajón asignado', assignmentId: result.insertId });
        }
    );
});

// ⏳ Registro de accesos
app.get('/accesos', (req, res) => {
    const query = `
      SELECT a.ID_Acceso, u.Nombre_Completo AS Nombre_Usuario, v.Placa, a.Hora_Entrada
      FROM Registros_Acceso a
      JOIN Usuarios u ON a.ID_Usuario = u.ID_Usuario
      JOIN Vehiculos v ON a.ID_Vehiculo = v.ID_Vehiculo
      ORDER BY a.Hora_Entrada DESC
    `;
    db.query(query, (err, results) => {
      if (err) return res.status(500).json({ error: err });
      res.json(results);
    });
  });

app.post('/registrar-acceso', (req, res) => {
    const { ID_Vehiculo, ID_Usuario, Hora_Entrada } = req.body;
    db.query(
        'INSERT INTO Registros_Acceso (ID_Vehiculo, ID_Usuario, Hora_Entrada) VALUES (?, ?, ?)',
        [ID_Vehiculo, ID_Usuario, Hora_Entrada],
        (err, result) => {
            if (err) return res.status(500).json({ error: err });
            res.json({ message: 'Acceso registrado', accessId: result.insertId });
        }
    );
});


// ❌ Eliminar usuario y su vehículo
app.delete('/usuarios/:id', (req, res) => {
    const id = req.params.id;

    // Primero eliminamos el vehículo relacionado con el usuario
    db.query('DELETE FROM Vehiculos WHERE ID_Usuario = ?', [id], (err) => {
        if (err) return res.status(500).json({ error: err });

        // Luego eliminamos el usuario
        db.query('DELETE FROM Usuarios WHERE ID_Usuario = ?', [id], (err2) => {
            if (err2) return res.status(500).json({ error: err2 });
            res.json({ message: 'Usuario y vehículo eliminados correctamente' });
        });
    });
});

app.put('/editar-usuario/:id', (req, res) => {
    const id = req.params.id;
    const { Nombre_Completo, Matricula, Placa, Color, ID_Marca, Licenciatura = "" } = req.body;
  
    db.query(
        'UPDATE Usuarios SET Nombre_Completo = ?, Matricula = ?, Licenciatura = ? WHERE ID_Usuario = ?',
        [Nombre_Completo, Matricula, Licenciatura, id],      
      (err) => {
        if (err) return res.status(500).json({ error: err });
  
        db.query(
          'UPDATE Vehiculos SET Placa = ?, Color = ?, ID_Marca = ? WHERE ID_Usuario = ?',
          [Placa, Color, ID_Marca, id],
          (err2) => {
            if (err2) return res.status(500).json({ error: err2 });
            res.json({ message: 'Usuario actualizado correctamente' });
          }
        );
      }
    );
  });

  // ✅ Obtener ID de marca por nombre
app.get('/marcas/id', (req, res) => {
    const { nombre } = req.query;

    if (!nombre) {
        return res.status(400).json({ error: "Se requiere el nombre de la marca" });
    }

    db.query('SELECT ID_Marca FROM marca_vehiculos WHERE TRIM(LOWER(Marca)) = TRIM(LOWER(?))', [nombre]
, (err, results) => {
        if (err) {
            console.error("Error al obtener ID de marca:", err);
            return res.status(500).json({ error: "Error interno al buscar la marca" });
        }

        if (results.length === 0) {
            return res.status(404).json({ error: "Marca no encontrada" });
        }

        res.json({ idMarca: results[0].ID_Marca });
    });
});


const path = require('path');

// Servir archivos estáticos (HTML, CSS, JS)
app.use(express.static(path.join(__dirname)));

// Ruta raíz para mostrar el index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});


// 🏁 Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
