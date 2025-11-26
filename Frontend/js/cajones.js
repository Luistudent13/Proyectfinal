// js/cajones.js

// ==========================================
// 1. CONFIGURACIÓN DE CONEXIÓN (Integrada)
// ==========================================
// Ajusta el puerto si tu backend no es el 3000
const BASE_URL = "http://localhost:3000"; 

// Función interna para hacer peticiones sin archivo extra
async function api(endpoint, options = {}) {
  // Asegurar que el endpoint empiece con /
  if (!endpoint.startsWith("/")) endpoint = "/" + endpoint;
  
  const url = `${BASE_URL}${endpoint}`;
  
  const headers = {
    "Content-Type": "application/json"
  };

  const config = {
    ...options,
    headers: {
      ...headers,
      ...options.headers
    }
  };

  if (config.body && typeof config.body === "object") {
    config.body = JSON.stringify(config.body);
  }

  try {
    const res = await fetch(url, config);
    if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || `Error ${res.status}`);
    }
    return await res.json();
  } catch (error) {
    console.error("Error de conexión:", error);
    throw error;
  }
}

// ==========================================
// 2. LÓGICA DE LA PÁGINA
// ==========================================

document.addEventListener("DOMContentLoaded", cargarCajones);

async function cargarCajones() {
  const grid = document.getElementById("gridCajones");
  grid.innerHTML = "<p style='text-align:center; width:100%;'>Cargando cajones...</p>";

  try {
    const cajones = await api("/cajones");
    grid.innerHTML = "";

    if (cajones.length === 0) {
        grid.innerHTML = "<p>No hay cajones registrados.</p>";
        return;
    }

    cajones.forEach(c => {
      const div = document.createElement("div");
      div.className = "cajon";

      if (c.ID_Estado === 1) div.classList.add("disponible");
      if (c.ID_Estado === 2) div.classList.add("ocupado");
      if (c.Es_Reservado === 1) div.classList.add("reservado");
      if (c.Es_Discapacitado === 1) div.classList.add("discapacitado");

      div.innerHTML = `
        <p style="margin:0; font-size:1.2em;">Cajón <strong>${c.Numero_Cajon}</strong></p>
        <p style="margin:5px 0;">${c.ID_Estado === 1 ? "Libre" : "Ocupado"}</p>
        <p style="margin:0; font-size:0.9em;">${c.Es_Reservado ? "⭐ Reservado" : ""}</p>
        <p style="margin:5px 0; color:#444;">${c.PlacaOcupante ? "🚗 " + c.PlacaOcupante : ""}</p>
      `;

      div.addEventListener("click", () => manejarAccion(c));

      grid.appendChild(div);
    });

  } catch (err) {
    console.error(err);
    grid.innerHTML = "<p style='color:red; text-align:center;'>Error al conectar con el servidor.<br>Revisa que el Backend esté encendido.</p>";
  }
}

async function manejarAccion(cajon) {
  // Si está ocupado -> Solo opción de liberar
  if (cajon.ID_Estado === 2) {
    Swal.fire({
      icon: "warning",
      title: `Cajón ${cajon.Numero_Cajon}`,
      text: "Este cajón está ocupado. ¿Deseas liberarlo?",
      showCancelButton: true,
      confirmButtonText: "Liberar",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#d33",
      customClass: { popup: "swal-wide" }
    }).then(async (res) => {
      if (res.isConfirmed) {
        try {
            await api(`/cajones/liberar/${cajon.ID_Cajon}`, { method: "POST" });
            Swal.fire("Liberado", "El cajón fue liberado.", "success");
            cargarCajones();
        } catch(e) {
            Swal.fire("Error", "No se pudo liberar", "error");
        }
      }
    });
    return;
  }

  // Si está libre -> Menú de opciones
  Swal.fire({
    title: `Cajón ${cajon.Numero_Cajon}`,
    html: `
      <div style="display:flex; flex-direction:column; gap:10px;">
        <button id="btnReservar" class="swal2-confirm swal2-styled" style="background:#f59e0b; width:100%; margin:0;">
          ${cajon.Es_Reservado ? "Quitar Reserva" : "Reservar"}
        </button>
        <button id="btnOcupar" class="swal2-confirm swal2-styled" style="background:#ef4444; width:100%; margin:0;">
          Ocupar (Prueba)
        </button>
      </div>
    `,
    showConfirmButton: false,
    showCloseButton: true,
    customClass: { popup: "swal-wide" },
    didOpen: () => {
      const bReservar = document.getElementById("btnReservar");
      const bOcupar = document.getElementById("btnOcupar");

      bReservar.onclick = async () => {
        Swal.close(); // Cerramos el modal antes de la acción
        await reservarCajon(cajon);
      };

      bOcupar.onclick = async () => {
        Swal.close();
        await ocuparCajon(cajon);
      };
    }
  });
}

async function reservarCajon(c) {
  try {
      await api(`/cajones/reservar/${c.ID_Cajon}`, {
        method: "POST",
        body: { reservado: c.Es_Reservado ? 0 : 1 }
      });
      Swal.fire("Listo", "Estado de reserva actualizado.", "success");
      cargarCajones();
  } catch (e) {
      Swal.fire("Error", "No se pudo cambiar la reserva", "error");
  }
}

async function ocuparCajon(c) {
  try {
      // AQUÍ ESTÁ EL ID DE VEHÍCULO "QUEMADO" (Hardcoded) PARA PRUEBAS
      // Asegúrate de que exista un vehículo con ID 1 en tu base de datos
      await api(`/cajones/ocupar/${c.ID_Cajon}`, {
        method: "POST",
        body: { idVehiculo: 1 } 
      });

      Swal.fire("Ocupado", "El cajón ahora está ocupado.", "success");
      cargarCajones();
  } catch (e) {
      console.log(e);
      Swal.fire("Error", "No se pudo ocupar (¿Quizás el vehículo ID 1 no existe?)", "error");
  }
}