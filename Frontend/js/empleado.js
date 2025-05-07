document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("formEmpleado");
    const matriculaInput = document.getElementById("matriculaEmpleado");
    const placaInput = document.getElementById("placaEmpleado");
  
    // Autocompletado de marcas
    activarAutocompletadoMarcas("marcaEmpleado", "listaMarcasEmpleado");
  
    // Validación de matrícula (máx. 9 dígitos)
    matriculaInput.addEventListener("input", function () {
      if (!validarMatricula(this.value)) {
        this.setCustomValidity("Solo números. Máx. 9 dígitos.");
      } else {
        this.setCustomValidity("");
      }
    });
  
    // Formatear placa en tiempo real
    formatearPlacaAuto(placaInput);
  
    // Envío del formulario
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
  
      const nombre = document.getElementById("nombreEmpleado").value.trim();
      const apellidos = document.getElementById("apellidosEmpleado").value.trim();
      const matricula = matriculaInput.value.trim();
      const areaEmpleado = document.getElementById("areaEmpleado").value.trim();
      const placa = placaInput.value.trim();
      const color = document.getElementById("colorEmpleado").value.trim();
      const marcaTexto = document.getElementById("marcaEmpleado").value.trim();
  
      try {
        const resMarcas = await fetch("http://localhost:3000/marcas");
        const marcas = await resMarcas.json();
        const idMarca = obtenerIdMarca(marcaTexto, marcas);
  
        if (!idMarca) {
          alert("Marca inválida. Selecciona una de la lista.");
          return;
        }
  
        const datos = {
          nombre,
          apellidos,
          matricula,
          tipoUsuario: 3, // Empleado
          licenciatura: null,
          areaEmpleado,
          placa,
          color,
          marca: idMarca,
          personaRecoge: null,
          relacionEstudiante: null
        };
  
        const res = await fetch("http://localhost:3000/usuarios", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(datos),
        });
  
        if (res.ok) {
          alert("✅ Empleado registrado correctamente.");
          form.reset();
        } else {
          alert("❌ Error al registrar. Revisa los datos.");
        }
      } catch (error) {
        console.error("Error al registrar empleado:", error);
        alert("❌ Ocurrió un error al registrar.");
      }
    });
  });
  