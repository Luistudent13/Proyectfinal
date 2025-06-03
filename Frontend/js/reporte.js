document.addEventListener("DOMContentLoaded", () => {
<<<<<<< HEAD
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
=======
    const form = document.getElementById("formReporte");
    const mensajeDiv = document.getElementById("mensajeEnvioReporte");
  
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
  
      const nombre = document.getElementById("nombreReporte").value.trim();
      const matricula = document.getElementById("matriculaReporte").value.trim();
      const descripcion = document.getElementById("descripcionReporte").value.trim();
  
      if (!nombre || !matricula || !descripcion) {
        mensajeDiv.innerHTML = "<p>⚠️ Por favor llena todos los campos.</p>";
        return;
      }
  
      // Si más adelante decides guardar en base de datos, aquí va el fetch:
      /*
      await fetch("http://44.204.181.158:3000/reportes", {
>>>>>>> 5ef37afaf63b23a00942b2e65b7c6f92216b3fe2
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
