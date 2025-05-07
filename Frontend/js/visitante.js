document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("formVisitante");
    const matriculaInput = document.getElementById("matriculaVisitante");
    const placaInput = document.getElementById("placaVisitante");
  
    // Autocompletado de marcas
    activarAutocompletadoMarcas("marcaVisitante", "listaMarcasVisitante");
  
    // Validación de matrícula (opcional si usas ID visita)
    matriculaInput.addEventListener("input", function () {
      if (!validarMatricula(this.value)) {
        this.setCustomValidity("Solo números. Máx. 9 dígitos.");
      } else {
        this.setCustomValidity("");
      }
    });
  
    // Formatear placa
    formatearPlacaAuto(placaInput);
  
    // Envío del formulario
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
  
      const nombre = document.getElementById("nombreVisitante").value.trim();
      const apellidos = document.getElementById("apellidosVisitante").value.trim();
      const matricula = matriculaInput.value.trim(); // Puede ser ID de visita
      const placa = placaInput.value.trim();
      const color = document.getElementById("colorVisitante").value.trim();
      const marcaTexto = document.getElementById("marcaVisitante").value.trim();
  
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
          tipoUsuario: 5, // Visitante
          licenciatura: null,
          areaEmpleado: null,
          personaRecoge: null,
          relacionEstudiante: null,
          placa,
          color,
          marca: idMarca
        };
  
        const res = await fetch("http://localhost:3000/usuarios", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(datos),
        });
  
        if (res.ok) {
          alert("✅ Visitante registrado correctamente.");
          form.reset();
        } else {
          alert("❌ Error al registrar visitante.");
        }
      } catch (error) {
        console.error("Error:", error);
        alert("❌ Ocurrió un error al registrar.");
      }
    });
  });
  