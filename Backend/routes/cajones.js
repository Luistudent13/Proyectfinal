// routes/cajones.js
const express = require("express");
const router = express.Router();
const db = require("../config/database");

// =========================
// 1. LISTAR LOS CAJONES
// =========================
router.get("/", async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        ce.ID_Cajon,
        ce.Numero_Cajon,
        ce.ID_Estado,
        ce.Es_Discapacitado,
        ce.Es_Reservado,
        ce.ID_Vehiculo_Ocupando,
        v.Placa AS PlacaOcupante
      FROM cajones_estacionamiento ce
      LEFT JOIN vehiculos v 
        ON ce.ID_Vehiculo_Ocupando = v.ID_Vehiculo
      ORDER BY ce.Numero_Cajon ASC
    `);

    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al obtener los cajones" });
  }
});

// =========================
// 2. RESERVAR O QUITAR RESERVA
// =========================
router.post("/reservar/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { reservado } = req.body;

    await db.query(
      "UPDATE cajones_estacionamiento SET Es_Reservado = ? WHERE ID_Cajon = ?",
      [reservado ? 1 : 0, id]
    );

    res.json({ mensaje: "Reserva actualizada", reservado: reservado ? 1 : 0 });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al reservar cajón" });
  }
});

// =========================
// 3. OCUPAR CAJÓN
// =========================
router.post("/ocupar/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { idVehiculo } = req.body;

    await db.query(
      `
      UPDATE cajones_estacionamiento 
      SET ID_Estado = 2, ID_Vehiculo_Ocupando = ?
      WHERE ID_Cajon = ?
      `,
      [idVehiculo, id]
    );

    res.json({ mensaje: "Cajón ocupado correctamente" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al ocupar cajón" });
  }
});

// =========================
// 4. LIBERAR CAJÓN
// =========================
router.post("/liberar/:id", async (req, res) => {
  try {
    const { id } = req.params;

    await db.query(
      `
      UPDATE cajones_estacionamiento 
      SET ID_Estado = 1,
          ID_Vehiculo_Ocupando = NULL
      WHERE ID_Cajon = ?
      `,
      [id]
    );

    res.json({ mensaje: "Cajón liberado correctamente" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al liberar cajón" });
  }
});

module.exports = router;
