document.addEventListener("DOMContentLoaded", () => {
  cargarRegistros();
});

async function cargarRegistros() {
  try {
    const res = await fetch("http://localhost:3000/usuarios");
    const data = await res.json();
    console.log("Usuarios cargados:", data);

    const registrosBody = document.getElementById("registrosBody");
    if (!registrosBody) {
      console.error("❌ No se encontró la tabla con ID registrosBody");
      return;
    }

    registrosBody.innerHTML = "";

    data.forEach(usuario => {
      const tipo = usuario.ID_Tipo_Usuario === 2 ? "Alumno"
                  : usuario.ID_Tipo_Usuario === 3 ? "Empleado"
                  : usuario.ID_Tipo_Usuario === 4 ? "Temporal"
                  : usuario.ID_Tipo_Usuario === 5 ? "Visitante"
                  : "Otro";

      
    const infoAcademica = tipo === "Alumno" ? usuario.Licenciatura :
                      tipo === "Empleado" ? usuario.Area_Empleado : "-";

      const row = document.createElement("tr");
      
      row.innerHTML = `
        <td>${usuario.ID_Usuario}</td>
        <td>${usuario.Nombre_Completo}</td>
        <td>${usuario.Matricula || "-"}</td>
        <td>${tipo}</td>
        <td>${infoAcademica || "-"}</td>
        <td>${usuario.Placa || "-"}</td>
        <td>${usuario.Marca || "-"}</td>
        <td>${usuario.Color || "-"}</td>
        <td>
          <button class="btn-rojo-mini" onclick="eliminarUsuario(${usuario.ID_Usuario})">Eliminar</button>
          <button class="btn-azul-mini" onclick="editarUsuario(${usuario.ID_Usuario})">Editar</button>
        </td>
      `;
      registrosBody.appendChild(row);
    });
  } catch (error) {
    console.error("❌ Error al cargar registros:", error);
    alert("No se pudieron cargar los registros.");
  }
}

async function eliminarUsuario(id) {
  if (!confirm("¿Deseas eliminar este usuario?")) return;
  try {
  const res = await fetch(`http://localhost:3000/usuarios/${id}`, { method: "DELETE" });

  if (res.ok) {
    alert("✅ Usuario eliminado correctamente.");
    cargarRegistros();  // Recarga la tabla sin recargar toda la página
  } else {
    const errorRes = await res.json();
    console.error("❌ Error al eliminar usuario:", errorRes);
    alert("❌ Error al eliminar: " + (errorRes.error || "Verifica el servidor."));
  }
} catch (err) {
  console.error("❌ Error inesperado al eliminar usuario:", err);
  alert("❌ Error inesperado al eliminar.");
}
}

function editarUsuario(id) {
  window.location.href = `editar.html?id=${id}`;
}
