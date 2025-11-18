// /js/buscar.js — Búsqueda por matrícula o placa
let usuariosGlobal = [];

// 🔎 Mapeo de tipo de usuario a texto
const TIPO_MAP = { 2: "Alumno", 3: "Empleado", 4: "Visitante", 5: "Temporal" };
const tipoToText = (n) => TIPO_MAP[n] || `Desconocido (${n ?? "-"})`;

// Formatear placa tipo XXX-XXX-X
function formatearPlacaAuto(input) {
  if (!input) return;
  let s = input.value.replace(/[^a-zA-Z0-9]/g, "").toUpperCase();
  s = s.slice(0, 7); // 3 + 3 + 1

  if (s.length <= 3) {
    input.value = s;
  } else if (s.length <= 6) {
    input.value = `${s.slice(0, 3)}-${s.slice(3)}`;
  } else {
    input.value = `${s.slice(0, 3)}-${s.slice(3, 6)}-${s.slice(6)}`;
  }
}

document.addEventListener("DOMContentLoaded", async () => {
  // Solo ADMIN o GUARDIA pueden usar esta pantalla
  requireAuth({ roles: ["ADMIN", "GUARDIA"] });

  const inputMatricula = document.getElementById("matriculaBuscar");
  const inputPlaca = document.getElementById("placaBuscar");
  const resultado = document.getElementById("resultadoBusqueda");
  const btnBuscar = document.getElementById("btnBuscar");

  // 🔹 Formatear placa con guiones y limpiar matrícula si se escribe placa
  inputPlaca.addEventListener("input", () => {
    formatearPlacaAuto(inputPlaca);
    if (inputPlaca.value.trim() !== "") inputMatricula.value = "";
  });

  // 🔹 Validar matrícula: solo números, máximo 9; limpia placa si se escribe matrícula
  inputMatricula.addEventListener("input", () => {
    inputMatricula.value = inputMatricula.value.replace(/\D/g, "").slice(0, 9);
    if (inputMatricula.value !== "") inputPlaca.value = "";
  });

  // 🔹 Cargar usuarios desde la API protegida
  try {
    const data = await apiFetch("/usuarios");   // ← ahora va contra /api/usuarios con JWT
    usuariosGlobal = Array.isArray(data) ? data : [];

    const matriculas = usuariosGlobal.map((u) => u.Matricula).filter(Boolean);
    const placas = usuariosGlobal.map((u) => u.Placa).filter(Boolean);

    // Autocompletado (si la librería Awesomplete está cargada)
    if (window.Awesomplete) {
      new Awesomplete(inputMatricula, {
        list: matriculas,
        minChars: 1,
        maxItems: 10,
        autoFirst: true,
      });
      new Awesomplete(inputPlaca, {
        list: placas,
        minChars: 1,
        maxItems: 10,
        autoFirst: true,
      });
    }
  } catch (error) {
    console.error("Error al cargar usuarios:", error);
    if (resultado) {
      resultado.innerHTML = "<p style='color:red;'>No se pudieron cargar los usuarios.</p>";
    }
  }

  // 🔍 Buscar cuando dan clic
  btnBuscar.addEventListener("click", () => {
    const matricula = (inputMatricula.value || "").trim();
    const placa = (inputPlaca.value || "").trim().toUpperCase();

    if (matricula === "" && placa === "") {
      resultado.innerHTML = "<p style='color:red;'>Ingresa una matrícula o una placa.</p>";
      return;
    }

    const usuario = usuariosGlobal.find((u) =>
      (matricula !== "" &&
        u.Matricula &&
        String(u.Matricula).toUpperCase() === matricula.toUpperCase()) ||
      (placa !== "" &&
        u.Placa &&
        u.Placa.toUpperCase() === placa)
    );

    if (!usuario) {
      resultado.innerHTML = "<p style='color:red;'>Usuario no encontrado.</p>";
      return;
    }

    resultado.innerHTML = `
      <div class="tarjeta-resultado">
        <p><strong>Nombre:</strong> ${usuario.Nombre_Completo}</p>
        <p><strong>Matrícula:</strong> ${usuario.Matricula || "-"}</p>
        <p><strong>Tipo:</strong> ${tipoToText(usuario.ID_Tipo_Usuario)}</p>
        <p><strong>Licenciatura/Área:</strong> ${usuario.Licenciatura || usuario.Area_Empleado || "-"}</p>
        <p><strong>Placa:</strong> ${usuario.Placa || "-"}</p>
        <p><strong>Marca:</strong> ${usuario.Marca || "-"}</p>
        <p><strong>Color:</strong> ${usuario.Color || "-"}</p>
      </div>
    `;
  });
});

// Botón cancelar → regresa al menú
document.getElementById("btnCancelar").addEventListener("click", () => {
  window.location.href = "menu.html";
});
