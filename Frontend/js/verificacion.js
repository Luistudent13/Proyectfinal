async function verificarPlaca() {
  const placa = (document.getElementById("placaVerificar").value || "")
    .trim()
    .toUpperCase();
  const resultado = document.getElementById("resultadoVerificacion");

  if (!placa) {
    resultado.innerText = "❌ Ingresa una placa válida.";
    resultado.style.color = "red";
    return;
  }

  try {
    // ✅ Consulta directa al backend usando ruta relativa
    const res = await fetch(`/vehiculos/placa/${placa}`);

    if (!res.ok) {
      resultado.innerText = "❌ Vehículo NO registrado.";
      resultado.style.color = "red";
      return;
    }

    const vehiculo = await res.json(); // { ID_Vehiculo, ID_Usuario, ... }

    // ✅ Registrar acceso (ruta relativa, sin IP)
    const resp = await fetch(`/accesos`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ID_Usuario: vehiculo.ID_Usuario,
        ID_Vehiculo: vehiculo.ID_Vehiculo,
      }),
    });

    const data = await resp.json().catch(() => ({}));

    if (resp.ok) {
      resultado.innerText = "✅ Acceso registrado correctamente.";
      resultado.style.color = "green";
    } else {
      resultado.innerText = `❌ ${data.mensaje || "Acceso denegado"}`;
      resultado.style.color = "red";
    }
  } catch (error) {
    console.error("Error al verificar placa:", error);
    resultado.innerText = "❌ Error de conexión con el servidor.";
    resultado.style.color = "red";
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
