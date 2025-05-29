document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("formVisitante");
  const matriculaInput = document.getElementById("matriculaVisitante");
  const placaInput = document.getElementById("placaVisitante");
  const nombreInput = document.getElementById("nombreVisitante");
  const apellidosInput = document.getElementById("apellidosVisitante");
  const eventoInput = document.getElementById("eventoAsiste");
  const colorInput = document.getElementById("colorVisitante");
  const marcaInput = document.getElementById("marcaVisitante");

  const soloLetrasConAcentosRegex = /[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g;

eventoInput.addEventListener("input", function () {
  this.value = this.value.replace(soloLetrasConAcentosRegex, "");
});

colorInput.addEventListener("input", function () {
  this.value = this.value.replace(soloLetrasConAcentosRegex, "");
});

marcaInput.addEventListener("input", function () {
  this.value = this.value.replace(soloLetrasConAcentosRegex, "");
});

  

  const soloLetrasRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]*$/;

  nombreInput.addEventListener("input", function() {
    this.value = this.value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, "");
  });

  apellidosInput.addEventListener("input", function() {
    this.value = this.value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, "");
  });

// Autocompletado de marcas
activarAutocompletadoMarcas("marcaVisitante");
placaInput.addEventListener("input", () => {
  formatearPlacaAuto(placaInput);
});


    // Envío del formulario
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
  
      const nombre = document.getElementById("nombreVisitante").value.trim();
    const apellidos = document.getElementById("apellidosVisitante").value.trim();
    const evento = document.getElementById("eventoAsiste").value.trim();
    const horaIngreso = document.getElementById("horaIngreso").value;
    const horaSalida = document.getElementById("horaSalida").value;
    const placa = document.getElementById("placaVisitante").value.trim();
    const color = document.getElementById("colorVisitante").value.trim();
    const marcaTexto = document.getElementById("marcaVisitante").value.trim();
  
    const nombreCompleto = `${nombre} ${apellidos}`;

      try {
        const resMarcas = await fetch("http://18.234.189.146:3000/marcas");
        const marcas = await resMarcas.json();
        const idMarca = obtenerIdMarca(marcaTexto, marcas);
  
        if (!idMarca) {
          alert("Marca inválida. Selecciona una de la lista.");
          return;
        }
  
        const datos = {
  nombre_completo: nombreCompleto,
  matricula: null,
  tipoUsuario: 5,
  licenciatura: null,
  area_empleado: null,
  persona_recoge: null,
  relacion_estudiante: null,
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