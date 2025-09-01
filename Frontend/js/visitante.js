document.addEventListener("DOMContentLoaded", () => {
  const API = ""; // mismo origen

  const form = document.getElementById("formVisitante");
  const placaInput = document.getElementById("placaVisitante");
  const nombreInput = document.getElementById("nombreVisitante");
  const apellidosInput = document.getElementById("apellidosVisitante");
  const eventoInput = document.getElementById("eventoAsiste");
  const horaIngresoInput = document.getElementById("horaIngreso");
  const horaSalidaInput  = document.getElementById("horaSalida");
  const colorInput = document.getElementById("colorVisitante");
  const marcaInput = document.getElementById("marcaVisitante");

  const soloLetras = /[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g;
  [nombreInput, apellidosInput, eventoInput, colorInput, marcaInput].forEach(inp => {
    if (inp) inp.addEventListener("input", function(){ this.value = this.value.replace(soloLetras, ""); });
  });

  activarAutocompletadoMarcas("marcaVisitante");
  placaInput.addEventListener("input", () => formatearPlacaAuto(placaInput));

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const nombre = (nombreInput.value || "").trim();
    const apellidos = (apellidosInput.value || "").trim();
    const evento = (eventoInput.value || "").trim();
    const horaIngreso = (horaIngresoInput.value || "").trim();  // HH:MM
    const horaSalida  = (horaSalidaInput.value  || "").trim();  // HH:MM
    const placa = (placaInput.value || "").trim().toUpperCase();
    const color = (colorInput.value || "").trim();
    const marcaTexto = (marcaInput.value || "").trim();

    if (!nombre || !apellidos || !evento || !horaIngreso || !placa || !marcaTexto) {
      alert("Completa nombre, apellidos, evento, hora de ingreso, placa y marca.");
      return;
    }

    const horario = horaSalida ? `${horaIngreso}-${horaSalida}` : horaIngreso;
    const nombreCompleto = `${nombre} ${apellidos}`.trim();

    try {
      // 1) Catálogo de marcas
      const resMarcas = await fetch(`${API}/marcas`);
      if (!resMarcas.ok) throw new Error(`HTTP ${resMarcas.status} en /marcas`);
      const marcas = await resMarcas.json();

      // buscar ID_Marca por texto (insensible a mayúsculas/espacios)
      const idMarca = (marcas.find(m =>
        (m.Marca || "").toLowerCase().trim() === marcaTexto.toLowerCase().trim()
      ) || {}).ID_Marca;

      if (!idMarca) {
        alert("Marca inválida. Selecciona una de la lista.");
        return;
      }

      // 2) Registrar visitante nuevo (tipo = 4)
      const body = {
  nombre_completo: nombreCompleto,
  tipoUsuario: 4,                 // Visitante nuevo
  evento_asiste: evento,
  hora_ingreso: horaIngreso,      // "HH:MM"
  hora_salida: horaSalida || null,
  placa, color, idMarca
};

      const res = await fetch(`${API}/usuarios`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const err = await res.json().catch(()=> ({}));
        throw new Error(err.message || `HTTP ${res.status}`);
      }

      alert("✅ Visitante registrado correctamente.");
      form.reset();
    } catch (err) {
      console.error("Error al registrar visitante:", err);
      alert("❌ No se pudo registrar el visitante.");
    }
  });
});
