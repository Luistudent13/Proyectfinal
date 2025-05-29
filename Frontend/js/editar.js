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
  const marca = document.getElementById("marca");
  const mensaje = document.getElementById("mensaje");

  // Obtener datos del usuario
  try {
    const res = await fetch(`http://18.234.189.146:3000/usuarios/${id}`);
    const datos = await res.json();

    nombre.value = datos.Nombre_Completo || "";
    matricula.value = datos.Matricula || "";
    licenciatura.value = datos.Licenciatura || "";
    areaEmpleado.value = datos.Area_Empleado || "";
    placa.value = datos.Placa || "";
    color.value = datos.Color || "";
    marca.value = datos.Marca || "";
  } catch (err) {
    mensaje.textContent = "Error al cargar los datos del usuario.";
    console.error(err);
  }

  // Enviar cambios
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const datosActualizados = {
      nombre_completo: nombre.value.trim(),
      matricula: matricula.value.trim(),
      licenciatura: licenciatura.value.trim() || null,
      area_empleado: areaEmpleado.value.trim() || null,
      placa: placa.value.trim(),
      color: color.value.trim(),
      idMarca: marca.value.trim()  // Aquí deberías mapear a un ID real si trabajas con IDs
    };

    try {
      const res = await fetch(`http://18.234.189.146:3000/usuarios/${id}`, {
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
