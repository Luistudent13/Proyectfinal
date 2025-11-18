// /js/shared.js — Core (auth + api + helpers básicos)

// ===== AUTH =====
function getToken() { return localStorage.getItem("token"); }
function getRol() { return localStorage.getItem("rol"); }

function cerrarSesion() {
  localStorage.removeItem("token");
  localStorage.removeItem("rol");
  window.location.href = "/screens/login.html";
}

// Modal (opcional): botones "Sí/No"
function mostrarModalCerrarSesion() {
  Swal.fire({
    icon: "question", title: "Cerrar sesión",
    text: "¿Deseas salir de tu cuenta?",
    showCancelButton: true, confirmButtonText: "Sí", cancelButtonText: "No"
  }).then(r => { if (r.isConfirmed) cerrarSesion(); });
}
function ocultarModalCerrarSesion() { /* noop (controlado por Swal) */ }

// ===== GUARD =====
function requireAuth({ roles = [] } = {}) {
  const token = getToken();
  const rol = getRol();
  if (!token) { window.location.href = "/screens/login.html"; return; }
  if (Array.isArray(roles) && roles.length > 0 && (!rol || !roles.includes(rol))) {
    Swal.fire({ icon: "error", title: "Sin permiso", text: "No tienes acceso a esta vista." })
      .then(() => window.location.href = "/screens/menu.html");
  }
}

// ===== API FETCH (adjunta JWT y maneja errores) =====
async function apiFetch(path, opts = {}) {
  const base = "/api";
  const url = path.startsWith("http") ? path : `${base}${path.startsWith("/") ? "" : "/"}${path}`;
  const token = getToken();
  const headers = Object.assign(
    { "Content-Type": "application/json" },
    (opts.headers || {}),
    (token ? { "Authorization": `Bearer ${token}` } : {})
  );
  const res = await fetch(url, { ...opts, headers });
  if (res.status === 401) {
    cerrarSesion(); // token inválido/expirado
    throw new Error("Sesión expirada.");
  }
  let data = null;
  const ct = res.headers.get("content-type") || "";
  if (ct.includes("application/json")) data = await res.json();
  else data = await res.text();
  if (!res.ok) {
    const msg = (data && (data.mensaje || data.message || data.error)) || `Error HTTP ${res.status}`;
    throw new Error(msg);
  }
  return data;
}

// ===== VALIDACIONES BÁSICAS (mínimas; las fuertes van en sharedForms.js) =====
function validarNoVacio(v) { return (v || "").trim() !== ""; }

// Placa básica (ABC-123 o ABC-123-X, guiones opcionales al escribir)
function validarPlacaFormato(placa) {
  const p = (placa || "").toUpperCase().trim();
  return /^[A-Z0-9]{3}-?[0-9]{3}(-?[A-Z0-9])?$/.test(p);
}

// Wrapper genérico para formularios
function registerForm(form, onSubmit) {
  if (!form || form.dataset.bound) return;
  form.dataset.bound = "1";
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    try {
      await onSubmit();
    } catch (err) {
      console.error(err);
      Swal.fire({ icon: "error", title: "Error", text: err.message || "Operación no completada." });
    }
  });
}

// Exponer en window
window.getToken = window.getToken || getToken;
window.getRol = window.getRol || getRol;
window.cerrarSesion = window.cerrarSesion || cerrarSesion;
window.mostrarModalCerrarSesion = window.mostrarModalCerrarSesion || mostrarModalCerrarSesion;
window.ocultarModalCerrarSesion = window.ocultarModalCerrarSesion || ocultarModalCerrarSesion;
window.requireAuth = window.requireAuth || requireAuth;
window.apiFetch = window.apiFetch || apiFetch;
window.validarNoVacio = window.validarNoVacio || validarNoVacio;
window.validarPlacaFormato = window.validarPlacaFormato || validarPlacaFormato;
window.registerForm = window.registerForm || registerForm;

console.log("✅ shared.js cargado");
