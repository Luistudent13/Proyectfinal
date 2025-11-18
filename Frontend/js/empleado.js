requireAuth({ roles: ["ADMIN", "GUARDIA"] });

const form = document.getElementById("formEmpleado");
const nombre = document.getElementById("nombreEmpleado");
const apellidos = document.getElementById("apellidosEmpleado");
const area = document.getElementById("areaEmpleado");
const matricula = document.getElementById("matriculaEmpleado");
const placa = document.getElementById("placaEmpleado");
const color = document.getElementById("colorEmpleado");
const marca = document.getElementById("marcaEmpleado");

[nombre, apellidos, area, color, marca].forEach(bindOnlyLettersAccents);

// Matrícula de empleado: 3 dígitos
bindOnlyDigits(matricula, 3);

// Placa
bindPlateStrict(placa);
bindPlateMask(placa);

activarAutocompletadoMarcas(marca);

registerForm(form, async () => {
  if (!allRequiredFilled(form)) {
    throw new Error("Completa todos los campos.");
  }

  if (matricula.value.trim().length !== 3) {
    throw new Error("La matrícula del empleado debe tener 3 dígitos.");
  }

  if (!validarPlacaFormato(placa.value)) {
    throw new Error("Placa inválida. Usa el formato ABC-123-X.");
  }

  const idMarca = await getMarcaIdByName(marca.value.trim());
  if (!idMarca) {
    throw new Error("Marca inválida. Selecciona una marca de la lista.");
  }

  const body = {
    nombre_completo:
      `${nombre.value.trim()} ${apellidos.value.trim()}`.trim(),
    matricula: matricula.value.trim(),
    tipoUsuario: 3, // Empleado
    area_empleado: area.value.trim(),   // <- aquí el nombre correcto
    placa: placa.value.trim().toUpperCase(),
    color: color.value.trim(),
    idMarca,
  };

  await apiFetch("/usuarios", {
    method: "POST",
    body: JSON.stringify(body),
  });

  await swalSuccess("Empleado registrado correctamente.");
  location.href = "/screens/registros.html";
});
