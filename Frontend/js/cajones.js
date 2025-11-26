// /js/cajones.js
const api = window.apiFetch;

document.addEventListener("DOMContentLoaded", cargarCajones);

// ==============================
// 1. CARGAR CAJONES
// ==============================
async function cargarCajones() {
  const grid = document.getElementById("gridCajones");
  grid.innerHTML = "<p>Cargando cajones...</p>";

  try {
    const cajones = await api("/cajones");
    grid.innerHTML = "";

    cajones.forEach(c => {
      const div = document.createElement("div");
      div.className = "cajon";

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
    console.error(err);
    grid.innerHTML = "<p>Error cargando cajones</p>";
  }
}

// ==============================
// 2. MODAL BONITO (SweetAlert2)
// ==============================
async function manejarAccion(cajon) {
  // Si está ocupado → solo liberar
  if (cajon.ID_Estado === 2) {
    Swal.fire({
      icon: "warning",
      title: `Cajón ${cajon.Numero_Cajon}`,
      text: "Este cajón está ocupado. ¿Deseas liberarlo?",
      showCancelButton: true,
      confirmButtonText: "Liberar",
      cancelButtonText: "Cancelar",
      customClass: { popup: "swal-wide" }
    }).then(async (res) => {
      if (res.isConfirmed) {
        await api(`/cajones/liberar/${cajon.ID_Cajon}`, { method: "POST" });
        cargarCajones();
        Swal.fire("Liberado", "El cajón fue liberado.", "success");
      }
    });

    return;
  }

  // Si está libre → Mostrar menú con botones
  Swal.fire({
    icon: "info",
    title: `Cajón ${cajon.Numero_Cajon}`,
    html: `
      <div style="display:flex; flex-direction:column; gap:12px;">
        <button id="btnReservar" class="swal2-confirm swal2-styled" style="background:#3b82f6;">
          ${cajon.Es_Reservado ? "Quitar reserva" : "Reservar"}
        </button>
        <button id="btnOcupar" class="swal2-confirm swal2-styled" style="background:#22c55e;">
          Ocupar (vehículo de prueba)
        </button>
        <button id="btnCancelar" class="swal2-cancel swal2-styled" style="display:block; margin-top:5px;">
          Cancelar
        </button>
      </div>
    `,
    showConfirmButton: false,
    customClass: { popup: "swal-wide" },
    didOpen: () => {
      document.getElementById("btnReservar").onclick = async () => {
        await reservarCajon(cajon);
      };

      document.getElementById("btnOcupar").onclick = async () => {
        await ocuparCajon(cajon);
      };

      document.getElementById("btnCancelar").onclick = () => {
        Swal.close();
      };
    }
  });
}

// ==============================
// 3. ACCIONES
// ==============================
async function reservarCajon(c) {
  await api(`/cajones/reservar/${c.ID_Cajon}`, {
    method: "POST",
    body: { reservado: c.Es_Reservado ? 0 : 1 }
  });

  Swal.fire("Listo", "Reserva actualizada.", "success");
  cargarCajones();
}

async function ocuparCajon(c) {
  await api(`/cajones/ocupar/${c.ID_Cajon}`, {
    method: "POST",
    body: { idVehiculo: 1 } // Luego lo conectarás con datos reales
  });

  Swal.fire("Ocupado", "El cajón ahora está ocupado.", "success");
  cargarCajones();
}
