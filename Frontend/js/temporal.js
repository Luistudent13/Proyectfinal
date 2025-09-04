// /Frontend/js/temporal.js
// Funciones de validación y formateo (autónomas por si no cargas shared.js)
(function () {
  const ACCENTS = 'áéíóúÁÉÍÓÚñÑüÜ';
  const reOnlyLetters = new RegExp(`^[a-zA-Z ${ACCENTS}]*$`);
  const reLettersSpaces = new RegExp(`[^a-zA-Z ${ACCENTS}]`, 'g');
  const rePlateChars = /[^A-Za-z0-9]/g;

  // Devuelve texto solo con letras, espacios y acentos
  function sanitizeLetters(str) {
    return (str || '').replace(reLettersSpaces, '');
  }

  // En placa: MAYÚSCULAS, solo alfanumérico y enmascarado ABC-123-X
  function formatPlate(value) {
    let v = (value || '').toUpperCase().replace(rePlateChars, '');
    // Cortamos a 7 (3 + 3 + 1)
    v = v.slice(0, 7);
    // Insertamos guiones: 3-3-1
    let out = '';
    for (let i = 0; i < v.length; i++) {
      out += v[i];
      if (i === 2 || i === 5) out += '-';
    }
    // Si termina en guion, lo quitamos
    if (out.endsWith('-')) out = out.slice(0, -1);
    return out;
  }

  // Expone helpers en window (sin sobreescribir si ya existen)
  window.__onlyLetters = window.__onlyLetters || sanitizeLetters;
  window.__formatPlate = window.__formatPlate || formatPlate;
})();

document.addEventListener('DOMContentLoaded', () => {
  const API = ''; // mismo origen

  // Elementos
  const form = document.getElementById('formTemporal');
  const nombre = document.getElementById('nombreTemporal');
  const apellidos = document.getElementById('apellidosTemporal');
  const personaRecoge = document.getElementById('personaRecoge');
  const relacion = document.getElementById('relacionEstudiante');
  const placa = document.getElementById('placaTemporal');
  const color = document.getElementById('colorTemporal');
  const marca = document.getElementById('marcaTemporal');

  const submitBtn = form.querySelector('button[type="submit"]');

  // --- Restricciones de entrada ---

  // Solo letras/espacios/acentos
  [nombre, apellidos, personaRecoge, relacion, color, marca].forEach((el) => {
    if (!el) return;
    el.addEventListener('input', () => {
      const caret = el.selectionStart;
      const sane = window.__onlyLetters(el.value);
      if (el.value !== sane) {
        el.value = sane;
        // reponer cursor aproximado
        el.setSelectionRange(caret - 1, caret - 1);
      }
    });
  });

  // Placa: mayúsculas + alfanumérico + máscara ABC-123-X
  placa.addEventListener('input', () => {
    const caret = placa.selectionStart;
    const formatted = window.__formatPlate(placa.value);
    placa.value = formatted;
    // intentamos mantener el cursor
    placa.setSelectionRange(formatted.length, formatted.length);
  });
  placa.addEventListener('blur', () => {
    placa.value = window.__formatPlate(placa.value);
  });

  // --- Autocompletado de marcas ---
  // (sin librerías externas: lista desplegable simple)
  let marcasCache = [];
  const datalistId = 'listaMarcasTemporal';
  let datalist = document.getElementById(datalistId);
  if (!datalist) {
    datalist = document.createElement('datalist');
    datalist.id = datalistId;
    document.body.appendChild(datalist);
  }
  marca.setAttribute('list', datalistId);

  async function cargarMarcas() {
    try {
      const r = await fetch(`${API}/marcas`);
      if (!r.ok) throw new Error('No se pudo cargar /marcas');
      marcasCache = await r.json(); // [{ID_Marca, Marca}, ...]
      datalist.innerHTML = marcasCache
        .map((m) => `<option value="${m.Marca}"></option>`)
        .join('');
    } catch (e) {
      console.error(e);
    }
  }
  cargarMarcas();

  // --- Envío del formulario ---
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Validaciones mínimas
    if (!nombre.value.trim() || !apellidos.value.trim()) {
      return alert('Completa nombre y apellidos.');
    }
    if (!personaRecoge.value.trim() || !relacion.value.trim()) {
      return alert('Indica a quién recoge y la relación.');
    }
    if (!placa.value.trim()) {
      return alert('Indica la placa.');
    }
    if (!marca.value.trim()) {
      return alert('Selecciona la marca.');
    }

    // Resuelve idMarca por nombre exacto (ignora mayúsculas/minúsculas)
    const idMarca =
      (marcasCache.find(
        (m) => (m.Marca || '').toLowerCase().trim() === marca.value.toLowerCase().trim()
      ) || {}).ID_Marca || null;

    if (!idMarca) {
      return alert('Marca inválida. Elige una de la lista.');
    }

    // Cuerpo para el backend
    const body = {
      nombre_completo: `${nombre.value} ${apellidos.value}`.trim(),
      tipoUsuario: 5, // Temporal
      persona_recoge: personaRecoge.value.trim(),
      relacion_estudiante: relacion.value.trim(),
      placa: placa.value.toUpperCase().trim(),
      color: color.value.trim(),
      idMarca,
    };

    // Envío
    try {
      submitBtn.disabled = true;
      submitBtn.textContent = 'Registrando...';

      const res = await fetch(`${API}/usuarios`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || err.message || `HTTP ${res.status}`);
      }

      alert('✅ Visitante temporal registrado.');
      form.reset();
    } catch (err) {
      console.error(err);
      alert('❌ Error: ' + err.message);
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Registrar entrada';
    }
  });
});
