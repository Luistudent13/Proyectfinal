// /js/temporal.js
document.addEventListener("DOMContentLoaded", () => {
  requireAuth({ roles: ["ADMIN", "GUARDIA"] });

  const form = document.getElementById("formTemporal");
  if (!form) return;

  const nombre = document.getElementById("nombreTemporal");
  const apellidos = document.getElementById("apellidosTemporal");
  const recoge = document.getElementById("personaRecoge");
  const relacion = document.getElementById("relacionEstudiante");
  const placa = document.getElementById("placaTemporal");
  const color = document.getElementById("colorTemporal");
  const marca = document.getElementById("marcaTemporal");

  [nombre, apellidos, recoge, relacion, color, marca].forEach(bindOnlyLettersAccents);
  bindPlateStrict(placa); bindPlateMask(placa);

  activarAutocompletadoMarcas(marca);

  registerForm(form, async () => {
    if (!allRequiredFilled(form)) throw new Error("Completa todos los campos.");
    if (!validarPlacaFormato(placa.value)) throw new Error("Placa inválida. Usa ABC-123-X.");

    const idMarca = await getMarcaIdByName(marca.value.trim());
    if (!idMarca) throw new Error("Marca inválida. Selecciona de la lista.");

    const body = {
      nombre_completo: `${nombre.value.trim()} ${apellidos.value.trim()}`.trim(),
      tipoUsuario: 5, // Temporal
      persona_recoge: recoge.value.trim(),
      relacion_estudiante: relacion.value.trim(),
      placa: placa.value.trim().toUpperCase(),
      color: color.value.trim(),
      idMarca
    };

    await apiFetch("/usuarios", {
      method: "POST",
      body: JSON.stringify(body)
    });

    await swalSuccess("Visitante temporal registrado.");
    // Ir a la tabla de registros
    location.href = "/screens/registros.html";
  });
});
