document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("formEmpleado");
    const matriculaInput = document.getElementById("matriculaEmpleado");    
    const placaInput = document.getElementById("placaEmpleado");
    const nombreEmpleadoInput = document.getElementById("nombreEmpleado");
    const apellidosEmpleadoInput = document.getElementById("apellidosEmpleado");
    const areaEmpleadoInput = document.getElementById("areaEmpleado");
    const colorInput = document.getElementById("colorEmpleado");
    const marcaInput = document.getElementById("marcaEmpleado");

areaEmpleadoInput.addEventListener("input", function () {
  this.value = this.value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, "");
});

colorInput.addEventListener("input", function () {
  this.value = this.value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, "");
});

marcaInput.addEventListener("input", function () {
  this.value = this.value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, "");
});


    matriculaInput.addEventListener("input", function () {
  this.value = this.value.replace(/\D/g, '').slice(0, 3);
});

nombreEmpleadoInput.addEventListener("input", function() {
  this.value = this.value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, "");
});

apellidosEmpleadoInput.addEventListener("input", function() {
  this.value = this.value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, "");
});

  // Autocompletado de marcas
  activarAutocompletadoMarcas("marcaEmpleado");
  
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
  
      const nombre = document.getElementById("nombreEmpleado").value.trim();
      const apellidos = document.getElementById("apellidosEmpleado").value.trim();
      const nombreCompleto = `${nombre} ${apellidos}`.trim();
      const matricula = matriculaInput.value.trim();
      const areaEmpleado = document.getElementById("areaEmpleado").value.trim();
      const placa = placaInput.value.trim();
      const color = document.getElementById("colorEmpleado").value.trim();
      const marcaTexto = document.getElementById("marcaEmpleado").value.trim();
  
      try {
        const resMarcas = await fetch("http://localhost:3000/marcas");
        const marcas = await resMarcas.json();
        const marcaObj = marcas.find(m => m.Marca.toLowerCase().trim() === marcaTexto.toLowerCase().trim());

    if (!marcaObj) {
    alert("Marca inválida. Selecciona una de la lista.");
    return;
      }

const idMarca = marcaObj.ID_Marca;
      console.log("Marca seleccionada:", marcaTexto);
      console.log("idMarca encontrado:", idMarca);
  
        const datos = {
    nombre_completo: nombreCompleto,
    matricula,
    tipoUsuario: 3,
    area_empleado: areaEmpleado,  // ✅ Correcto: la clave backend es area_empleado, pero el valor viene de areaEmpleado
    placa,
    color,
    idMarca: idMarca
        };


      console.log("Datos enviados:", datos);

  
        const res = await fetch("http://localhost:3000/usuarios", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(datos),
});

if (res.ok) {
  alert("✅ Empleado registrado correctamente.");
  form.reset();
} else {
  const errorRes = await res.json();
  alert("❌ Error al registrar. " + (errorRes.error || "Revisa los datos."));
}

      } catch (error) {
        console.error("Error al registrar empleado:", error);
        alert("❌ Ocurrió un error al registrar.");
      }
    });
  });
  