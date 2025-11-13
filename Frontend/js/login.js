document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("loginForm");
  const mensaje = document.getElementById("mensajeLogin");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const usuario = document.getElementById("username").value.trim();
    const contrasena = document.getElementById("password").value.trim();

    if (!usuario || !contrasena) {
      mensaje.textContent = "Ingresa usuario y contraseña.";
      mensaje.style.color = "red";
      return;
    }

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({  username: usuario, password: contrasena }),
      });

      const data = await res.json();

      if (!res.ok) {
        mensaje.textContent = data.mensaje || "Usuario o contraseña incorrectos";
        mensaje.style.color = "red";
        return;
      }

      // Guardar token y rol (si luego quieres proteger vistas)
      localStorage.setItem("token", data.token);
      localStorage.setItem("rol", data.rol);

      window.location.href = "../screens/menu.html";
    } catch (err) {
      console.error(err);
      mensaje.textContent = "Error al conectar con el servidor.";
      mensaje.style.color = "red";
    }
  });
});
