// /js/editar.js
document.addEventListener("DOMContentLoaded", async () => {
  requireAuth({ roles: ["ADMIN", "GUARDIA"] });

  const params = new URLSearchParams(location.search);
  const id = params.get("id");
  if (!id) return swalError("Falta el id de usuario.");

  const form = document.getElementById("formEditar");
  const nombre = document.getElementById("nombre");
  const apellidos = document.getElementById("apellidos");
  const matricula = document.getElementById("matricula");
  const lic = document.getElementById("licenciatura");
  const area = document.getElementById("areaEmpleado");
  const placa = document.getElementById("placaEditar");
  const color = document.getElementById("color");
  const marca = document.getElementById("marca");
  const grpLic = document.getElementById("grupoLic");
  const grpArea = document.getElementById("grupoArea");

  [nombre, apellidos, color, marca].forEach(bindOnlyLettersAccents);
  bindPlateStrict(placa); bindPlateMask(placa);

  activarAutocompletadoMarcas(marca);
  activarAutocompletadoLicenciaturas(lic);

  // Cargar datos
  const u = await apiFetch(`/usuarios/${id}`);
  if (!u || !u.ID_Usuario) return swalError("Usuario no encontrado.");

  const isAlumno = u.ID_Tipo_Usuario === 2;
  const isEmpleado = u.ID_Tipo_Usuario === 3;

  // Visibilidad de grupos
  grpLic.style.display = isAlumno ? "" : "none";
  grpArea.style.display = isEmpleado ? "" : "none";

  // Binds según tipo
  if (isAlumno) {
    bindOnlyDigits(matricula, 9);
  } else if (isEmpleado) {
    bindOnlyDigits(matricula, 3);
    bindOnlyLettersAccents(area);
  }

  // Set valores base
  const nombreCompleto = (u.Nombre_Completo || "").trim();

  if (nombreCompleto) {
    const partes = nombreCompleto.split(/\s+/);

    if (partes.length === 1) {
      // Solo una palabra: la dejamos como nombre
      nombre.value = partes[0];
      apellidos.value = "";
    } else {
      // Última palabra = apellidos, resto = nombre
      apellidos.value = partes.pop();
      nombre.value = partes.join(" ");
    }
  } else {
    nombre.value = "";
    apellidos.value = "";
  }

  matricula.value = u.Matricula || "";
  lic.value = u.Licenciatura || "";
  area.value = u.Area_Empleado || "";
  placa.value = u.Placa || "";
  color.value = u.Color || "";
  marca.value = u.Marca || "";


  registerForm(form, async () => {
    if (!allRequiredFilled(form)) throw new Error("Completa todos los campos.");
    if (isAlumno && matricula.value.trim().length !== 9) throw new Error("Matrícula de alumno: 9 dígitos.");
    if (isEmpleado && matricula.value.trim().length !== 3) throw new Error("Matrícula de empleado: 3 dígitos.");
    if (!validarPlacaFormato(placa.value)) throw new Error("Placa inválida. Usa ABC-123-X.");

    const idMarca = await getMarcaIdByName(marca.value.trim());
    if (!idMarca) throw new Error("Marca inválida. Selecciona de la lista.");

    const payload = {
      nombre_completo: `${(nombre.value || "").trim()} ${(apellidos.value || "").trim()}`.trim(),
      matricula: (matricula.value || "").trim(),
      licenciatura: isAlumno ? (lic.value || "").trim() : null,
      area_empleado: isEmpleado ? (area.value || "").trim() : null,
      placa: (placa.value || "").trim().toUpperCase(),
      color: (color.value || "").trim(),
      idMarca
    };

    await apiFetch(`/usuarios/${id}`, { method: "PUT", body: JSON.stringify(payload) });
    await swalSuccess("Cambios guardados.");
    location.href = "/screens/registros.html";
  });
});
