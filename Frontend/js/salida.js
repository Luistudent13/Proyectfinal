// /js/salida.js — Registro de salida por placa
document.addEventListener("DOMContentLoaded", () => {
  // Solo ADMIN y GUARDIA
  requireAuth({ roles: ["ADMIN", "GUARDIA"] });

  const form = document.getElementById("formSalida");
  const inputPlaca = document.getElementById("placaSalida");
  const resultado = document.getElementById("resultadoSalida");

  if (!form || !inputPlaca) return;

  // Validaciones de placa
  bindPlateStrict(inputPlaca);
  bindPlateMask(inputPlaca);

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    let placa = (inputPlaca.value || "").trim().toUpperCase();

    if (!placa) {
      swalError("Ingresa la placa del vehículo.");
      return;
    }

    if (!validarPlacaFormato(placa)) {
      swalError("Placa inválida. Usa el formato ABC-123-X.");
      inputPlaca.value = "";
      inputPlaca.focus();
      return;
    }

    try {
      // Registrar salida por placa
      await apiFetch("/accesos/salida", {
        method: "POST",
        body: JSON.stringify({ placa }),
      });

      await swalSuccess("Salida registrada correctamente.");
      inputPlaca.value = "";
      inputPlaca.focus();
      if (resultado) resultado.textContent = "";
    } catch (err) {
      console.error(err);
      // Si no hay acceso activo o no se encontró la placa, el backend debería mandar 404/400 con mensaje
      swalError(err.message || "Error al registrar salida.");
    }
  });
});
