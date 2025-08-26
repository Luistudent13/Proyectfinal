document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("formSalida");
  const placaInput = document.getElementById("placaSalida");
  const resultadoSalida = document.getElementById("resultadoSalida");

  // Usa la utilidad global de shared.js
  formatearPlacaAuto(placaInput);

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const placa = (placaInput.value || "").trim().toUpperCase();

    if (!placa) {
      resultadoSalida.innerText = "❌ Por favor ingresa una placa.";
      resultadoSalida.style.color = "red";
      return;
    }

    try {
      const res = await fetch(`/accesos/salida`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ placa }),
      });

      const data = await res.json().catch(() => ({}));

      if (res.ok) {
        resultadoSalida.innerText = "✅ Salida registrada correctamente.";
        resultadoSalida.style.color = "green";
        placaInput.value = "";
      } else {
        resultadoSalida.innerText = `❌ ${data.mensaje || data.error || "Error al registrar salida"}`;
        resultadoSalida.style.color = "red";
      }
    } catch (error) {
      console.error(error);
      resultadoSalida.innerText = "❌ Error de conexión con el servidor.";
      resultadoSalida.style.color = "red";
    }
  });
});
