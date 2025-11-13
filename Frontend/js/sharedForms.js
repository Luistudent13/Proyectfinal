// /js/sharedForms.js — Validaciones + Autocompletados + SweetAlert
console.log("✅ sharedForms.js cargado correctamente");

// ========================= MARCAS (API) =========================
let __cacheMarcas = null;

// Trae catálogo de marcas desde la API
async function getMarcas() {
  if (__cacheMarcas) return __cacheMarcas;
  const data = await apiFetch("/marcas");
  __cacheMarcas = Array.isArray(data) ? data : [];
  return __cacheMarcas;
}

// Normaliza texto (para comparar nombres de marca)
function __normText(s) {
  return (s || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // quitar acentos
    .replace(/[\s\.\-_/]+/g, "");    // quitar espacios y separadores
}

// Devuelve el ID de la marca a partir del nombre escrito
async function getMarcaIdByName(nombre) {
  const marcas = await getMarcas();
  const buscado = __normText(nombre);
  if (!buscado) return null;

  for (const m of marcas) {
    const nombreMarca =
      m.nombre ||
      m.Nombre_Marca ||
      m.Marca ||
      m.descripcion ||
      "";
    if (__normText(nombreMarca) === buscado) {
      return m.ID_Marca || m.id || m.Id_Marca || null;
    }
  }
  return null;
}

// Autocompletado de marcas con Awesomplete
async function activarAutocompletadoMarcas(input) {
  const el = typeof input === "string" ? document.getElementById(input) : input;
  if (!el) return;
  if (!window.Awesomplete) {
    console.warn("Awesomplete no está cargado, no se puede activar autocompletado de marcas.");
    return;
  }
  const marcas = await getMarcas();
  const lista = marcas
    .map(m => m.nombre || m.Nombre_Marca || m.Marca || m.descripcion || "")
    .filter(Boolean);

  new Awesomplete(el, {
    list: lista,
    minChars: 1,
    maxItems: 15,
    autoFirst: true
  });
}

// ==================== LICENCIATURAS (catálogo fijo) ====================

function activarAutocompletadoLicenciaturas(input) {
  const el = typeof input === "string" ? document.getElementById(input) : input;
  if (!el) return;
  if (!window.Awesomplete) {
    console.warn("Awesomplete no está cargado, no se puede activar autocompletado de licenciaturas.");
    return;
  }

  const licenciaturas = [
    "Arquitectura","Arquitectura de Interiores","Diseño Gráfico","Diseño Industrial",
    "Animación y Efectos Visuales","Cine y Producción Audiovisual","Comunicación y Medios",
    "Periodismo","Derecho","Criminología","Relaciones Internacionales",
    "Economía","Finanzas","Contaduría","Administración","Mercadotecnia",
    "Negocios Internacionales","Comercio y Aduanas","Emprendimiento","Gastronomía",
    "Nutrición","Enfermería","Médico Cirujano","Odontología","Psicología",
    "Pedagogía y Educación","Idiomas","Ingeniería en Sistemas Computacionales",
    "Ingeniería Industrial","Mecatrónica","Energías Renovables","Ingeniería Civil",
    "Redes y Telecomunicaciones","Ciencia de Datos","Actuaría",
    "Administración y Mercadotecnia (Maestría)","Finanzas (Maestría)","Impuestos (Maestría)",
    "Nutrición Clínica (Maestría)","Diseño Arquitectónico y Bioclimático (Maestría)",
    "Gestión Urbana y Medio Ambiente (Maestría)","Ingeniería Industrial (Maestría)",
    "Redes y Telecomunicaciones (Maestría)","Ciencia de Datos (Maestría)",
    "Administración y Gestión de Instituciones Educativas (Maestría)",
    "Derecho Constitucional y Amparo (Maestría)","Derecho Corporativo y Defensa Fiscal (Maestría)",
    "Litigación Penal y Derechos Humanos (Maestría)"
  ];

  new Awesomplete(el, {
    list: licenciaturas,
    minChars: 1,
    maxItems: 15,
    autoFirst: true
  });
}

// ========================= VALIDACIONES =========================

// Solo letras (con acentos) y espacios
function bindOnlyLettersAccents(el) {
  if (!el) return;
  el.addEventListener("input", () => {
    el.value = el.value
      .replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]/g, "")
      .replace(/\s{2,}/g, " ");
  });
}

// Solo dígitos, con longitud máxima
function bindOnlyDigits(el, maxLen) {
  if (!el) return;
  el.addEventListener("input", () => {
    el.value = el.value.replace(/\D/g, "");
    if (maxLen) el.value = el.value.slice(0, maxLen);
  });
}

// Placa: solo letras y números, se convierte a mayúsculas y se formatea XXX-XXX-X
function bindPlateStrict(el) {
  if (!el) return;
  el.addEventListener("input", () => {
    let s = el.value.replace(/[^a-zA-Z0-9]/g, "").toUpperCase();
    s = s.slice(0, 7); // 3 + 3 + 1

    if (s.length <= 3) {
      el.value = s;
    } else if (s.length <= 6) {
      el.value = `${s.slice(0, 3)}-${s.slice(3)}`;
    } else {
      el.value = `${s.slice(0, 3)}-${s.slice(3, 6)}-${s.slice(6)}`;
    }
  });
}

// Alias por compatibilidad
const bindPlateMask = bindPlateStrict;

// Validación de placa EXACTA: 3-3-1 caracteres alfanuméricos
function validarPlacaFormato(placa) {
  if (!placa) return false;
  const p = placa.toUpperCase().trim();
  // XXX-XXX-X con letras o números
  return /^[A-Z0-9]{3}-[A-Z0-9]{3}-[A-Z0-9]{1}$/.test(p);
}

// Verifica que todos los campos required de un form estén llenos
function allRequiredFilled(form) {
  if (!form) return false;
  const reqs = Array.from(form.querySelectorAll("[required]"));
  return reqs.every((i) => (i.value || "").trim() !== "");
}

// ========================= SWEETALERTS =========================

function swalSuccess(text) {
  return Swal.fire({
    icon: "success",
    title: "Listo",
    text: text || "Operación realizada correctamente",
    confirmButtonText: "OK"
  });
}

function swalError(text) {
  return Swal.fire({
    icon: "error",
    title: "Error",
    text: text || "Ocurrió un error",
    confirmButtonText: "Entendido"
  });
}

function swalInfo(text) {
  return Swal.fire({
    icon: "info",
    title: "Aviso",
    text: text || "",
    confirmButtonText: "OK"
  });
}

// ========================= EXPORTAR A window =========================

Object.assign(window, {
  getMarcas,
  getMarcaIdByName,
  activarAutocompletadoMarcas,
  activarAutocompletadoLicenciaturas,
  bindOnlyLettersAccents,
  bindOnlyDigits,
  bindPlateStrict,
  bindPlateMask,
  validarPlacaFormato,
  allRequiredFilled,
  swalSuccess,
  swalError,
  swalInfo
});
