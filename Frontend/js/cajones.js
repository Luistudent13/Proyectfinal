// Frontend/js/cajones.js
// Mapa de cajones conectado al backend real (/cajones)

document.addEventListener("DOMContentLoaded", () => {
  // Si quieres proteger la pantalla, descomenta:
  // requireAuth({ roles: ["ADMIN", "GUARDIA"] });
  cargarCajones();
});

// ==============================
// 1. CARGAR CAJONES DESDE EL BACK
// ==============================
async function cargarCajones() {
  const grid = document.getElementById("gridCajones");
  grid.innerHTML = "<p>Cargando mapa...</p>";

  try {
    const data = await apiFetch("/cajones"); // GET /api/cajones

    grid.innerHTML = "";

    if (!Array.isArray(data) || data.length === 0) {
      grid.innerHTML = "<p>No se encontraron cajones.</p>";
      return;
    }

    data.forEach(raw => {
      // Normalizar tipos (por si vienen como strings)
      const cajon = {
        ...raw,
        ID_Cajon: Number(raw.ID_Cajon),
        Numero_Cajon: Number(raw.Numero_Cajon),
        ID_Estado: Number(raw.ID_Estado),
        Es_Discapacitado: Number(raw.Es_Discapacitado),
        Es_Reservado: Number(raw.Es_Reservado),
      };

      const div = document.createElement("div");
      div.className = "cajon";

      // Colores por estado
      if (cajon.ID_Estado === 1) div.classList.add("disponible");
      else if (cajon.ID_Estado === 2) div.classList.add("ocupado");

      if (cajon.Es_Reservado === 1) div.classList.add("reservado");
      if (cajon.Es_Discapacitado === 1) div.classList.add("discapacitado");

      const estadoTexto =
        cajon.ID_Estado === 1 ? "Libre" :
        cajon.ID_Estado === 2 ? "Ocupado" :
        cajon.ID_Estado === 3 ? "Reservado" :
        cajon.ID_Estado === 4 ? "Mantenimiento" :
        cajon.ID_Estado === 5 ? "Bloqueado" : "Desconocido";

      div.innerHTML = `
        <strong>Cajón ${cajon.Numero_Cajon}</strong>
        <small>${estadoTexto}</small>
        ${cajon.Es_Reservado === 1 ? "<br><span>⭐ Reservado</span>" : ""}
        ${cajon.Es_Discapacitado === 1 ? "<br><span>♿ Preferente</span>" : ""}
        ${cajon.PlacaOcupante ? `<br><span style="font-size:0.8rem;">🚗 ${cajon.PlacaOcupante}</span>` : ""}
      `;

      div.addEventListener("click", () => manejarClickCajon(cajon));

      grid.appendChild(div);
    });
  } catch (error) {
    console.error("[cajones] Error cargando cajones:", error);
    grid.innerHTML =
      "<p style='color:red'>Error al conectar con el servidor. Revisa el backend.</p>";
  }
}

// ==============================
// 2. MANEJAR CLICK EN UN CAJÓN
// ==============================
function manejarClickCajon(cajon) {
  // Si está ocupado → ofrecer LIBERAR
  if (cajon.ID_Estado === 2) {
    Swal.fire({
      title: `Cajón ${cajon.Numero_Cajon}`,
      text: cajon.PlacaOcupante
        ? `Actualmente ocupado por la placa ${cajon.PlacaOcupante}. ¿Liberar este espacio?`
        : "El cajón está ocupado. ¿Liberar este espacio?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, liberar",
      cancelButtonText: "Cancelar",
    }).then(async (result) => {
      if (result.isConfirmed) {
        await liberarCajon(cajon);
      }
    });

    return;
  }

  // Si está libre → Reservar / Quitar reserva / Ocupar
  Swal.fire({
    title: `Cajón ${cajon.Numero_Cajon}`,
    text: "Selecciona una acción",
    showDenyButton: true,
    showCancelButton: true,
    confirmButtonText: cajon.Es_Reservado === 1 ? "Quitar reserva" : "Reservar",
    denyButtonText: "Ocupar (vehículo real)",
    cancelButtonText: "Cancelar",
  }).then(async (result) => {
    if (result.isConfirmed) {
      // Reservar o quitar reserva
      await cambiarReservaCajon(cajon);
    } else if (result.isDenied) {
      // Ocupar con un ID_Vehiculo REAL
      await ocuparCajon(cajon);
    }
  });
}

// ==============================
// 3. LLAMADAS REALES AL BACKEND
// ==============================

// 3.1 Liberar cajón (POST /cajones/liberar/:id)
async function liberarCajon(cajon) {
  try {
    await apiFetch(`/cajones/liberar/${cajon.ID_Cajon}`, {
      method: "POST",
    });

    Swal.fire("Liberado", "El cajón se liberó correctamente.", "success");
    cargarCajones();
  } catch (error) {
    console.error("[cajones] Error al liberar cajón:", error);
    Swal.fire("Error", "No se pudo liberar el cajón.", "error");
  }
}

// 3.2 Reservar / quitar reserva (POST /cajones/reservar/:id)
async function cambiarReservaCajon(cajon) {
  const nuevoValor = cajon.Es_Reservado === 1 ? 0 : 1;

  try {
    await apiFetch(`/cajones/reservar/${cajon.ID_Cajon}`, {
      method: "POST",
      body: JSON.stringify({ reservado: nuevoValor }),
    });

    Swal.fire(
      "Éxito",
      nuevoValor ? "Cajón reservado." : "Reserva eliminada.",
      "success"
    );
    cargarCajones();
  } catch (error) {
    console.error("[cajones] Error al cambiar reserva:", error);
    Swal.fire(
      "Error",
      "No se pudo actualizar el estado de reserva del cajón.",
      "error"
    );
  }
}

// 3.3 Ocupar cajón (POST /cajones/ocupar/:id)
//      Aquí ya usas un ID_Vehiculo REAL (no el 1 quemado)
async function ocuparCajon(cajon) {
  const { value: idVehiculo } = await Swal.fire({
    title: `Ocupar cajón ${cajon.Numero_Cajon}`,
    input: "number",
    inputLabel: "ID del vehículo (ID_Vehiculo en la BD)",
    inputPlaceholder: "Ej. 75",
    showCancelButton: true,
    confirmButtonText: "Ocupar",
    cancelButtonText: "Cancelar",
    inputValidator: (value) => {
      if (!value) return "Debes introducir un ID de vehículo.";
      if (Number.isNaN(Number(value))) return "El ID debe ser numérico.";
      return null;
    },
  });

  if (!idVehiculo) return; // Cancelado

  try {
    await apiFetch(`/cajones/ocupar/${cajon.ID_Cajon}`, {
      method: "POST",
      body: JSON.stringify({ idVehiculo: Number(idVehiculo) }),
    });

    Swal.fire("Ocupado", "El cajón se marcó como ocupado.", "success");
    cargarCajones();
  } catch (error) {
    console.error("[cajones] Error al ocupar cajón:", error);
    Swal.fire(
      "Error",
      "No se pudo ocupar el cajón. Verifica que el ID del vehículo exista.",
      "error"
    );
  }
}
