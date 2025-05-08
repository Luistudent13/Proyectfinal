document.getElementById("btnVerRegistros").addEventListener("click", () => {
  window.location.href = "registros.html";
});
 
document.getElementById("btnIngreso").addEventListener("click", () => {
  window.location.href = "verificacion.html"; // o la pantalla de ingreso que uses
});

document.getElementById("btnAlumno").addEventListener("click", () => {
  window.location.href = "alumno.html";
});

document.getElementById("btnEmpleado").addEventListener("click", () => {
  window.location.href = "empleado.html";
});

document.getElementById("btnVisitante").addEventListener("click", () => {
  window.location.href = "visitante.html";
});

document.getElementById("btnTemporal").addEventListener("click", () => {
  window.location.href = "temporal.html";
});

document.getElementById("btnHistorialAcceso").addEventListener("click", () => {
  window.location.href = "historial.html"; // crea este archivo si aún no existe
});

document.getElementById("btnBuscarUsuario").addEventListener("click", () => {
  window.location.href = "buscar.html"; // crea este archivo si aún no existe
});

document.getElementById("btnReportarProblema").addEventListener("click", () => {
  window.location.href = "reporte.html";
});


// 🔹 Validar que matrícula tenga solo números y 9 dígitos
function validarMatricula(matricula) {
    return /^\d{1,9}$/.test(matricula);
  }
  
  // 🔹 Formatear placas: mayúsculas y guiones (ej. ABC-123-X)
  function formatearPlacaAuto(inputElement) {
    inputElement.addEventListener("input", function () {
      let valor = this.value.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 7);
      let formateado = valor.replace(/^(.{3})(.{3})(.{0,1})$/, "$1-$2-$3").replace(/-$/, "");
      this.value = formateado;
    });
  }
  
  // 🔹 Obtener ID de marca según su nombre (de la lista)
  function obtenerIdMarca(nombreMarca, listaMarcas) {
    const marca = listaMarcas.find((m) => m.Marca.toLowerCase() === nombreMarca.toLowerCase());
    return marca ? marca.ID_Marca : null;
  }
  
  // 🔹 Activar autocompletado de marcas
  async function activarAutocompletadoMarcas(inputId, datalistId) {
    const input = document.getElementById(inputId);
    const datalist = document.getElementById(datalistId);
  
    try {
      const res = await fetch("http://localhost:3000/marcas");
      const marcas = await res.json();
  
      datalist.innerHTML = "";
      marcas.forEach((marca) => {
        const option = document.createElement("option");
        option.value = marca.Marca;
        datalist.appendChild(option);
      });
    } catch (error) {
      console.error("Error cargando marcas:", error);
    }
  }
  
  // 🔹 Activar autocompletado de licenciaturas (para alumno)
  function activarAutocompletadoLicenciaturas(inputId, datalistId) {
    const input = document.getElementById(inputId);
    const datalist = document.getElementById(datalistId);
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
        "Litigación Penal y Derechos Humanos (Maestría)", "Derecho Privado y Defensa Familiar (Maestría)",
        "Educación (Maestría)", "Derecho Corporativo y Defensa Laboral (Maestría)",
        "Derecho Notarial (Maestría)", "Enseñanza del Inglés (Maestría)",
        "Ciencias Administrativas (Doctorado)", "Ingeniería en Tecnologías Emergentes (Doctorado)",
        "Derecho (Doctorado)", "Educación (Doctorado)", "Educación Continua", "Centro de Idiomas"
      ];
  
    datalist.innerHTML = "";
    licenciaturas.forEach((lic) => {
      const option = document.createElement("option");
      option.value = lic;
      datalist.appendChild(option);
    });
  }
  
