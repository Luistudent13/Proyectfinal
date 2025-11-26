document.addEventListener("DOMContentLoaded", async () => {
  // 1. Opcional: Si quieres proteger la pantalla, descomenta esto:
  // requireAuth({ roles: ["ADMIN", "GUARDIA", "ALUMNO"] }); 

  cargarCajones();
});

// ==============================
// 1. CARGAR DATOS (Usando apiFetch de shared.js)
// ==============================
async function cargarCajones() {
  const grid = document.getElementById("gridCajones");
  grid.innerHTML = "<p>Cargando mapa...</p>";

  try {
    // apiFetch viene de shared.js, ya sabe la URL correcta
    const cajones = await apiFetch("/cajones"); 
    
    grid.innerHTML = ""; // Limpiar mensaje de carga

    if (cajones.length === 0) {
        grid.innerHTML = "<p>No se encontraron cajones.</p>";
        return;
    }

    cajones.forEach(c => {
      const div = document.createElement("div");
      div.className = "cajon";

      // Asignar clases CSS según estado
      if (c.ID_Estado === 1) div.classList.add("disponible");
      if (c.ID_Estado === 2) div.classList.add("ocupado");
      if (c.Es_Reservado === 1) div.classList.add("reservado");

      div.innerHTML = `
        <div>${c.Numero_Cajon}</div>
        <small>${c.ID_Estado === 1 ? "Libre" : "Ocupado"}</small>
        ${c.Es_Reservado ? "<br>⭐ Reservado" : ""}
      `;

      // Evento Click
      div.addEventListener("click", () => manejarClick(c));

      grid.appendChild(div);
    });

  } catch (err) {
    console.error(err);
    grid.innerHTML = "<p style='color:red'>Error al conectar con el servidor.</p>";
  }
}

// ==============================
// 2. MANEJAR CLICK (Lógica)
// ==============================
function manejarClick(cajon) {
    // Si está ocupado, sugerir liberar
    if (cajon.ID_Estado === 2) {
        Swal.fire({
            title: `Cajón ${cajon.Numero_Cajon}`,
            text: "¿Liberar este espacio?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Sí, liberar",
            cancelButtonText: "Cancelar"
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await apiFetch(`/cajones/liberar/${cajon.ID_Cajon}`, { method: "POST" });
                    Swal.fire("Liberado", "", "success");
                    cargarCajones(); // Recargar grid
                } catch (error) {
                    Swal.fire("Error", "No se pudo liberar", "error");
                }
            }
        });
        return;
    }

    // Si está libre, reservar u ocupar
    Swal.fire({
        title: `Cajón ${cajon.Numero_Cajon}`,
        text: "Selecciona una acción",
        showDenyButton: true,
        showCancelButton: true,
        confirmButtonText: cajon.Es_Reservado ? "Quitar Reserva" : "Reservar",
        denyButtonText: "Ocupar (Prueba)",
        cancelButtonText: "Cancelar"
    }).then(async (result) => {
        if (result.isConfirmed) {
            // Acción: Reservar / Quitar Reserva
            await apiFetch(`/cajones/reservar/${cajon.ID_Cajon}`, {
                method: "POST",
                body: JSON.stringify({ reservado: cajon.Es_Reservado ? 0 : 1 })
            });
            Swal.fire("Éxito", "Estado de reserva actualizado", "success");
            cargarCajones();

        } else if (result.isDenied) {
            // Acción: Ocupar (Simulado con Vehículo ID 1)
            try {
                await apiFetch(`/cajones/ocupar/${cajon.ID_Cajon}`, {
                    method: "POST",
                    body: JSON.stringify({ idVehiculo: 1 }) 
                });
                Swal.fire("Ocupado", "", "success");
                cargarCajones();
            } catch (e) {
                Swal.fire("Error", "No se pudo ocupar", "error");
            }
        }
    });
}