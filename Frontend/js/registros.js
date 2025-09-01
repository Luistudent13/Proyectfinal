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
        u.ID_Tipo_Usuario === 2 ? "Alumno" :
          u.ID_Tipo_Usuario === 3 ? "Empleado" :
            u.ID_Tipo_Usuario === 4 ? "Temporal" :
              u.ID_Tipo_Usuario === 5 ? "Visitante" : "Otro";

      const infoAcademica =
        tipo === "Alumno" ? (u.Licenciatura || "-") :
          tipo === "Empleado" ? (u.Area_Empleado || "-") : "-";

      const v = vehiculoPorUsuario.get(u.ID_Usuario) || {};
      const placa = v.Placa || "-";
      const color = v.Color || "-";
      const marca = v.ID_Marca ? (marcaPorId.get(v.ID_Marca) || "-") : "-";

      const tr = document.createElement("tr");
const tipoChipClass = tipo === "Alumno" ? "chip chip-alumno" : "chip chip-empleado";

tr.innerHTML = `
  <td data-label="ID">${u.ID_Usuario}</td>
  <td data-label="Nombre">${u.Nombre_Completo}</td>
  <td data-label="Matrícula"><span class="pill">${u.Matricula || "-"}</span></td>
  <td data-label="Tipo"><span class="${tipoChipClass}">${tipo}</span></td>
  <td data-label="Licenciatura o Área">${infoAcademica}</td>
  <td data-label="Placa"><span class="placa">${placa}</span></td>
  <td data-label="Marca">${marca}</td>
  <td data-label="Color"><span class="pill">${color}</span></td>
  <td data-label="Acciones">
    <div class="acciones">
      <button class="btn-azul-mini" onclick="editarUsuario(${u.ID_Usuario})">Editar</button>
      <button class="btn-rojo-mini" onclick="eliminarUsuario(${u.ID_Usuario})">Eliminar</button>
    </div>
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


// === Cargar y renderizar Visitantes (Nuevo + Temporal) ===
// Llama a esto después de que cargues la tabla principal.
document.addEventListener('DOMContentLoaded', () => {
  cargarVisitantes();
});

async function cargarVisitantes() {
  try {
    const API = typeof API_URL !== 'undefined' ? API_URL : "";
    const res = await fetch(`${API}/usuarios/visitantes`); // ya llega filtrado 4 y 5
    if (!res.ok) throw new Error(`HTTP ${res.status} en /usuarios/visitantes`);
    const visitantes = await res.json();
    renderTablaVisitantes(visitantes || []);
  } catch (err) {
    console.error('Error cargando visitantes:', err);
    const tbody = document.getElementById('tbodyVisitantes');
    if (tbody) {
      tbody.innerHTML = `<tr><td colspan="10" class="txt-center color-error">No se pudo cargar la lista de visitantes.</td></tr>`;
    }
  }
}

function renderTablaVisitantes(lista) {
  const tbody = document.getElementById('tbodyVisitantes');
  if (!tbody) return;

  if (!lista.length) {
    tbody.innerHTML = `<tr><td colspan="10" class="txt-center">Sin visitantes registrados.</td></tr>`;
    return;
  }

  const filas = lista.map((u, i) => {
    const tipoNum = Number(u.ID_Tipo_Usuario);
    const tipo    = tipoNum === 5 ? 'Temporal' : 'Visitante';
    const placa   = first(u.Placa, u.placa, '-');
    const marca   = first(u.Marca, u.marca, '-');
    const color   = first(u.Color, u.color, '-');
    const fecha   = (u.Fecha_Registro || u.fecha_registro || '').toString().slice(0, 10);

    // Evento (Horario) para Visitante nuevo
    const hIn  = first(u.Horario, u.horario, '');
    const hOut = first(u.Hora_Salida, u.hora_salida, '');
    const horarioTxt = hIn ? (hOut ? `${hIn}-${hOut}` : hIn) : '';
    const evento = first(u.Evento_Asiste, u.evento_asiste, '');

    const colEvento = (tipo === 'Visitante')
      ? (`${escapeHTML(evento)}${evento && horarioTxt ? ' ' : ''}${horarioTxt ? `(${escapeHTML(horarioTxt)})` : ''}` || '—')
      : '—';

    // Persona / Relación para Temporal
    const persona  = first(u.Persona_Recoge, u.persona_recoge, '');
    const relacion = first(u.Relacion_Estudiante, u.relacion_estudiante, '');
    const colRecoge = (tipo === 'Temporal')
      ? (`${escapeHTML(persona)}${persona && relacion ? ' / ' : ''}${escapeHTML(relacion)}` || '—')
      : '—';

    const chipClass = tipo === 'Temporal' ? 'chip chip-temporal' : 'chip chip-visitante';

    return `
      <tr>
        <td data-label="#">${i + 1}</td>
        <td data-label="Nombre completo">${escapeHTML(first(u.Nombre_Completo, u.nombre_completo, ''))}</td>
        <td data-label="Tipo"><span class="${chipClass}">${tipo}</span></td>
        <td data-label="Placa"><span class="placa">${escapeHTML(placa)}</span></td>
        <td data-label="Marca">${escapeHTML(marca)}</td>
        <td data-label="Color"><span class="pill">${escapeHTML(color)}</span></td>
        <td data-label="Evento (Horario)">${colEvento}</td>
        <td data-label="Persona recoge / Relación">${colRecoge}</td>
        <td data-label="Fecha registro">${fecha}</td>
        <td data-label="Acciones">
          <div class="acciones">
            <button class="btn-azul-mini btn-editar" data-id="${u.ID_Usuario}">Editar</button>
            <button class="btn-rojo-mini btn-eliminar" data-id="${u.ID_Usuario}">Eliminar</button>
          </div>
        </td>
      </tr>
    `;
  }).join('');

  tbody.innerHTML = filas;

  // Acciones
  tbody.querySelectorAll('.btn-editar').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const id = e.currentTarget.dataset.id;
      if (typeof editarUsuario === 'function') editarUsuario(id);
    });
  });

  tbody.querySelectorAll('.btn-eliminar').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      const id = e.currentTarget.dataset.id;
      if (typeof eliminarUsuario === 'function') {
        await eliminarUsuario(id);
        cargarVisitantes();
      } else {
        const API = typeof API_URL !== 'undefined' ? API_URL : "";
        await fetch(`${API}/usuarios/${id}`, { method: 'DELETE' });
        cargarVisitantes();
      }
    });
  });
}


// helpers
function first(...vals) {
  for (const v of vals) if (v !== undefined && v !== null && String(v).trim() !== '') return v;
  return '';
}
function escapeHTML(s='') {
  return String(s)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}
function normalizeHorario(h='') {
  // Acepta "09:00-11:00", "9:00 - 11:00" o una sola hora "09:00"
  if (!h) return '';
  const t = h.replace(/\s/g, '');
  if (/^\d{1,2}:\d{2}-\d{1,2}:\d{2}$/.test(t)) return t;        // ya viene en rango
  if (/^\d{1,2}:\d{2}$/.test(t)) return t;                      // una sola hora
  return h;                                                     // deja tal cual si es otro formato
}
