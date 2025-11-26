const apiFetch = window.apiFetch;

document.addEventListener("DOMContentLoaded", cargarCajones);

async function cargarCajones() {
  const grid = document.getElementById("gridCajones");
  grid.innerHTML = "<p>Cargando cajones...</p>";

  try {
    const cajones = await apiFetch("/cajones");
    grid.innerHTML = "";

    cajones.forEach(c => {
      const div = document.createElement("div");
      div.className = "cajon";

      // CLASES DEPENDIENDO DEL ESTADO
      if (c.ID_Estado === 1) div.classList.add("disponible");
      if (c.ID_Estado === 2) div.classList.add("ocupado");
      if (c.Es_Reservado === 1) div.classList.add("reservado");
      if (c.Es_Discapacitado === 1) div.classList.add("discapacitado");

      div.innerHTML = `
        <p>Cajón <strong>${c.Numero_Cajon}</strong></p>
        <p>${c.ID_Estado === 1 ? "Libre" : "Ocupado"}</p>
        <p>Reservado: ${c.Es_Reservado ? "Sí" : "No"}</p>
        <p>${c.PlacaOcupante ? "🚗 " + c.PlacaOcupante : ""}</p>
      `;

      div.addEventListener("click", () => manejarAccion(c));

      grid.appendChild(div);
    });

  } catch (err) {
    grid.innerHTML = "<p>Error cargando cajones</p>";
  }
}


async function manejarAccion(cajon) {
  // Si está ocupado → solo se puede liberar
  if (cajon.ID_Estado === 2) {
    if (confirm(`¿Liberar cajón ${cajon.Numero_Cajon}?`)) {
      await apiFetch(`/cajones/liberar/${cajon.ID_Cajon}`, { method: "POST" });
      cargarCajones();
    }
    return;
  }

  // Si NO está ocupado → puede reservar o ocupar
  const accion = prompt(
    `Cajón ${cajon.Numero_Cajon}:\n` +
    `1 - Reservar / Quitar reserva\n` +
    `2 - Ocupar (vehículo de prueba)\n` +
    `3 - Cancelar`
  );

  if (accion === "1") {
    await apiFetch(`/cajones/reservar/${cajon.ID_Cajon}`, {
      method: "POST",
      body: { reservado: cajon.Es_Reservado ? 0 : 1 }
    });
  }

  if (accion === "2") {
    await apiFetch(`/cajones/ocupar/${cajon.ID_Cajon}`, {
      method: "POST",
      body: { idVehiculo: 1 } // 🚨 luego lo conectamos al vehículo real
    });
  }

  cargarCajones();
}

