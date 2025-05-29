document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("formAlumno");
  const matriculaInput = document.getElementById("matricula");
  const placaInput = document.getElementById("placa");
  const nombreInput = document.getElementById("nombre");
  const apellidosInput = document.getElementById("apellidos");
  const soloLetrasRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]*$/;
  const licenciaturaInput = document.getElementById("licenciatura");
  const colorInput = document.getElementById("color");
  const marcaInput = document.getElementById("marca");

licenciaturaInput.addEventListener("input", function () {
  this.value = this.value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, "");
});

colorInput.addEventListener("input", function () {
  this.value = this.value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, "");
});

marcaInput.addEventListener("input", function () {
  this.value = this.value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, "");
});


  nombreInput.addEventListener("input", function() {
    this.value = this.value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, "");
  });

  apellidosInput.addEventListener("input", function() {
    this.value = this.value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, "");
  });


  activarAutocompletadoMarcas("marca");
  activarAutocompletadoLicenciaturas("licenciatura");


    matriculaInput.addEventListener("input", function () {
    this.value = this.value.replace(/\D/g, '').slice(0, 9);
  });
    placaInput.addEventListener("input", function () {
  let valor = this.value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 7);

  // Formato: XXX-XXX-X
  if (valor.length <= 3) {
    this.value = valor;
  } else if (valor.length <= 6) {
    this.value = valor.slice(0, 3) + '-' + valor.slice(3);
  } else {
    this.value = valor.slice(0, 3) + '-' + valor.slice(3, 6) + '-' + valor.slice(6);
  }
})


  formatearPlacaAuto(placaInput);

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    // ✅ Capturar datos
     const nombre_completo = document.getElementById("nombre").value.trim();
  const matricula = document.getElementById("matricula").value.trim();
  const licenciatura = document.getElementById("licenciatura").value.trim();
  const placa = document.getElementById("placa").value.trim();
  const color = document.getElementById("color").value.trim();
  const idMarca = document.getElementById("marca").value;
  
  const resMarcas = await fetch("http://18.234.189.146:3000/marcas");
const marcas = await resMarcas.json();
const marcaObj = marcas.find(m => m.Marca.toLowerCase() === idMarca.toLowerCase());
if (!marcaObj) {
  alert("Marca no encontrada.");
  return;
}
const idMarcaReal = marcaObj.ID_Marca;


  const datos = {
  nombre_completo,
  matricula,
  tipoUsuario: 2,
  licenciatura,
  placa,
  color,
  idMarca: idMarcaReal  // ⬅️ Correcto, aquí sí mandas el ID real
};

  try {
    const res = await fetch("http://18.234.189.146:3000/usuarios", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(datos)
    });

    const respuesta = await res.json();

    if (res.ok) {
  alert("✅ Alumno registrado correctamente.");
  window.location.href = "registros.html";  // ← te lleva directo a ver la tabla registros
} else {
  alert(`❌ Error al registrar: ${respuesta.mensaje}`);
}
  } catch (error) {
    console.error("Error al registrar alumno:", error);
    alert("❌ Error en el servidor.");
  }
});
});