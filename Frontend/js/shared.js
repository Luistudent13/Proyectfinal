const btnVerRegistros = document.getElementById("btnVerRegistros");
if (btnVerRegistros) {
  btnVerRegistros.addEventListener("click", () => {
    window.location.href = "registros.html";
  });
}
 
const btnIngreso = document.getElementById("btnIngreso");
if (btnIngreso) {
  btnIngreso.addEventListener("click", () => {
    window.location.href = "verificacion.html";
  });
}

const btnSalida = document.getElementById("btnSalida");
if (btnSalida) {
  btnSalida.addEventListener("click", () => {
    window.location.href = "salida.html";
  });
}

const btnAlumno = document.getElementById("btnAlumno");
if (btnAlumno) {
  btnAlumno.addEventListener("click", () => {
    window.location.href = "alumno.html";
  });
}

const btnEmpleado = document.getElementById("btnEmpleado");
if (btnEmpleado) {
  btnEmpleado.addEventListener("click", () => {
    window.location.href = "empleado.html";
  });
}

const btnVisitante = document.getElementById("btnVisitante");
if (btnVisitante) {
  btnVisitante.addEventListener("click", () => {
    window.location.href = "visitante.html";
  });
}

const btnTemporal = document.getElementById("btnTemporal");
if (btnTemporal) {
  btnTemporal.addEventListener("click", () => {
    window.location.href = "temporal.html";
  });
}

const btnHistorialAcceso = document.getElementById("btnHistorialAcceso");
if (btnHistorialAcceso) {
  btnHistorialAcceso.addEventListener("click", () => {
    window.location.href = "historial.html";
  });
}

const btnBuscarUsuario = document.getElementById("btnBuscarUsuario");
if (btnBuscarUsuario) {
  btnBuscarUsuario.addEventListener("click", () => {
    window.location.href = "buscar.html";
  });
}

const btnReportarProblema = document.getElementById("btnReportarProblema");
if (btnReportarProblema) {
  btnReportarProblema.addEventListener("click", () => {
    window.location.href = "reporte.html";
  });
}



// 🔹 Validar que matrícula tenga solo números y 9 dígitos
function validarMatricula(matricula) {
    return /^\d{1,9}$/.test(matricula);
  }
  
  // 🔹 Formatear placas: mayúsculas y guiones (ej. ABC-123-X)
  function formatearPlacaAuto(inputElement) {
  let valor = inputElement.value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 7);

  if (valor.length <= 3) {
    inputElement.value = valor;
  } else if (valor.length <= 6) {
    inputElement.value = valor.slice(0, 3) + '-' + valor.slice(3);
  } else {
    inputElement.value = valor.slice(0, 3) + '-' + valor.slice(3, 6) + '-' + valor.slice(6);
  }
}

  
  // 🔹 Obtener ID de marca según su nombre (de la lista)
  function obtenerIdMarca(nombreMarca, listaMarcas) {
    const marca = listaMarcas.find((m) => m.Marca.toLowerCase() === nombreMarca.toLowerCase());
    return marca ? marca.ID_Marca : null;
  }
  
  // 🔹 Activar autocompletado de marcas
  async function activarAutocompletadoMarcas(inputId) {
  const input = document.getElementById(inputId);

  try {
    const res = await fetch("http://44.204.181.158:3000/marcas");
    const marcas = await res.json();
    const lista = marcas.map(m => m.Marca);

    new Awesomplete(input, {
      list: lista,
      minChars: 1,
      maxItems: 10,
      autoFirst: true
    });
  } catch (error) {
    console.error("Error cargando marcas:", error);
  }
}

  
  // 🔹 Activar autocompletado de licenciaturas (para alumno)
  function activarAutocompletadoLicenciaturas(inputId) {
  const input = document.getElementById(inputId);
  const licenciaturas = [
    "Administración y Dirección de Empresas", "Contaduría y Finanzas", "Economía",
    "Mercados y Negocios Internacionales", "Médico Cirujano", "Nutrición y Ciencia de los Alimentos",
    "Actuaría", "Arquitectura", "Ingeniería en Sistemas Computacionales",
    "Ingeniería en Telecomunicaciones y Sistemas Electrónicos", "Ingeniería Industrial",
    "Ingeniería en Mecatrónica", "Ingeniería Petrolera", "Arquitectura de Interiores y Habitabilidad",
    "Ciencia de Datos e Inteligencia de Negocios", "Ciencias de la Educación",
    "Comunicación y Entornos Digitales", "Derecho", "Diseño Gráfico y Producción Digital",
    "Idiomas", "Psicología", "Publicidad y Mercadotecnia Digital",
    "Comercio Internacional y Aduanas", "Red Logística y Transporte", "Administración",
    "Criminología e Investigación Forense", "Administración de Negocios (Maestría)",
    "Administración y Mercadotecnia (Maestría)", "Finanzas (Maestría)", "Impuestos (Maestría)",
    "Nutrición Clínica (Maestría)", "Diseño Arquitectónico y Bioclimático (Maestría)",
    "Gestión Urbana y Medio Ambiente (Maestría)", "Ingeniería Industrial (Maestría)",
    "Redes y Telecomunicaciones (Maestría)", "Ciencia de datos (Maestría)",
    "Administración y Gestión de Instituciones Educativas (Maestría)",
    "Derecho Constitucional y Amparo (Maestría)", "Derecho Corporativo y Defensa Fiscal (Maestría)",
    "Litigación Penal y Derechos Humanos (Maestría)"
  ];

  new Awesomplete(input, {
    list: licenciaturas,
    minChars: 1,
    maxItems: 10,
    autoFirst: true
  });
}

  
function mostrarModalCerrarSesion() {
  const modal = document.getElementById("modalCerrarSesion");
  if (modal) modal.style.display = "flex";
}

function ocultarModalCerrarSesion() {
  const modal = document.getElementById("modalCerrarSesion");
  if (modal) modal.style.display = "none";
}

function permitirSoloTextoConAcentos(input) {
  input.addEventListener("input", () => {
    input.value = input.value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, "");
  });
}


function cerrarSesion() {
  window.location.href = "index.html";
}
