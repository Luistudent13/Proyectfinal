const API_URL = "";

let usuariosGlobal = [];

  // 🔎 Mapeo de tipo de usuario a texto
const TIPO_MAP = { 2: "Alumno", 3: "Empleado", 4: "Visitante", 5: "Temporal" };
const tipoToText = (n) => TIPO_MAP[n] || `Desconocido (${n ?? "-"})`;

document.addEventListener("DOMContentLoaded", async () => {
  const inputMatricula = document.getElementById("matriculaBuscar");
  const inputPlaca = document.getElementById("placaBuscar");

  // 🔹 Formatear placa con guiones
  inputPlaca.addEventListener("input", () => formatearPlacaAuto(inputPlaca));

  // 🔹 Validar matrícula: solo números, máximo 9
  inputMatricula.addEventListener("input", () => {
    inputMatricula.value = inputMatricula.value.replace(/\D/g, '').slice(0, 9);
    if (inputMatricula.value !== "") inputPlaca.value = "";
  });

  // 🔹 Limpiar matrícula si escriben en placa
  inputPlaca.addEventListener("input", () => {
    if (inputPlaca.value.trim() !== "") inputMatricula.value = "";
  });

  // 🔹 Cargar usuarios y autocompletar
  try {
    const res = await fetch(`${API_URL}/usuarios`);
    usuariosGlobal = await res.json();

    const matriculas = usuariosGlobal.map(u => u.Matricula).filter(Boolean);
    const placas = usuariosGlobal.map(u => u.Placa).filter(Boolean);

    new Awesomplete(inputMatricula, { list: matriculas, minChars: 1, maxItems: 10, autoFirst: true });
    new Awesomplete(inputPlaca, { list: placas, minChars: 1, maxItems: 10, autoFirst: true });

  } catch (error) {
    console.error("Error al cargar usuarios:", error);
  }
});


document.getElementById("btnBuscar").addEventListener("click", () => {
  const matricula = document.getElementById("matriculaBuscar").value.trim();
  const placa = document.getElementById("placaBuscar").value.trim();
  const resultado = document.getElementById("resultadoBusqueda");

  if (matricula === "" && placa === "") {
    resultado.innerHTML = "<p style='color:red;'>Ingresa una matrícula o una placa.</p>";
    return;
  }

  const usuario = usuariosGlobal.find(u =>
    (matricula !== "" && u.Matricula && u.Matricula.toUpperCase() === matricula.toUpperCase()) ||
    (placa !== "" && u.Placa && u.Placa.toUpperCase() === placa.toUpperCase())
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

document.getElementById("btnCancelar").addEventListener("click", () => {
  window.location.href = "menu.html";
});
