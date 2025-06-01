document.addEventListener("DOMContentLoaded", () => {
  cargarHistorial();
});

async function cargarHistorial() {
  try {
    const res = await fetch("http://44.204.181.158:3000/accesos");
    const accesos = await res.json();

    const tbody = document.querySelector("#tablaHistorial tbody");
    tbody.innerHTML = "";

    accesos.forEach(acceso => {
  const fila = document.createElement("tr");
  fila.innerHTML = `
    <td>${acceso.Nombre_Completo}</td>
    <td>${acceso.Placa}</td>
    <td>${formatearFecha(acceso.Fecha_Acceso)}</td>
    <td>${formatearFecha(acceso.Hora_Entrada)}</td>
    <td>${acceso.Hora_Salida ? formatearFecha(acceso.Hora_Salida) : "-"}</td>
  `;
  tbody.appendChild(fila);
});

  } catch (error) {
    console.error("Error al cargar historial:", error);
  }
}

function formatearFecha(fechaISO) {
    if (!fechaISO) return "-";

    const fecha = new Date(fechaISO);

    const opcionesFecha = { year: 'numeric', month: '2-digit', day: '2-digit' };
    const opcionesHora = { hour: '2-digit', minute: '2-digit', second: '2-digit' };

    const fechaFormateada = fecha.toLocaleDateString('es-MX', opcionesFecha);
    const horaFormateada = fecha.toLocaleTimeString('es-MX', opcionesHora);

    return `${fechaFormateada} ${horaFormateada}`;

  

}
