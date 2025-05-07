document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("loginForm");
    const mensaje = document.getElementById("mensajeLogin");
  
    form.addEventListener("submit", (e) => {
      e.preventDefault();
  
      const usuario = document.getElementById("username").value.trim();
      const contrasena = document.getElementById("password").value.trim();
  
      // 👇 Aquí validas el usuario y contraseña
      if (usuario === "admin_ucc" && contrasena === "123") {
        window.location.href = "../screens/menu.html"; // Redirige al menú
      } else {
        mensaje.textContent = "⚠️ Usuario o contraseña incorrectos";
        mensaje.style.color = "red";
      }
    });
  });
  