// /js/reporte.js
document.addEventListener("DOMContentLoaded", () => {
  // Solo ADMIN o GUARDIA pueden enviar reportes
  if (typeof requireAuth === "function") {
    requireAuth({ roles: ["ADMIN", "GUARDIA"] });
  }

  const form = document.querySelector("#formReporte");
  if (!form) {
    console.error("❌ No se encontró el formulario #formReporte");
    return;
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const nombre = form.nombre.value.trim();
    const tipo = form.tipo.value;
    const problema = form.problema.value.trim();

    if (!nombre || !tipo || !problema) {
      if (typeof swalError === "function") {
        swalError("Completa todos los campos del reporte.");
      } else {
        alert("Completa todos los campos del reporte.");
      }
      return;
    }

    try {
      const body = { nombre, tipo, problema };

      // Llama al backend con JWT (apiFetch lo adjunta)
      await apiFetch("/reportes", {
        method: "POST",
        body: JSON.stringify(body),
      });

      if (typeof swalSuccess === "function") {
        await swalSuccess("Reporte enviado correctamente.");
      } else {
        alert("Reporte enviado correctamente.");
      }

      form.reset();
    } catch (err) {
      console.error("Error al enviar reporte:", err);
      if (typeof swalError === "function") {
        swalError(err.message || "Error al enviar el reporte.");
      } else {
        alert(err.message || "Error al enviar el reporte.");
      }
    }
  });
});


