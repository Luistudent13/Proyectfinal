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
  <td>${formatearSoloFecha(acceso.Fecha_Acceso)}</td>
  <td>${formatearSoloHora(acceso.Hora_Entrada)}</td>
  <td>${acceso.Hora_Salida ? formatearSoloHora(acceso.Hora_Salida) : "-"}</td>
`;
  tbody.appendChild(fila);
});

const ocupados = accesos.filter(acceso => !acceso.Hora_Salida).length;
const disponibles = 90 - ocupados;

document.getElementById("contadorLugares").textContent =
  `Quedan ${disponibles} lugares disponibles`;

  } catch (error) {
    console.error("Error al cargar historial:", error);
  }
}

function formatearSoloFecha(fechaISO) {
  if (!fechaISO) return "-";
  const fecha = new Date(fechaISO);
  return fecha.toLocaleDateString('es-MX', { year: 'numeric', month: '2-digit', day: '2-digit' });
}

function formatearSoloHora(fechaISO) {
  if (!fechaISO) return "-";
  const fecha = new Date(fechaISO);
  return fecha.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
}
