document.addEventListener("DOMContentLoaded", async () => {
  requireAuth({ roles: ["ADMIN", "GUARDIA"] });
  const tbodyArriba = document.getElementById("registrosBody");   // alumnos+empleados
  const tbodyAbajo = document.getElementById("tbodyVisitantes"); // visitantes+temporales

  try {
    const data = await apiFetch("/usuarios");

    const arriba = data.filter(u => u.ID_Tipo_Usuario === 2 || u.ID_Tipo_Usuario === 3);
    const abajo = data.filter(u => u.ID_Tipo_Usuario === 4 || u.ID_Tipo_Usuario === 5);

    const renderArriba = arriba.map(u => {
      const tipo = (u.ID_Tipo_Usuario === 2) ? "Alumno" : "Empleado";
      const licArea = u.ID_Tipo_Usuario === 2 ? (u.Licenciatura || "") : (u.Area_Empleado || "");
      return `
        <tr>
          <td>${u.ID_Usuario}</td>
          <td>${u.Nombre_Completo || ""}</td>
          <td>${u.Matricula || ""}</td>
          <td><span class="chip ${tipo === "Alumno" ? "chip-alumno" : "chip-empleado"}">${tipo}</span></td>
          <td>${licArea}</td>
          <td class="placa">${u.Placa || ""}</td>
          <td>${u.Marca || ""}</td>
          <td>${u.Color || ""}</td>
          <td class="acciones">
            <button class="btn-azul-mini" onclick="location.href='/screens/editar.html?id=${u.ID_Usuario}'">Editar</button>
            <button class="btn-rojo-mini" onclick="eliminarUsuario(${u.ID_Usuario})">Eliminar</button>
          </td>
        </tr>`;
    }).join("");

    const renderAbajo = abajo.map((u, i) => {
      const tipo = (u.ID_Tipo_Usuario === 4) ? "Visitante" : "Temporal";
      const evento = u.Evento_Asiste ? `${u.Evento_Asiste}` : "";
      const relacion = (u.Persona_Recoge || u.Relacion_Estudiante)
        ? `${u.Persona_Recoge || ""} / ${u.Relacion_Estudiante || ""}`
        : "";
      const horarioEvt = (u.Horario || u.Hora_Salida)
        ? `(${u.Horario || ""}${u.Hora_Salida ? " - " + u.Hora_Salida : ""})`
        : "";

      const tipoClass = tipo === "Visitante" ? "chip-visitante" : "chip-temporal";

      return `
        <tr>
          <td>${i + 1}</td>
          <td>${u.Nombre_Completo || ""}</td>
          <td><span class="chip ${tipoClass}">${tipo}</span></td>
          <td class="placa">${u.Placa || ""}</td>
          <td>${u.Marca || ""}</td>
          <td>${u.Color || ""}</td>
          <td>${evento} ${horarioEvt}</td>
          <td>${relacion}</td>
          <td>${u.Fecha_Registro || ""}</td>
          <td class="acciones">
            <button class="btn-azul-mini" onclick="location.href='/screens/editar.html?id=${u.ID_Usuario}'">Editar</button>
            <button class="btn-rojo-mini" onclick="eliminarUsuario(${u.ID_Usuario})">Eliminar</button>
          </td>
        </tr>`;
    }).join("");

    tbodyArriba.innerHTML = renderArriba || `<tr><td colspan="9">Sin alumnos/empleados.</td></tr>`;
    tbodyAbajo.innerHTML = renderAbajo || `<tr><td colspan="10">Sin visitantes/temporales.</td></tr>`;
  } catch (err) {
    console.error(err);
    swalError(err.message || "No fue posible cargar los registros.");
  }
});

async function eliminarUsuario(id) {
  const ok = await Swal.fire({
    icon: "warning",
    title: "Eliminar",
    text: "¿Deseas eliminar este usuario?",
    showCancelButton: true,
    confirmButtonText: "Sí, eliminar",
    cancelButtonText: "Cancelar"
  });
  if (!ok.isConfirmed) return;
  try {
    await apiFetch(`/usuarios/${id}`, { method: "DELETE" });
    await swalSuccess("Eliminado correctamente.");
    location.reload();
  } catch (err) {
    swalError(err.message || "No se pudo eliminar.");
  }
}
