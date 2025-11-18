// /js/visitante.js
document.addEventListener("DOMContentLoaded", () => {
  requireAuth({ roles: ["ADMIN", "GUARDIA"] });

  const form = document.getElementById("formVisitante");
  if (!form) return;

  const nombre = document.getElementById("nombreVisitante");
  const apellidos = document.getElementById("apellidosVisitante");
  const eventoAsiste = document.getElementById("eventoAsiste");
  const horaIngreso = document.getElementById("horaIngreso");
  const horaSalida = document.getElementById("horaSalida");
  const placa = document.getElementById("placaVisitante");
  const color = document.getElementById("colorVisitante");
  const marca = document.getElementById("marcaVisitante");

  [nombre, apellidos, eventoAsiste, color, marca].forEach(bindOnlyLettersAccents);
  bindPlateStrict(placa); bindPlateMask(placa);

  activarAutocompletadoMarcas(marca);

  registerForm(form, async () => {
    if (!allRequiredFilled(form)) throw new Error("Completa todos los campos.");
    if (!validarPlacaFormato(placa.value)) throw new Error("Placa inválida. Usa ABC-123-X.");

    const idMarca = await getMarcaIdByName(marca.value.trim());
    if (!idMarca) throw new Error("Marca inválida. Selecciona de la lista.");

    const body = {
      nombre_completo: `${nombre.value.trim()} ${apellidos.value.trim()}`.trim(),
      tipoUsuario: 4, // Visitante
      evento_asiste: eventoAsiste.value.trim(),
      hora_ingreso: horaIngreso.value.trim(),
      hora_salida: horaSalida.value.trim(),
      placa: placa.value.trim().toUpperCase(),
      color: color.value.trim(),
      idMarca
    };

    await apiFetch("/usuarios", {
      method: "POST",
      body: JSON.stringify(body)
    });

    await swalSuccess("Visitante registrado correctamente.");
    // Ir a la tabla de registros
    location.href = "/screens/registros.html";

  });
});
