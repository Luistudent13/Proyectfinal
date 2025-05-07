document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("formBuscarUsuario");
    const resultadoDiv = document.getElementById("resultadoUsuario");
  
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const matricula = document.getElementById("matriculaBusqueda").value.trim();
  
      try {
        const res = await fetch(`http://localhost:3000/usuarios/matricula/${matricula}`);
        const data = await res.json();
  
        if (!res.ok || !data || !data.Nombre) {
          resultadoDiv.innerHTML = "<p>⚠️ Usuario no encontrado.</p>";
          return;
        }
  
        resultadoDiv.innerHTML = `
          <div class="resultado-usuario">
            <p><strong>Nombre:</strong> ${data.Nombre} ${data.Apellidos}</p>
            <p><strong>Matrícula / ID:</strong> ${data.Matricula}</p>
            <p><strong>Placa:</strong> ${data.Placa || "No registrada"}</p>
            <p><strong>Color:</strong> ${data.Color || "No registrado"}</p>
            <p><strong>ID Marca:</strong> ${data.ID_Marca || "No registrada"}</p>
          </div>
        `;
      } catch (error) {
        console.error("Error al buscar usuario:", error);
        resultadoDiv.innerHTML = "<p>❌ Error al buscar usuario. Intenta más tarde.</p>";
      }
    });
  });
  