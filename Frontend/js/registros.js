// Frontend/js/registros.js

const API = ""; // mismo origen donde corre tu Express (http://localhost:3000)

document.addEventListener("DOMContentLoaded", () => {
  cargarRegistros();
});

async function cargarRegistros() {
  try {
    // Traemos usuarios, vehiculos y marcas en paralelo
    const [usuariosRes, vehiculosRes, marcasRes] = await Promise.all([
      fetch(`${API}/usuarios`),
      fetch(`${API}/vehiculos`),
      fetch(`${API}/marcas`)
    ]);

    if (!usuariosRes.ok) throw new Error(`HTTP ${usuariosRes.status} en /usuarios`);
    if (!vehiculosRes.ok) throw new Error(`HTTP ${vehiculosRes.status} en /vehiculos`);
    if (!marcasRes.ok) throw new Error(`HTTP ${marcasRes.status} en /marcas`);

    const [usuarios, vehiculos, marcas] = await Promise.all([
      usuariosRes.json(),
      vehiculosRes.json(),
      marcasRes.json()
    ]);

    // Dejar solo Alumno (2) y Empleado (3)
const usuariosPrincipales = usuarios.filter(
  u => u.ID_Tipo_Usuario === 2 || u.ID_Tipo_Usuario === 3
);

    // Mapas auxiliares
    // - Un vehiculo por usuario (si hay varios, tomamos el primero)
    const vehiculoPorUsuario = new Map();
    for (const v of vehiculos) {
      if (!vehiculoPorUsuario.has(v.ID_Usuario)) {
        vehiculoPorUsuario.set(v.ID_Usuario, v);
      }
    }

    // - Marca por ID_Marca
    const marcaPorId = new Map();
    for (const m of marcas) {
      // admite propiedades comunes como ID_Marca y Marca
      marcaPorId.set(m.ID_Marca, m.Marca || m.nombre || m.marca);
    }

    const tbody = document.getElementById("registrosBody");
    if (!tbody) {
      console.error("❌ No se encontró el elemento <tbody id='registrosBody'>");
      return;
    }
    tbody.innerHTML = "";

    usuariosPrincipales.forEach(u => {
      const tipo =
        u.ID_Tipo_Usuario === 2 ? "Alumno"   :
        u.ID_Tipo_Usuario === 3 ? "Empleado" :
        u.ID_Tipo_Usuario === 4 ? "Temporal" :
        u.ID_Tipo_Usuario === 5 ? "Visitante": "Otro";

      const infoAcademica =
        tipo === "Alumno"  ? (u.Licenciatura || "-") :
        tipo === "Empleado"? (u.Area_Empleado || "-") : "-";

      const v = vehiculoPorUsuario.get(u.ID_Usuario) || {};
      const placa = v.Placa || "-";
      const color = v.Color || "-";
      const marca = v.ID_Marca ? (marcaPorId.get(v.ID_Marca) || "-") : "-";

      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${u.ID_Usuario}</td>
        <td>${u.Nombre_Completo}</td>
        <td>${u.Matricula || "-"}</td>
        <td>${tipo}</td>
        <td>${infoAcademica}</td>
        <td>${placa}</td>
        <td>${marca}</td>
        <td>${color}</td>
        <td>
          <button class="btn-rojo-mini" onclick="eliminarUsuario(${u.ID_Usuario})">Eliminar</button>
          <button class="btn-azul-mini" onclick="editarUsuario(${u.ID_Usuario})">Editar</button>
        </td>
      `;
      tbody.appendChild(tr);
    });

    console.log("✅ Registros renderizados:", usuariosPrincipales.length);
  } catch (err) {
    console.error("❌ Error al cargar registros:", err);
    alert("No se pudieron cargar los registros. Revisa que el servidor esté corriendo.");
  }
}

async function eliminarUsuario(id) {
  if (!confirm("¿Deseas eliminar este usuario?")) return;
  try {
    const res = await fetch(`${API}/usuarios/${id}`, { method: "DELETE" });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || `HTTP ${res.status}`);
    }
    alert("✅ Usuario eliminado correctamente.");
    cargarRegistros();
  } catch (err) {
    console.error("❌ Error al eliminar usuario:", err);
    alert("❌ Error al eliminar: " + err.message);
  }
}

function editarUsuario(id) {
  // navega a la pantalla de edición (ajusta la ruta si es necesario)
  window.location.href = `editar.html?id=${id}`;
}
