
document.addEventListener("DOMContentLoaded", async () => {
    try {
      const res = await fetch("http://localhost:3000/usuarios");
      const data = await res.json();
      console.log("Usuarios cargados:", data); // <- agrega esto
      const registrosBody = document.getElementById("registrosBody");
      registrosBody.innerHTML = "";
  
      data.forEach(usuario => {
        const tipo = usuario.ID_Tipo_Usuario === 2 ? "Alumno"
                    : usuario.ID_Tipo_Usuario === 3 ? "Empleado"
                    : usuario.ID_Tipo_Usuario === 4 ? "Temporal"
                    : usuario.ID_Tipo_Usuario === 5 ? "Visitante"
                    : "Otro";
  
        const row = `
          <tr>
            <td>${usuario.ID_Usuario}</td>
            <td>${usuario.Nombre_Completo}</td>
            <td>${usuario.Matricula || "-"}</td>
            <td>${tipo}</td>
            <td>${usuario.Licenciatura || "-"}</td>
            <td>${usuario.Placa || "-"}</td>
            <td>${usuario.Marca || "-"}</td>
            <td>${usuario.Color || "-"}</td>
            <td>
              <button class="btn-rojo-mini" onclick="eliminarUsuario(${usuario.ID_Usuario})">Eliminar</button>
              <button class="btn-azul-mini" onclick="editarUsuario(${usuario.ID_Usuario})">Editar</button>
            </td>
          </tr>
        `;
        registrosBody.insertAdjacentHTML("beforeend", row);
      });
    } catch (error) {
      alert("No se pudieron cargar los registros");
      console.error(error);
    }
  });
  
  async function eliminarUsuario(id) {
    if (!confirm("¿Deseas eliminar este usuario?")) return;
    try {
      const res = await fetch(`http://localhost:3000/usuarios/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (res.ok) {
        alert("Usuario eliminado correctamente");
        location.reload();
      } else {
        alert(data.error || "Error al eliminar");
      }
    } catch (err) {
      alert("Error al eliminar");
      console.error(err);
    }
  }
  
  function editarUsuario(id) {
    alert("Función de edición aún no implementada en esta vista.");
  }
  