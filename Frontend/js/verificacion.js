// /js/verificacion.js — Ingreso por placa
document.addEventListener("DOMContentLoaded", () => {
  // Solo ADMIN y GUARDIA
  requireAuth({ roles: ["ADMIN", "GUARDIA"] });

  const form = document.getElementById("formVerificacion");
  const inputPlaca = document.getElementById("placaVerificar");
  const resultado = document.getElementById("resultadoVerificacion");

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
      // 1) Buscar vehículo por placa
      const vehiculo = await apiFetch(`/vehiculos/placa/${encodeURIComponent(placa)}`);

      // Mostrar un pequeño resumen debajo (opcional)
      if (resultado) {
        resultado.textContent = `Vehículo de ${vehiculo.Nombre_Completo} (${vehiculo.Marca}${
          vehiculo.Color ? ", " + vehiculo.Color : ""
        })`;
      }

      // 2) Confirmar ingreso
      const ok = await Swal.fire({
        icon: "question",
        title: "Confirmar ingreso",
        text: `¿Registrar ingreso para ${vehiculo.Nombre_Completo}?`,
        showCancelButton: true,
        confirmButtonText: "Sí, registrar",
        cancelButtonText: "Cancelar",
      });

      if (!ok.isConfirmed) return;

      // 3) Registrar acceso (ingreso)
      await apiFetch("/accesos", {
        method: "POST",
        body: JSON.stringify({
          ID_Usuario: vehiculo.ID_Usuario,
          ID_Vehiculo: vehiculo.ID_Vehiculo,
        }),
      });

      await swalSuccess("Ingreso registrado correctamente.");
      inputPlaca.value = "";
      inputPlaca.focus();
      if (resultado) resultado.textContent = "";
    } catch (err) {
      console.error(err);
      swalError(err.message || "Error al registrar ingreso.");
    }
  });
});
