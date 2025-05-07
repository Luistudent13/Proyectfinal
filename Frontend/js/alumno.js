document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("formAlumno");
    const matriculaInput = document.getElementById("matricula");
    const placaInput = document.getElementById("placa");
  
    // Activar autocompletado
    activarAutocompletadoMarcas("marca", "listaMarcas");
    activarAutocompletadoLicenciaturas("licenciatura", "listaLicenciaturas");
  
    // Validar matrícula
    matriculaInput.addEventListener("input", function () {
      if (!validarMatricula(this.value)) {
        this.setCustomValidity("Solo números. Máx. 9 dígitos.");
      } else {
        this.setCustomValidity("");
      }
    });
  
    // Formatear placa en tiempo real
    formatearPlacaAuto(placaInput);
  
    // Manejar envío del formulario
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
  
      const nombre = document.getElementById("nombre").value.trim();
      const apellidos = document.getElementById("apellidos").value.trim();
      const matricula = matriculaInput.value.trim();
      const licenciatura = document.getElementById("licenciatura").value.trim();
      const placa = placaInput.value.trim();
      const color = document.getElementById("color").value.trim();
      const marcaTexto = document.getElementById("marca").value.trim();
  
      try {
        // Obtener ID de marca
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
          tipoUsuario: 2, // Alumno
          licenciatura,
          placa,
          color,
          marca: idMarca,
          areaEmpleado: null,
          personaRecoge: null,
          relacionEstudiante: null
        };
  
        const res = await fetch("http://localhost:3000/usuarios", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(datos),
        });
  
        if (res.ok) {
          alert("✅ Alumno registrado correctamente.");
          form.reset();
        } else {
          alert("❌ Error al registrar. Revisa los datos.");
        }
      } catch (error) {
        console.error("Error al registrar alumno:", error);
        alert("❌ Ocurrió un error al registrar.");
      }
    });
  });
  