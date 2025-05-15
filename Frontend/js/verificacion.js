const API_URL = "http://localhost:3000";

// ✅ Verificar placa
async function verificarPlaca() {
  const placa = document.getElementById("placaVerificar").value.trim().toUpperCase();
  const resultado = document.getElementById("resultadoVerificacion");

  if (!placa) {
    resultado.innerText = "❌ Ingresa una placa válida.";
    resultado.style.color = "red";
    return;
  }

  try {
    const res = await fetch(`${API_URL}/vehiculos`);
    const vehiculos = await res.json();

    const encontrado = vehiculos.find(v => v.Placa.toUpperCase() === placa);

    if (encontrado) {
      resultado.innerText = "✅ Acceso permitido.";
      resultado.style.color = "green";

      await fetch(`${API_URL}/accesos`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
    ID_Usuario: encontrado.ID_Usuario,
    ID_Vehiculo: encontrado.ID_Vehiculo
    })
      });

    } else {
      resultado.innerText = "❌ Vehículo NO registrado.";
      resultado.style.color = "red";
    }

  } catch (error) {
    console.error("Error al verificar placa:", error);
  }
}

// ✅ Cancelar verificación
function cancelarVerificacion() {
  const menuPage = document.getElementById("menuPage");
  const verificacionPage = document.getElementById("verificacionPage");

  if (menuPage && verificacionPage) {
    verificacionPage.style.display = "none";
    menuPage.style.display = "block";
  } else {
    window.location.href = "../screens/menu.html";
  }

  const inputPlaca = document.getElementById("placaVerificar");
  const resultado = document.getElementById("resultadoVerificacion");

  if (inputPlaca) inputPlaca.value = "";
  if (resultado) resultado.innerText = "";
}

// ✅ Formateo de placa al escribir
document.addEventListener("DOMContentLoaded", () => {
  const placaInput = document.getElementById("placaVerificar");

  if (placaInput) {
    placaInput.addEventListener("input", () => formatearPlacaAuto(placaInput));
  }
});
