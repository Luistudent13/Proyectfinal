// /js/reporte.js (NUEVO)
document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("#formReporte");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const nombre = document.getElementById("nombre").value.trim();
    const tipo = document.getElementById("tipo").value.trim();
    const problema = document.getElementById("problema").value.trim();

    if (!nombre || !tipo || !problema) {
      return swalInfo("Por favor completa todos los campos.");
    }

    try {
      await apiFetch("/reportes", {
        method: "POST",
        body: JSON.stringify({ nombre, tipo, problema })
      });

      await swalSuccess("Reporte enviado correctamente.");
      form.reset();
    } catch (err) {
      swalError(err.message || "Error al enviar el reporte.");
    }
  });
});
