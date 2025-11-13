requireAuth({ roles: ["ADMIN", "GUARDIA"] });

const form = document.getElementById("formAlumno");
const nombre = document.getElementById("nombre");
const apellidos = document.getElementById("apellidos");
const lic = document.getElementById("licenciatura");
const matricula = document.getElementById("matricula");
const placa = document.getElementById("placaAlumno");
const color = document.getElementById("color");
const marca = document.getElementById("marca");

[nombre, apellidos, lic, color, marca].forEach(bindOnlyLettersAccents);

// Matrícula de alumno: 9 dígitos
bindOnlyDigits(matricula, 9);

// Placa con máscara AAA-123-X, automayúsculas
bindPlateStrict(placa);
bindPlateMask(placa);

// Aquí tus autocompletados si ya los tienes:
activarAutocompletadoLicenciaturas(lic);
activarAutocompletadoMarcas(marca);

registerForm(form, async () => {
  if (!allRequiredFilled(form)) {
    throw new Error("Completa todos los campos.");
  }

  if (matricula.value.trim().length !== 9) {
    throw new Error("La matrícula del alumno debe tener 9 dígitos.");
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
    tipoUsuario: 2, // Alumno
    licenciatura: lic.value.trim(),
    placa: placa.value.trim().toUpperCase(),
    color: color.value.trim(),
    idMarca,
  };

  await apiFetch("/usuarios", {
    method: "POST",
    body: JSON.stringify(body),
  });

  await swalSuccess("Alumno registrado correctamente.");
  location.href = "/screens/registros.html";
});
