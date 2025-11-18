let accesosOriginales = [];

document.addEventListener("DOMContentLoaded", () => {
  cargarHistorial();

  const btnFiltrar = document.getElementById("btnFiltrarFecha");
  const btnTodos = document.getElementById("btnMostrarTodos");
  const inputFecha = document.getElementById("filtroFecha");

  if (btnFiltrar && inputFecha) {
    btnFiltrar.addEventListener("click", () => {
      const valor = inputFecha.value;
      if (!valor) {
        Swal.fire("Filtro por fecha", "Selecciona primero una fecha.", "info");
        return;
      }
      aplicarFiltroPorFecha(valor);
    });
  }

  if (btnTodos) {
    btnTodos.addEventListener("click", () => {
      pintarTabla(accesosOriginales);
      if (inputFecha) {
        inputFecha.value = "";
      }
    });
  }
});

async function cargarHistorial() {
  try {
    const accesos = await apiFetch("/accesos");
    accesosOriginales = Array.isArray(accesos) ? accesos : [];
    pintarTabla(accesosOriginales);
  } catch (err) {
    console.error(err);
    alert(err.message || "Error al cargar historial.");
  }
}

function pintarTabla(lista) {
  const tbody = document.getElementById("tablaHistorialBody");
  if (!tbody) return;

  tbody.innerHTML = "";

  lista.forEach((acceso) => {
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
}

function aplicarFiltroPorFecha(fechaSeleccionada) {
  if (!accesosOriginales || accesosOriginales.length === 0) return;

  const filtrados = accesosOriginales.filter((acceso) => {
    const clave = obtenerFechaYYYYMMDD(
      acceso.Fecha_Acceso || acceso.Fecha_Registro
    );
    return clave === fechaSeleccionada;
  });

  pintarTabla(filtrados);
}

function obtenerFechaYYYYMMDD(fecha) {
  if (!fecha) return null;
  const str = String(fecha).trim();

  // Formatos "2025-11-18", "2025-11-18T00:00:00.000Z", "2025-11-18 00:00:00"
  // Solo se toman los primeros 10 caracteres YYYY-MM-DD
  if (str.length >= 10) {
    return str.slice(0, 10);
  }
  return null;
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
    // Asegura formato HH:MM:SS
    return str.length === 5 ? str + ":00" : str;
  }

  // Si viene como fecha completa, se trata como Date normal
  const normal = str.replace(" ", "T");
  const fecha = new Date(normal);
  if (isNaN(fecha)) return "-";

  return fecha.toLocaleTimeString("es-MX", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}
