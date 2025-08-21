document.addEventListener("DOMContentLoaded", async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const id = urlParams.get("id");

  const form = document.getElementById("formEditar");
  const nombre = document.getElementById("nombre");
  const matricula = document.getElementById("matricula");
  const licenciatura = document.getElementById("licenciatura");
  const areaEmpleado = document.getElementById("areaEmpleado");
  const placa = document.getElementById("placa");
  const color = document.getElementById("color");
  const marcaInput = document.getElementById("marca");
  const mensaje = document.getElementById("mensaje");

  let listaMarcas = [];

  matricula.addEventListener("input", () => {
    matricula.value = matricula.value.replace(/\D/g, "").slice(0, 9);
  });

  // Obtener marcas
  async function obtenerMarcas() {
    try {
      const res = await fetch("http://localhost:3000/marcas");
      listaMarcas = await res.json();
    } catch (err) {
      console.error("Error al obtener marcas:", err);
    }
  }

  await obtenerMarcas();

  // Cargar datos del usuario
  try {
    const res = await fetch(`http://44.204.181.158:3000/usuarios/${id}`);
    const datos = await res.json();
    const [nombreSolo, ...restoApellidos] = (datos.Nombre_Completo || "").split(" ");
    nombre.value = nombreSolo;
    document.getElementById("apellidos").value = restoApellidos.join(" ");
    matricula.value = datos.Matricula || "";
    licenciatura.value = datos.Licenciatura || "";
    areaEmpleado.value = datos.Area_Empleado || "";
    placa.value = datos.Placa || "";
    color.value = datos.Color || "";
    marcaInput.value = datos.Marca || "";

    // Mostrar u ocultar campos según tipo de usuario
    if (datos.ID_Tipo_Usuario == 2) {
      licenciatura.parentElement.style.display = "block";
      areaEmpleado.parentElement.style.display = "none";
    } else if (datos.ID_Tipo_Usuario == 3) {
      licenciatura.parentElement.style.display = "none";
      areaEmpleado.parentElement.style.display = "block";
    } else {
      licenciatura.parentElement.style.display = "none";
      areaEmpleado.parentElement.style.display = "none";
    }

  } catch (err) {
    mensaje.textContent = "Error al cargar los datos del usuario.";
    console.error(err);
  }

  // Enviar cambios
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const nombreMarca = marcaInput.value.trim();
    if (!nombreMarca) {
      mensaje.textContent = "Por favor, ingresa una marca válida.";
      mensaje.style.color = "red";
      return;
    }

    const marcaEncontrada = listaMarcas.find(
  m => m.Marca.trim().toLowerCase() === nombreMarca.trim().toLowerCase()
);

    const nombre = document.getElementById("nombre").value.trim();
    const apellidos = document.getElementById("apellidos").value.trim();
    const matricula = document.getElementById("matricula").value.trim();
    const licenciatura = document.getElementById("licenciatura").value.trim() || null;
    const areaEmpleado = document.getElementById("areaEmpleado").value.trim() || null;
    const placa = document.getElementById("placa").value.trim();
    const color = document.getElementById("color").value.trim();

    const datosActualizados = {
  nombre_completo: `${nombre} ${apellidos}`,
  matricula,
  licenciatura,
  area_empleado: areaEmpleado,
  placa,
  color,
  idMarca: marcaEncontrada ? marcaEncontrada.ID_Marca : null,
  nuevaMarcaTexto: !marcaEncontrada ? nombreMarca : null
};

    try {
      const res = await fetch(`http://44.204.181.158:3000/usuarios/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(datosActualizados),
      });

      const result = await res.json();
      if (res.ok) {
        mensaje.textContent = "Usuario actualizado correctamente.";
        mensaje.style.color = "green";
      } else {
        mensaje.textContent = result.error || "Error al actualizar.";
        mensaje.style.color = "red";
      }
    } catch (err) {
      mensaje.textContent = "Error en la solicitud.";
      console.error(err);
    }
  });
});
