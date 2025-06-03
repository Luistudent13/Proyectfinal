document.addEventListener("DOMContentLoaded", async () => {
  const tabla = document.querySelector("#tablaReportes tbody");

  try {
    const res = await fetch("/reportes");      // ✅ Esto sí funciona
    const reportes = await res.json();

    reportes.forEach((reporte) => {
      const fila = document.createElement("tr");
      fila.innerHTML = `
        <td>${reporte.ID}</td>
        <td>${reporte.Nombre}</td>
        <td>${reporte.Tipo_Usuario}</td>
        <td>${reporte.Problema}</td>
        <td>${new Date(reporte.Fecha).toLocaleString()}</td>
      `;
      tabla.appendChild(fila);
    });
  } catch (err) {
    console.error("Error al cargar reportes:", err);
  }
});
