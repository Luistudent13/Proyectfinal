// Frontend/js/editar.js
const API = ""; // mismo origen

document.addEventListener("DOMContentLoaded", init);

async function init() {
  const params = new URLSearchParams(location.search);
  const id = params.get("id");
  if (!id) {
    alert("Falta el id del usuario a editar.");
    return;
  }

  // 1) Catálogo de marcas
  let marcas = [];
  try {
    const mr = await fetch(`${API}/marcas`);
    if (mr.ok) marcas = await mr.json();
  } catch {}
  const marcaSet = new Set(
    marcas.map(m => (m.Marca || m.marca || "").toLowerCase().trim())
  );

  // 2) Datos del usuario
  const res = await fetch(`${API}/usuarios/${id}`);
  if (!res.ok) {
    alert("No pude obtener los datos del usuario.");
    return;
  }
  const u = await res.json();

  // 3) Rellenar formulario
  const form = document.getElementById("formEditar");
  if (!form) return;

  // separa nombre/apellidos (últimos 2 como apellidos si existen)
  const partes = (u.Nombre_Completo || "").trim().split(/\s+/);
  const apellidos = partes.length > 1 ? partes.slice(-2).join(" ") : "";
  const nombre = partes.length > 1 ? partes.slice(0, -2).join(" ") : (u.Nombre_Completo || "");

  form.nombre.value = nombre;
  form.apellidos.value = apellidos;
  form.matricula.value = u.Matricula || "";
  form.licenciatura.value = u.Licenciatura || "";

  // ⬅️ usa el nombre correcto del campo
  if (form.areaEmpleado) form.areaEmpleado.value = u.Area_Empleado || "";
  else {
    const areaEl = document.getElementById("areaEmpleado");
    if (areaEl) areaEl.value = u.Area_Empleado || "";
  }

  // asigna primero lo que venga del GET /usuarios/:id
  form.placa.value = u.Placa || "";
  form.color.value = u.Color || "";
  form.marca.value = u.Marca || ""; // texto de marca

  // luego: fallback si faltó algo
  if (!form.placa.value || !form.color.value || !form.marca.value) {
    try {
      const vr = await fetch(`${API}/vehiculos`);
      if (vr.ok) {
        const vehiculos = await vr.json();
        const v = vehiculos.find(x => x.ID_Usuario === u.ID_Usuario);
        if (v) {
          if (!form.placa.value) form.placa.value = v.Placa || "";
          if (!form.color.value) form.color.value = v.Color || "";
          if (!form.marca.value) form.marca.value = v.Marca || "";
        }
      }
    } catch (e) {
      console.warn("Fallback /vehiculos falló:", e);
    }
  }

  // Mostrar/ocultar campos según tipo
  const esAlumno = u.ID_Tipo_Usuario === 2;
  const esEmpleado = u.ID_Tipo_Usuario === 3;
  toggle(document.getElementById("grupoLic"), esAlumno);
  toggle(document.getElementById("grupoArea"), esEmpleado);

  // 4) Guardar
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const nombre_completo = [form.nombre.value.trim(), form.apellidos.value.trim()]
      .filter(Boolean).join(" ");

    const marcaTexto = (form.marca.value || "").trim();

    const payload = {
      nombre_completo,
      matricula: form.matricula.value.trim(),
      licenciatura: esAlumno ? form.licenciatura.value.trim() : null,
      // ⬅️ usa areaEmpleado
      area_empleado: esEmpleado ? (form.areaEmpleado?.value || "").trim() : null,
      placa: form.placa.value.trim(),
      color: form.color.value.trim(),
      ...(marcaSet.has(marcaTexto.toLowerCase())
        ? { marca: marcaTexto }
        : { nuevaMarcaTexto: marcaTexto }),
    };

    try {
      const up = await fetch(`${API}/usuarios/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!up.ok) {
        const err = await up.json().catch(() => ({}));
        throw new Error(err.mensaje || `HTTP ${up.status}`);
      }
      alert("Cambios guardados correctamente.");
      location.href = "registros.html";
    } catch (err) {
      console.error("Error al actualizar:", err);
      alert("No se pudo actualizar: " + err.message);
    }
  });
}

function toggle(el, show) {
  if (!el) return;
  el.style.display = show ? "" : "none";
}
