document.addEventListener("DOMContentLoaded", () => {
 const form = document.getElementById("formTemporal");
  const placaInput = document.getElementById("placaTemporal");

  const nombreInput = document.getElementById("nombreTemporal");
  const apellidosInput = document.getElementById("apellidosTemporal");
  const personaRecogeInput = document.getElementById("personaRecoge");
  const relacionInput = document.getElementById("relacionEstudiante");
  const colorInput = document.getElementById("colorTemporal");
  const marcaInput = document.getElementById("marcaTemporal");

  // Validaciones
  permitirSoloTextoConAcentos(nombreInput);
  permitirSoloTextoConAcentos(apellidosInput);
  permitirSoloTextoConAcentos(personaRecogeInput);
  permitirSoloTextoConAcentos(relacionInput);
  permitirSoloTextoConAcentos(colorInput);
  permitirSoloTextoConAcentos(marcaInput);
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
        const resMarcas = await fetch("http://18.234.189.146:3000/marcas");
        const marcas = await resMarcas.json();
        const idMarca = obtenerIdMarca(marcaTexto, marcas);
  
        if (!idMarca) {
          alert("Marca inválida. Selecciona una de la lista.");
          return;
        }
  
        const nombreCompleto = `${nombre} ${apellidos}`;

        const datos = {
          nombre_completo: nombreCompleto,
          matricula: `TEMP-${Date.now()}`,
          tipoUsuario: 5,
          licenciatura: null,
          area_empleado: null,
          persona_recoge: personaRecoge,
          relacion_estudiante: relacionEstudiante,
        placa,
        color,
        idMarca: idMarca
          };

  
        const res = await fetch("http://18.234.189.146:3000/usuarios", {
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
  