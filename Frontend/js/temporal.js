document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("formTemporal");
    const placaInput = document.getElementById("placaTemporal");
  
    // Autocompletado de marcas
    activarAutocompletadoMarcas("marcaTemporal", "listaMarcasTemporal");
  
    // Formatear placa
    formatearPlacaAuto(placaInput);
  
    // Envío del formulario
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
  
      const nombre = document.getElementById("nombreTemporal").value.trim();
      const apellidos = document.getElementById("apellidosTemporal").value.trim();
      const personaRecoge = document.getElementById("personaRecoge").value.trim();
      const relacionEstudiante = document.getElementById("relacionEstudiante").value.trim();
      const placa = placaInput.value.trim();
      const color = document.getElementById("colorTemporal").value.trim();
      const marcaTexto = document.getElementById("marcaTemporal").value.trim();
  
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
          matricula: `TEMP-${Date.now()}`, // Genera un ID único temporal
          tipoUsuario: 6, // Visitante temporal
          licenciatura: null,
          areaEmpleado: null,
          personaRecoge,
          relacionEstudiante,
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
          alert("✅ Visitante temporal registrado.");
          form.reset();
        } else {
          alert("❌ Error al registrar visitante temporal.");
        }
      } catch (error) {
        console.error("Error:", error);
        alert("❌ Ocurrió un error al registrar.");
      }
    });
  });
  