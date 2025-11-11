// LOGIN
const loginForm = document.getElementById("login-form");
if (loginForm) {
  loginForm.addEventListener("submit", e => {
    e.preventDefault();
    const user = document.getElementById("username").value;
    const pass = document.getElementById("password").value;

    if (user === "admin" && pass === "1234") {
      localStorage.setItem("loggedIn", "true");
      window.location.href = "dashboard.html";
    } else {
      alert("Usuario o contraseña incorrectos.");
    }
  });
}

// PROTECCIÓN DE RUTAS
if (window.location.pathname.includes("dashboard") || window.location.pathname.includes("analysis")) {
  if (!localStorage.getItem("loggedIn")) {
    window.location.href = "index.html";
  }
}

// LOGOUT
const logout = document.getElementById("logout");
if (logout) {
  logout.addEventListener("click", () => {
    localStorage.removeItem("loggedIn");
    window.location.href = "index.html";
  });
}
