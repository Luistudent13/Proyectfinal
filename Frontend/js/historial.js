document.addEventListener("DOMContentLoaded", () => {
  cargarHistorial();
});

async function cargarHistorial() {
  try {
    const res = await fetch("http://localhost:3000/accesos");
    const accesos = await res.json();

    const tbody = document.querySelector("#tablaHistorial tbody");
    tbody.innerHTML = "";

    accesos.forEach(acceso => {
  const fila = document.createElement("tr");
  fila.innerHTML = `
    <td>${acceso.Nombre_Completo}</td>
    <td>${acceso.Placa}</td>
    <td>${acceso.Fecha_Acceso}</td>
    <td>${acceso.Hora_Entrada}</td>
    <td>${acceso.Hora_Salida || "-"}</td>
  `;
  tbody.appendChild(fila);
});

  } catch (error) {
    console.error("Error al cargar historial:", error);
  }
}
