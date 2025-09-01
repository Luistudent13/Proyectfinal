document.addEventListener("DOMContentLoaded", () => {
  const API = ""; // mismo origen (http://localhost:3000)

  const form = document.getElementById("formEmpleado");
  const matriculaInput = document.getElementById("matriculaEmpleado");
  const placaInput = document.getElementById("placaEmpleado");
  const nombreEmpleadoInput = document.getElementById("nombreEmpleado");
  const apellidosEmpleadoInput = document.getElementById("apellidosEmpleado");
  const areaEmpleadoInput = document.getElementById("areaEmpleado");
  const colorInput = document.getElementById("colorEmpleado");
  const marcaInput = document.getElementById("marcaEmpleado");

  // Solo letras (con acentos)
  areaEmpleadoInput.addEventListener("input", function () {
    this.value = this.value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, "");
  });
  colorInput.addEventListener("input", function () {
    this.value = this.value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, "");
  });
  marcaInput.addEventListener("input", function () {
    this.value = this.value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, "");
  });
  nombreEmpleadoInput.addEventListener("input", function() {
    this.value = this.value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, "");
  });
  apellidosEmpleadoInput.addEventListener("input", function() {
    this.value = this.value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, "");
  });

  // Matrícula empleado: 3 dígitos exactos
  matriculaInput.addEventListener("input", function () {
    this.value = this.value.replace(/\D/g, '').slice(0, 3);
  });

  // Autocompletado de marcas (usa /marcas mismo origen)
  activarAutocompletadoMarcas("marcaEmpleado");

  // Formato de placa: XXX-XXX-X / hasta 9 chars por si lo necesitas
  placaInput.addEventListener("input", function () {
    let valor = this.value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 9);
    if (valor.length <= 3) {
      this.value = valor;
    } else if (valor.length <= 6) {
      this.value = valor.slice(0, 3) + '-' + valor.slice(3);
    } else {
      this.value = valor.slice(0, 3) + '-' + valor.slice(3, 6) + '-' + valor.slice(6);
    }
  });

  // Envío del formulario
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const nombre = nombreEmpleadoInput.value.trim();
    const apellidos = apellidosEmpleadoInput.value.trim();
    const nombreCompleto = `${nombre} ${apellidos}`.trim();
    const matricula = matriculaInput.value.trim();
    const areaEmpleado = areaEmpleadoInput.value.trim();
    const placa = placaInput.value.trim();
    const color = colorInput.value.trim();
    const marcaTexto = marcaInput.value.trim();

    if (matricula.length !== 3) {
      alert("La matrícula de empleado debe tener exactamente 3 dígitos.");
      matriculaInput.focus();
      return;
    }

    try {
      // Trae catálogo de marcas (mismo origen)
      const resMarcas = await fetch(`${API}/marcas`);
      if (!resMarcas.ok) throw new Error(`HTTP ${resMarcas.status} en /marcas`);
      const marcas = await resMarcas.json();

      const marcaObj = marcas.find(
        m => (m.Marca || "").toLowerCase().trim() === marcaTexto.toLowerCase().trim()
      );
      if (!marcaObj) {
        alert("Marca inválida. Selecciona una de la lista.");
        return;
      }

      const datos = {
        nombre_completo: nombreCompleto,
        matricula,
        tipoUsuario: 3,
        area_empleado: areaEmpleado,
        placa,
        color,
        idMarca: marcaObj.ID_Marca
      };

      const res = await fetch(`${API}/usuarios`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(datos),
      });

      if (res.ok) {
        alert("✅ Empleado registrado correctamente.");
        form.reset();
      } else {
        const errorRes = await res.json().catch(() => ({}));
        alert("❌ Error al registrar. " + (errorRes.error || "Revisa los datos."));
      }
    } catch (error) {
      console.error("Error al registrar empleado:", error);
      alert("❌ Ocurrió un error al registrar.");
    }
  });
});