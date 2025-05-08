//📌 Define la URL base del backend para todas las peticiones fetch.
const API_URL = "http://localhost:3000";

// ✅ Validar matrícula según tipo de usuario
function validarMatricula(matricula, tipoUsuario) {
  const soloNumeros = /^[0-9]+$/;
  if (!soloNumeros.test(matricula)) {
    alert("La matrícula debe contener solo números.");
    return false;
  }

  if (tipoUsuario === 2 && matricula.length !== 9) {
    alert("La matrícula del alumno debe ser de exactamente 9 dígitos.");
    return false;
  }

  if (tipoUsuario === 3 && matricula.length !== 3) {
    alert("La matrícula del empleado debe ser de exactamente 3 dígitos.");
    return false;
  }

  return true;
}

// ✅ Validar campos comunes
function validarFormularioComun({ nombre, apellidos, placa, color, idMarca }) {
  if (!nombre || !apellidos || !placa || !color) {
    alert("Por favor, completa todos los campos obligatorios.");
    return false;
  }

  if (idMarca === 0) {
    alert("Selecciona una marca válida.");
    return false;
  }

  return true;
}

// ✅ Formatear placa automáticamente
function formatearPlacaAuto(valor) {
  const limpio = valor.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 7);

  if (limpio.length <= 3) return limpio;
  if (limpio.length <= 6) return limpio.slice(0, 3) + '-' + limpio.slice(3);
  return limpio.slice(0, 3) + '-' + limpio.slice(3, 6) + '-' + limpio.slice(6);
}

// 📚 Lista única de licenciaturas
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

const marcasCoches = [
  "Nissan", "Chevrolet", "Volkswagen", "Toyota", "Kia", "Honda", "Mazda", "Hyundai", "Ford", "Renault",
  "Dodge", "Jeep", "BMW", "Mercedes-Benz", "Audi", "SEAT", "Chrysler", "Peugeot", "Suzuki", "Fiat",
  "Mitsubishi", "Subaru", "GMC", "Mini", "Buick", "RAM", "Pontiac", "Acura", "Infiniti", "Lincoln",
  "Volvo", "Opel", "Alfa Romeo", "Smart", "Saab", "Isuzu", "Lexus", "Tesla", "Jaguar", "Land Rover",
  "Hummer", "Cadillac", "Changan", "BYD", "MG", "Foton", "Baic", "JAC", "Geely", "Great Wall",
  "ZNA", "Datsun", "Lifan", "FAW", "IVECO", "Kenworth", "International", "Freightliner", "MAN",
  "Scania", "Peterbilt", "Mahindra", "Tata", "Perodua", "Proton", "Chery", "Zotye", "Changhe", "Dongfeng"
];

// 🔹 Mostrar pantalla de login
function mostrarLogin() {
  document.getElementById("welcomePage").style.display = "none";
  document.getElementById("loginPage").style.display = "block";
}

// 🔹 Manejar login
document.getElementById("loginForm").addEventListener("submit", function (e) {
  e.preventDefault();
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;
  if (username === "admin_ucc" && password === "123") {
    document.getElementById("loginPage").style.display = "none";
    document.getElementById("menuPage").style.display = "block";
  } else {
    alert("Credenciales incorrectas");
  }
});

function cerrarSesion() {
  document.getElementById("menuPage").style.display = "none";
  document.getElementById("loginPage").style.display = "block";

  // Limpiar campos de login (opcional)
  document.getElementById("username").value = "";
  document.getElementById("password").value = "";
}

function mostrarModalCerrarSesion() {
  document.getElementById("modalCerrarSesion").style.display = "flex";
}

function cancelarCerrarSesion() {
  document.getElementById("modalCerrarSesion").style.display = "none";
}

function confirmarCerrarSesion() {
  document.getElementById("modalCerrarSesion").style.display = "none";
  cerrarSesion(); // esta función ya la tienes
}

// ✅ Asignar botones que abren formularios
const botonesNavegacion = [
  { boton: "btnAlumno", destino: "alumnoPage" },
  { boton: "btnEmpleado", destino: "empleadoPage" },
  { boton: "btnTemporal", destino: "temporalPage" },
  { boton: "btnVisitante", destino: "visitantePage" },
  { boton: "btnIngreso", destino: "verificacionPage", display: "flex" }
];
botonesNavegacion.forEach(({ boton, destino, display }) => {
  document.getElementById(boton).addEventListener("click", () => {
    cambiarPantalla("menuPage", destino, display || "block");
  });
});

// 🔁 Función para cambiar entre pantallas
function cambiarPantalla(origenId, destinoId, displayType = "block") {
  document.getElementById(origenId).style.display = "none";
  document.getElementById(destinoId).style.display = displayType;
}


// ✅ Función para cancelar formularios
function cancelarFormulario(paginaId) {
  cambiarPantalla(paginaId, "menuPage");
}
// ✅ Cancelaciones individuales con funciones reutilizables
function cancelarAlumno()     { cancelarFormulario("alumnoPage"); }
function cancelarEmpleado()   { cancelarFormulario("empleadoPage"); }
function cancelarTemporal()   { cancelarFormulario("temporalPage"); }
function cancelarVisitante()  { cancelarFormulario("visitantePage"); }
function cancelarVerificacion() {
  cancelarFormulario("verificacionPage");
  document.getElementById("placaVerificar").value = "";
  document.getElementById("resultadoVerificacion").innerText = "";
}

document.getElementById("formAlumno").addEventListener("submit", async function (e) {
  e.preventDefault();

  const nombre = document.getElementById("nombre").value.trim();
  const apellidos = document.getElementById("apellidos").value.trim();
  const matricula = document.getElementById("matricula").value.trim();
  const placa = document.getElementById("placa").value.trim();
  const color = document.getElementById("color").value.trim();
  const marcaSeleccionada = document.getElementById("marcaInput").value.trim();
  const licenciatura = document.getElementById("licenciaturaInput").value.trim();

  if (!validarMatricula(matricula, 2)) return;

  const idMarca = await obtenerIdMarca(marcaSeleccionada); // ✅ ahora sí definido antes

  if (!validarFormularioComun({ nombre, apellidos, placa, color, idMarca })) return;

  registrarUsuarioConVehiculo({
    tipoUsuario: 2,
    formId: "formAlumno",
    nombreId: "nombre",
    apellidosId: "apellidos",
    matriculaId: "matricula",
    placaId: "placa",
    colorId: "color",
    marcaId: "marcaInput",
    licenciatura: licenciatura
  });
});


async function obtenerIdMarca(nombre) {
  try {
    const res = await fetch(`${API_URL}/marcas/id?nombre=${encodeURIComponent(nombre)}`);
    if (!res.ok) throw new Error("Marca no encontrada");
    const data = await res.json();
    return data.idMarca;
  } catch (err) {
    console.error("❌ Error al obtener ID de marca:", err);
    return 0;
  }
}


document.getElementById("formEmpleado").addEventListener("submit", function (e) {
  e.preventDefault();

  const nombre = document.getElementById("nombre_empl").value.trim();
  const apellidos = document.getElementById("apellidos_empl").value.trim();
  const matricula = document.getElementById("matricula_empl").value.trim();
  const placa = document.getElementById("placa_empl").value.trim();
  const color = document.getElementById("color_empl").value.trim();
  const marcaSeleccionada = document.getElementById("marcaEmpleadoInput").value.trim();
  const idMarca = marcasCoches.indexOf(marcaSeleccionada) + 1;

  // ✅ Validación con función nueva
  if (!validarMatricula(matricula, 3)) return;

  if (!validarFormularioComun({ nombre, apellidos, placa, color, idMarca })) return;

  registrarUsuarioConVehiculo({
    tipoUsuario: 3,
    formId: "formEmpleado",
    nombreId: "nombre_empl",
    apellidosId: "apellidos_empl",
    matriculaId: "matricula_empl",
    placaId: "placa_empl",
    colorId: "color_empl",
    marcaId: "marcaEmpleadoInput"
  });
});


// 🔁 Función para obtener ID de marca
function getMarcaId(nombreMarca) {
  return Marcas[nombreMarca] || 0;
}

// 🔁 Función reutilizable para validar y registrar usuarios con vehículo
async function registrarUsuarioConVehiculo({
  tipoUsuario,
  formId,
  nombreId,
  apellidosId,
  matriculaId,
  placaId,
  colorId,
  marcaId,
  licenciatura = "" // ✅ ¡Ya con coma!
}) 
{
  const nombre = document.getElementById(nombreId).value.trim();
  const apellidos = document.getElementById(apellidosId).value.trim();
  const matricula = document.getElementById(matriculaId).value.trim();
  const placa = document.getElementById(placaId).value.trim();
  const marcaSeleccionada = document.getElementById(marcaId).value.trim();
  const idMarca = await obtenerIdMarca(marcaSeleccionada);
  const matriculaInput = matricula.toUpperCase().trim();
  const placaInput = placa.toUpperCase().trim();

  const color = document.getElementById(colorId).value.trim();
  const nombreCompleto = `${nombre} ${apellidos}`;

  if (!nombre || !apellidos || !matricula || !placa || !color) {
    alert("Por favor, completa todos los campos obligatorios.");
    return;
  }

  if (idMarca === 0) {
    alert("Selecciona una marca válida.");
    return;
  }

  try {
    const resUsuarios = await fetch(`${API_URL}/usuarios`);
    const usuarios = await resUsuarios.json();

    const existeMatricula = usuarios.some(u =>
      u.Matricula && u.Matricula.toUpperCase().trim() === matriculaInput
    );
  
    const existePlaca = usuarios.some(u =>
      u.Placa && u.Placa.toUpperCase().trim() === placaInput
    );
  
    if (existeMatricula) {
      alert("Ya existe un usuario con esa matrícula.");
      return;
    }
  
    if (existePlaca) {
      alert("Ya existe un usuario con esa placa.");
      return;
    }

    const usuarioPayload = {
      Nombre_Completo: nombreCompleto,
      ID_Tipo_Usuario: tipoUsuario,
      Matricula: matricula,
      Correo: null,
      Telefono: null,
      Licenciatura: licenciatura
    };

    const resUsuario = await fetch(`${API_URL}/usuarios`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(usuarioPayload)
    });

    const usuarioData = await resUsuario.json();
    if (!resUsuario.ok) {
      throw new Error(usuarioData.error?.sqlMessage || "Error al registrar usuario");
    }

    const ID_Usuario = usuarioData.userId;

    const resVehiculo = await fetch(`${API_URL}/vehiculos`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ID_Usuario,
        Placa: placa,
        ID_Marca: idMarca,
        Modelo: "",
        Color: color,
        ID_Discapacidad: null
      })
    });

    const vehiculoData = await resVehiculo.json();
    if (!resVehiculo.ok) {
      throw new Error(vehiculoData.error?.sqlMessage || "Error al registrar vehículo");
    }

    alert("Registro exitoso 🎉");
    document.getElementById(formId).reset();
  } catch (error) {
    console.error("🚨 Error:", error);
    alert("Ocurrió un error: " + error.message);
  }
}

function formatearPlaca(input) {
  input.value = formatearPlacaAuto(input.value);
}

///////////// 🔹 Función para enviar el formulario del Usuario Temporal
document.getElementById("formTemporal").addEventListener("submit", async function (e) {
  e.preventDefault();

  const nombre = document.getElementById("nombre_temp").value.trim();
  const apellidos = document.getElementById("apellidos_temp").value.trim();
  const personaRecoge = document.getElementById("persona_recoge").value.trim();
const relacionEstudiante = document.getElementById("relacion_estudiante").value.trim();

  const placa = document.getElementById("placa_temp").value.trim();
  const color = document.getElementById("color_temp").value.trim();
  const marcaSeleccionada = document.getElementById("marcaTemporalInput").value.trim();
  const idMarca = await obtenerIdMarca(marcaSeleccionada);
  const nombreCompleto = `${nombre} ${apellidos}`;
  const ID_Tipo_Usuario = 4;

  if (!nombre || !apellidos || !personaRecoge || !relacionEstudiante || !placa || !color) {
    alert("Por favor, completa todos los campos.");
    return;
  }

  try {
    const usuarioPayload = {
      Nombre_Completo: nombreCompleto,
      ID_Tipo_Usuario,
      Matricula: `TEMP-${Date.now()}`,
      Persona_Recoge: personaRecoge,
      Relacion_Estudiante: relacionEstudiante
    };

    const resUsuario = await fetch(`${API_URL}/usuarios`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(usuarioPayload)
    });

    const usuarioData = await resUsuario.json();
    if (!resUsuario.ok) throw new Error(usuarioData.error?.sqlMessage || "Error al registrar usuario");

    const ID_Usuario = usuarioData.userId;

    const resVehiculo = await fetch(`${API_URL}/vehiculos`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ID_Usuario,
        Placa: placa,
        ID_Marca: idMarca,
        Modelo: "",
        Color: color,
        ID_Discapacidad: null
      })
    });

    const vehiculoData = await resVehiculo.json();
    if (!resVehiculo.ok) throw new Error(vehiculoData.error?.sqlMessage || "Error al registrar vehículo");

    alert("Usuario temporal y vehículo registrados con éxito 🎉");
    document.getElementById("formTemporal").reset();
  } catch (error) {
    console.error("🚨 Error:", error);
    alert("Ocurrió un error: " + error.message);
  }
});

// Botón ver registros
document.getElementById("btnVerRegistros").addEventListener("click", async function () {
  document.getElementById("menuPage").style.display = "none";
  document.getElementById("registrosPage").style.display = "block";

  try {
    const res = await fetch(`${API_URL}/usuarios`);
    const data = await res.json();

    if (!Array.isArray(data)) {
      throw new Error("Formato inesperado de respuesta");
    }

    const registrosBody = document.getElementById("registrosBody");
    registrosBody.innerHTML = "";

    data.forEach(usuario => {
      const tipo = usuario.ID_Tipo_Usuario === 2 ? "Alumno" :
             usuario.ID_Tipo_Usuario === 3 ? "Empleado" :
             usuario.ID_Tipo_Usuario === 4 ? "Temporal" :
             usuario.ID_Tipo_Usuario === 5 ? "Visitante" :
             "Otro";

             const row = `
             <tr>
               <td>${usuario.ID_Usuario}</td>
               <td>${usuario.Nombre_Completo}</td>
               <td>${usuario.Matricula || "-"}</td>
               <td>${tipo}</td>
               <td>${usuario.Licenciatura || "-"}</td> <!-- ✅ NUEVA -->
               <td>${usuario.Placa || "-"}</td>
               <td>${usuario.Marca || "-"}</td>
               <td>${usuario.Color || "-"}</td>
               <td>
                 <button class="btn-rojo-mini" onclick="eliminarUsuario(${usuario.ID_Usuario})">Eliminar</button>
                 <button class="btn-azul-mini" onclick="editarUsuario(${usuario.ID_Usuario})">Editar</button>
               </td>
             </tr>
           `;
      registrosBody.insertAdjacentHTML("beforeend", row);
    });
  } catch (error) {
    console.error("Error al cargar registros:", error);
    alert("No se pudieron cargar los registros.");
  }
});

function volverAlMenu() {
  document.getElementById("registrosPage").style.display = "none";
  document.getElementById("menuPage").style.display = "block";
}

async function eliminarUsuario(id) {
  const confirmado = confirm("¿Estás seguro de que deseas eliminar este usuario?");
  if (!confirmado) return;

  try {
    const res = await fetch(`${API_URL}/usuarios/${id}`, {
      method: "DELETE"
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || "No se pudo eliminar");
    }

    alert("Usuario eliminado correctamente");
    document.getElementById("btnVerRegistros").click();
  } catch (err) {
    console.error("Error al eliminar usuario:", err);
    alert("Error al eliminar el registro.");
  }
}

async function verificarPlaca() {
  const placa = document.getElementById("placaVerificar").value.trim();
  const resultado = document.getElementById("resultadoVerificacion");

  if (!placa) {
    alert("Por favor ingresa una placa.");
    return;
  }

  try {
    const res = await fetch(`${API_URL}/vehiculos`);
    const data = await res.json();

    const vehiculo = data.find(v => v.Placa.toUpperCase() === placa.toUpperCase());

    if (vehiculo || esTaxi) {
      resultado.innerText = "✅ Acceso permitido.";
      resultado.style.color = "green";
    } else {
      resultado.innerText = "❌ Vehículo NO registrado.";
      resultado.style.color = "red";
    }
  } catch (error) {
    console.error("Error al verificar placa:", error);
    alert("Ocurrió un error al verificar.");
  }
}

document.getElementById("formVisitante").addEventListener("submit", async function (e) {
  e.preventDefault();

  const nombre = document.getElementById("nombre_visitante").value.trim();
  const apellidos = document.getElementById("apellidos_visitante").value.trim();
  const evento = document.getElementById("evento_visitante").value.trim();
  const horaEntrada = document.getElementById("hora_ingreso").value;
  const horaSalida = document.getElementById("hora_salida").value;

  const placa = document.getElementById("placa_visitante").value.trim();
  const color = document.getElementById("color_visitante").value.trim();
  const marcaSeleccionada = document.getElementById("marcaVisitanteInput").value.trim();
  const idMarca = await obtenerIdMarca(marcaSeleccionada);

if (idMarca === 0) {
  alert("Selecciona una marca válida.");
  return;
}

  const nombreCompleto = `${nombre} ${apellidos}`;
  const ID_Tipo_Usuario = 5;

  if (!nombre || !apellidos || !evento || !horaEntrada || !horaSalida || !placa || !color) {
    alert("Por favor, completa todos los campos.");
    return;
  }

  try {
    const usuarioPayload = {
      Nombre_Completo: nombreCompleto,
      ID_Tipo_Usuario,
      Matricula: evento,
      Hora_Entrada: horaEntrada,
      Hora_Salida: horaSalida
    };

    const resUsuario = await fetch(`${API_URL}/usuarios`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(usuarioPayload)
    });

    const usuarioData = await resUsuario.json();
    if (!resUsuario.ok) throw new Error(usuarioData.error?.sqlMessage || "Error al registrar visitante");

    const ID_Usuario = usuarioData.userId;

    const resVehiculo = await fetch(`${API_URL}/vehiculos`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ID_Usuario,
        Placa: placa,
        ID_Marca: idMarca,
        Modelo: "",
        Color: color,
        ID_Discapacidad: null
      })
    });

    const vehiculoData = await resVehiculo.json();
    if (!resVehiculo.ok) throw new Error(vehiculoData.error?.sqlMessage || "Error al registrar vehículo");

    alert("Visitante registrado con éxito 🎉");
    document.getElementById("formVisitante").reset();
  } catch (error) {
    console.error("🚨 Error al registrar visitante:", error);
    alert("Ocurrió un error: " + error.message);
  }
});

document.getElementById("btnBuscarUsuario").addEventListener("click", () => {
  document.getElementById("menuPage").style.display = "none";
  document.getElementById("buscarUsuarioPage").style.display = "flex";
});

function cancelarBusqueda() {
  document.getElementById("buscarUsuarioPage").style.display = "none";
  document.getElementById("menuPage").style.display = "block";
  document.getElementById("resultadoBusqueda").innerText = "";
}

function buscarUsuario() {
  const matricula = document.getElementById("matriculaBuscar").value.trim();
  const placa = document.getElementById("placaBuscar").value.trim();
  const resultado = document.getElementById("resultadoBusqueda");
  resultado.innerHTML = "";

  if (matricula === "" && placa === "") {
    resultado.innerHTML = "<p style='color:red;'>Por favor ingresa una matrícula o una placa para buscar.</p>";
    return;
  }

  fetch(`${API_URL}/usuarios`)
    .then(res => res.json())
    .then(data => {
      let usuario = null;

      if (matricula !== "") {
        usuario = data.find(u => u.Matricula === matricula);
      } else if (placa !== "") {
        usuario = data.find(u => u.Placa === placa.toUpperCase());
      }

      if (!usuario) {
        resultado.innerHTML = "<p style='color:red;'>Usuario no encontrado.</p>";
        return;
      }

      resultado.innerHTML = `
        <div class="tarjeta-resultado">
          <p><strong>Nombre:</strong> ${usuario.Nombre_Completo}</p>
          <p><strong>Matrícula:</strong> ${usuario.Matricula}</p>
          <p><strong>Tipo:</strong> ${usuario.Tipo_Usuario}</p>
          <p><strong>Licenciatura/Área:</strong> ${usuario.Licenciatura || "N/A"}</p>
          <p><strong>Placa:</strong> ${usuario.Placa}</p>
          <p><strong>Marca:</strong> ${usuario.Marca}</p>
          <p><strong>Color:</strong> ${usuario.Color}</p>
          <button class="btn-azul" onclick="editarUsuario(${usuario.ID_Usuario})">Editar</button>
          <button class="btn-rojo" onclick="eliminarUsuario(${usuario.ID_Usuario})">Eliminar</button>
        </div>
      `;
    })
    .catch(err => {
      resultado.innerHTML = `<p style='color:red;'>Error al buscar usuario.</p>`;
      console.error("Error:", err);
    });
}



async function editarUsuario(id) {
  const res = await fetch(`${API_URL}/usuarios`);
  const usuarios = await res.json();
  const usuario = usuarios.find(u => u.ID_Usuario === id);
  const campoLicencia = document.getElementById("campoLicenciaturaOArea");
const labelLic = document.getElementById("labelLicenciaArea");
const inputLic = document.getElementById("editarLicenciatura");

if (usuario.ID_Tipo_Usuario === 2) { // Alumno
  campoLicencia.style.display = "block";
  labelLic.textContent = "Licenciatura";
  inputLic.value = usuario.Licenciatura || "";
} else if (usuario.ID_Tipo_Usuario === 3) { // Empleado
  campoLicencia.style.display = "block";
  labelLic.textContent = "Área";
  inputLic.value = usuario.Licenciatura || "";
} else {
  campoLicencia.style.display = "none";
  inputLic.value = "";
}

  if (!usuario) {
    alert("Usuario no encontrado");
    return;
  }

  document.getElementById("editarIdUsuario").value = usuario.ID_Usuario;
  document.getElementById("editarNombre").value = usuario.Nombre_Completo;
  document.getElementById("editarMatricula").value = usuario.Matricula;
  document.getElementById("editarPlaca").value = usuario.Placa || "";
  document.getElementById("editarColor").value = usuario.Color || "";
  document.getElementById("editarMarca").value = usuario.Marca || "";

  document.getElementById("registrosPage").style.display = "none";
  document.getElementById("editarUsuarioPage").style.display = "block";
  cargarLicenciaturasEdicion(); // Activa autocompletado en edición
}

function cancelarEdicion() {
  document.getElementById("editarUsuarioPage").style.display = "none";
  document.getElementById("registrosPage").style.display = "block";
}

document.getElementById("formEditarUsuario").addEventListener("submit", async function(e) {
  e.preventDefault();

  const id = document.getElementById("editarIdUsuario").value;
  const nombre = document.getElementById("editarNombre").value.trim();
  const matricula = document.getElementById("editarMatricula").value.trim();
const placa = document.getElementById("editarPlaca").value.trim();

// 🎯 Validar matrícula
if (!validarMatricula(matricula, matricula.length === 9 ? 2 : 3)) return;

// 🎯 Validar placa
const formatoPlaca = /^[A-Z0-9]{3}-[A-Z0-9]{3}(-[A-Z0-9])?$/;
if (!formatoPlaca.test(placa)) {
  alert("La placa debe tener formato válido, por ejemplo: ABC-123, WEF-W23-3 o ABC-123-A.");
  return;
}
  const color = document.getElementById("editarColor").value.trim();
  const marcaSeleccionada = document.getElementById("editarMarca").value.trim();
  const idMarca = await obtenerIdMarca(marcaSeleccionada);
  try {
    const licenciatura = document.getElementById("editarLicenciatura").value.trim();

const res = await fetch(`${API_URL}/editar-usuario/${id}`, {
  method: "PUT",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    Nombre_Completo: nombre,
    Matricula: matricula,
    Placa: placa,
    Color: color,
    ID_Marca: idMarca,
    Licenciatura: licenciatura
  })
});

    const data = await res.json();
if (!res.ok) throw new Error(data?.error?.sqlMessage || "Error al editar usuario");

    alert("Usuario actualizado correctamente");
    cancelarEdicion();
    document.getElementById("btnVerRegistros").click();
  } catch (err) {
    alert("Error al actualizar: " + err.message);
  }
});

// 🧠 Cargar lista de licenciaturas en todos los selects
function cargarLicenciaturas() {
  const input = document.getElementById("licenciaturaInput");

function normalize(str) {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
  }

const awesomplete = new Awesomplete(input, {
    list: licenciaturas,
    minChars: 1,
    maxItems: 10,
    autoFirst: true,
    sort: false,
    filter: function(text, input) {
      return normalize(text).startsWith(normalize(input));
    }
  });

  input.addEventListener("focus", () => {
    if (input.value === "") {
      input.value = " "; // Añadir espacio para que Awesomplete se active
      awesomplete.evaluate(); //  Forzar que muestre la lista
      setTimeout(() => input.value = "", 10); // Limpiar el campo sin bloquear sugerencias
    }
  });
  
}

function limpiarMatriculaInput(input, maxLength) {
  input.value = input.value.replace(/\D/g, '').slice(0, maxLength);
}

document.getElementById("matricula_empl").addEventListener("input", function() {
  this.value = this.value.replace(/\D/g, '').slice(0, 3); // solo números, máximo 3
});

document.getElementById("matricula").addEventListener("input", function() {
  this.value = this.value.replace(/\D/g, '').slice(0, 9); // solo permite 9 números
});

document.getElementById("editarMatricula").addEventListener("input", function() {
  this.value = this.value.replace(/\D/g, '').slice(0, 9);
});

// 🔥 Validaciones de placas
["placa", "placa_empl", "placa_temp", "placa_visitante", "editarPlaca", "placaBuscar"].forEach(id => {
  const input = document.getElementById(id);
  if (input) {
    input.addEventListener("input", function () {
      formatearPlaca(this);
    });
  }
});

document.getElementById("matriculaBuscar").addEventListener("input", function () {
  validarMatricula(this, 9); // ← solo números, máximo 9
});
document.getElementById("placaBuscar").addEventListener("input", function () {
  formatearPlaca(this);
});

document.getElementById("btnReportarProblema").addEventListener("click", function () {
  cambiarPantalla("menuPage", "reportarProblemaPage");
});

document.getElementById("formReporte").addEventListener("submit", function (e) {
  e.preventDefault();
  const asunto = document.getElementById("asuntoReporte").value.trim();
  const descripcion = document.getElementById("descripcionReporte").value.trim();

  if (!asunto || !descripcion) {
    alert("Por favor, completa todos los campos.");
    return;
  }

  // Aquí podrías hacer un POST al backend
  console.log("📝 Reporte enviado:", { asunto, descripcion });

  alert("Gracias por tu reporte. Será revisado pronto.");
  cancelarReporte();
});

// 🔹 Mostrar pantalla de accesos
document.getElementById("btnHistorialAcceso").addEventListener("click", async function () {
  cambiarPantalla("menuPage", "registrosAccesoPage");

  try {
    const res = await fetch(`${API_URL}/accesos`);
    const data = await res.json();

    const accesosBody = document.getElementById("accesosBody");
    accesosBody.innerHTML = "";

    // Guardamos los datos globalmente para filtrar
    window._accesosGlobal = data;

    data.forEach(reg => {
      const row = `
        <tr>
          <td>${reg.ID_Acceso}</td>
          <td>${reg.Nombre_Usuario || "-"}</td>
          <td>${reg.Placa || "-"}</td>
          <td>${reg.Hora_Entrada}</td>
        </tr>
      `;
      accesosBody.innerHTML += row;
    });
  } catch (err) {
    alert("Error al cargar historial de accesos");
    console.error(err);
  }
});

function filtrarAccesos() {
  const filtro = document.getElementById("busquedaAcceso").value.toLowerCase();
  const accesosBody = document.getElementById("accesosBody");
  const datos = window._accesosGlobal || [];

  accesosBody.innerHTML = "";

  datos
    .filter(reg => 
      (reg.Nombre_Usuario || "").toLowerCase().includes(filtro) ||
      (reg.Placa || "").toLowerCase().includes(filtro)
    )
    .forEach(reg => {
      const row = `
        <tr>
          <td>${reg.ID_Acceso}</td>
          <td>${reg.Nombre_Usuario || "-"}</td>
          <td>${reg.Placa || "-"}</td>
          <td>${reg.Hora_Entrada}</td>
        </tr>
      `;
      accesosBody.innerHTML += row;
    });
}

function volverMenuDesdeAccesos() {
  cambiarPantalla("registrosAccesoPage", "menuPage");
}

function cancelarReporte() {
  document.getElementById("reportarProblemaPage").style.display = "none";
  document.getElementById("menuPage").style.display = "block";
  document.getElementById("formReporte").reset();
}

function activarAutocompletadoMarcas(idInput) {
  const input = document.getElementById(idInput);
  if (!input) return;

  const awesomplete = new Awesomplete(input, {
    list: marcasCoches,
    minChars: 1,
    maxItems: 10,
    autoFirst: true,
    sort: false
  });

  input.addEventListener("focus", () => {
    if (input.value === "") {
      input.value = " ";
      awesomplete.evaluate();
      setTimeout(() => input.value = "", 10);
    }
  });
}

activarAutocompletadoMarcas("marcaInput");
activarAutocompletadoMarcas("marcaEmpleadoInput");
activarAutocompletadoMarcas("marcaTemporalInput");
activarAutocompletadoMarcas("marcaVisitanteInput");
activarAutocompletadoMarcas("editarMarca");

function cargarLicenciaturasEdicion() {
  const input = document.getElementById("editarLicenciatura");
  input.setAttribute("autocomplete", "off");


  function normalize(str) {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
  }

  const awesomplete = new Awesomplete(input, {
    list: licenciaturas,
    minChars: 1,
    maxItems: 10,
    autoFirst: true,
    sort: false,
    filter: function (text, input) {
      return normalize(text).startsWith(normalize(input));
    }
  });

  input.addEventListener("focus", () => {
    if (input.value === "") {
      input.value = " ";
      awesomplete.evaluate();
      setTimeout(() => (input.value = ""), 10);
    }
  });
}
window.addEventListener("DOMContentLoaded", cargarLicenciaturas);