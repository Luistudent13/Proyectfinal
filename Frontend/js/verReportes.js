document.addEventListener("DOMContentLoaded", async () => {
   // Solo ADMIN puede ver esta pantalla
  requireAuth({ roles: ["ADMIN"] });
  const tbody = document.querySelector("#tablaReportes tbody");

  try {
    const reportes = await apiFetch("/reportes");
    reportes.forEach((r) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${r.ID}</td>
        <td>${r.Nombre}</td>
        <td>${r.Tipo_Usuario}</td>
        <td>${r.Problema}</td>
        <td>${new Date(r.Fecha).toLocaleString()}</td>
      `;
      tbody.appendChild(tr);
    });
  } catch (err) {
    console.error(err);
    if (typeof swalError === "function") {
      swalError(err.message || "No se pudieron cargar los reportes.");
    }
  }
});
