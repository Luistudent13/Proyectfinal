document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("#formReporte");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const nombre = document.getElementById("nombre").value.trim();
    const tipo = document.getElementById("tipo").value.trim();
    const problema = document.getElementById("problema").value.trim();

    if (!nombre || !tipo || !problema) {
      alert("Por favor completa todos los campos.");
      return;
    }

    try {
      const res = await fetch("/reportes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre, tipo, problema })
      });

      if (res.ok) {
        alert("✅ Reporte enviado correctamente.");
        form.reset();
      } else {
        alert("❌ Error al enviar el reporte.");
      }
    } catch (err) {
      console.error("Error:", err);
      alert("❌ Error en la conexión.");
    }
  });
});
