document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("#formReporte");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const nombre = document.getElementById("nombre").value.trim();
    const tipo = document.getElementById("tipo").value.trim();  // CAMBIO AQUÍ
    const problema = document.getElementById("problema").value.trim(); // CAMBIO AQUÍ

    if (!nombre || !tipo || !problema) {
      alert("Por favor completa todos los campos.");
      return;
    }

    try {
      const res = await fetch("/reportes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre, tipo, problema })  // CAMBIO AQUÍ
      });

      if (res.ok) {
        alert("Reporte enviado correctamente.");
        form.reset();  // FIX: `form` en lugar de `this`
      } else {
        alert("Error al enviar reporte.");
      }
    } catch (err) {
      console.error("Error:", err);
      alert("Error en la conexión.");
    }
  });
});
