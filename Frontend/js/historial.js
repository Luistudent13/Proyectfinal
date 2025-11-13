document.addEventListener("DOMContentLoaded", () => {
  cargarHistorial();
});

async function cargarHistorial() {
  try {
    const accesos = await apiFetch("/accesos");

    const tbody = document.getElementById("tablaHistorialBody");
    tbody.innerHTML = "";

    accesos.forEach((acceso) => {
      const fila = document.createElement("tr");
      fila.innerHTML = `
        <td>${acceso.Nombre_Completo || "-"}</td>
        <td>${acceso.Placa || "-"}</td>
        <td>${formatearFecha(acceso.Fecha_Acceso || acceso.Fecha_Registro)}</td>
        <td>${formatearSoloHora(acceso.Hora_Entrada)}</td>
        <td>${formatearSoloHora(acceso.Hora_Salida)}</td>
      `;
      tbody.appendChild(fila);
    });
  } catch (err) {
    console.error(err);
    alert(err.message || "Error al cargar historial.");
  }
}

function formatearFecha(fechaISO) {
  if (!fechaISO) return "-";
  const normal = String(fechaISO).replace(" ", "T");
  const fecha = new Date(normal);
  if (isNaN(fecha)) return "-";
  return fecha.toLocaleDateString("es-MX", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
}

function formatearSoloHora(valor) {
  if (!valor) return "-";

  const str = String(valor).trim();

  // Si viene solo como hora desde MySQL: "HH:MM:SS" o "HH:MM"
  if (/^\d{2}:\d{2}(:\d{2})?$/.test(str)) {
    // Aseguramos formato HH:MM:SS
    return str.length === 5 ? str + ":00" : str;
  }

  // Si viene como fecha completa, la tratamos como Date normal
  const normal = str.replace(" ", "T");
  const fecha = new Date(normal);
  if (isNaN(fecha)) return "-";

  return fecha.toLocaleTimeString("es-MX", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

