document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("formSalida");
  const placaInput = document.getElementById("placaSalida");
  const mensajeSalida = document.getElementById("mensajeSalida");

  formatearPlacaAuto(placaInput);

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const placa = placaInput.value.trim();

    if (!placa) {
      alert("Por favor ingresa una placa.");
      return;
    }

    try {
      const res = await fetch("http://18.234.189.146:3000/accesos/salida", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ placa }),
      });

      const data = await res.json();

      if (res.ok) {
        alert("Salida registrada correctamente");
        placaInput.value = "";
      } else {
        alert(data.error || "Error al registrar salida");
      }
    } catch (error) {
      console.error(error);
      alert("Error de conexión con el servidor");
    }
  });
});

// Función para formatear placa: XXX-XXX-X
function formatearPlacaAuto(input) {
  input.addEventListener("input", function () {
    let valor = this.value.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 7);
    if (valor.length >= 3 && valor.length <= 6) {
      valor = valor.slice(0, 3) + "-" + valor.slice(3);
    } else if (valor.length === 7) {
      valor = valor.slice(0, 3) + "-" + valor.slice(3, 6) + "-" + valor.slice(6);
    }
    this.value = valor;
  });
}
