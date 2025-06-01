document.addEventListener("DOMContentLoaded", () => {
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
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre, matricula, descripcion })
      });
      */
  
      mensajeDiv.innerHTML = `<p>✅ Reporte enviado con éxito. ¡Gracias por tu apoyo!</p>`;
      form.reset();
    });
  });
  