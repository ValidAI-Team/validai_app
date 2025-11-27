// main.js - ValidAI Login + Registro + Recuperación
document.addEventListener("DOMContentLoaded", () => {
  // Elementos del DOM
  const loginForm = document.getElementById("login-form");
  const registerForm = document.getElementById("register-form");
  const tabBtns = document.querySelectorAll(".tab-btn");
  const togglePasswordBtns = document.querySelectorAll(".toggle-password");
  const forgotPasswordLink = document.querySelector(".forgot-password");
  const modal = document.getElementById("forgot-password-modal");
  const closeModal = document.querySelector(".close-modal");
  const cancelBtn = document.querySelector(".cancel-btn");
  const recoveryBtn = document.querySelector(".recovery-btn");
  const strengthFill = document.querySelector(".strength-fill");
  const strengthText = document.querySelector(".strength-text");

  // ---------- Cambio de pestañas ----------
  tabBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      const tab = btn.getAttribute("data-tab");
      tabBtns.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");

      document.querySelectorAll(".auth-form").forEach(form => form.classList.remove("active"));
      document.getElementById(`${tab}-form`).classList.add("active");
    });
  });

  // ---------- Toggle contraseña ----------
  togglePasswordBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      const input = btn.closest(".input-group").querySelector("input");
      if (input.type === "password") {
        input.type = "text";
        btn.classList.remove("fa-eye");
        btn.classList.add("fa-eye-slash");
      } else {
        input.type = "password";
        btn.classList.remove("fa-eye-slash");
        btn.classList.add("fa-eye");
      }
    });
  });

  // ---------- Login ----------
  loginForm.addEventListener("submit", async e => {
    e.preventDefault();
    const email = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    const rememberMe = document.getElementById("remember-me").checked;
    const loginBtn = loginForm.querySelector(".login-btn");
    
    loginBtn.classList.add("loading");

    try {
      const res = await fetch("http://localhost:3000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      loginBtn.classList.remove("loading");

      if (res.ok) {
        localStorage.setItem("loggedIn", true);
        localStorage.setItem("user", JSON.stringify(data.user));
        if (rememberMe) localStorage.setItem("rememberedUser", email);
        else localStorage.removeItem("rememberedUser");
        alert("¡Bienvenido a ValidAI!");
        window.location.href = "dashboard.html";
      } else {
        alert(data.message || "Usuario o contraseña incorrectos");
      }
    } catch (err) {
      loginBtn.classList.remove("loading");
      alert("No se pudo conectar con el servidor");
      console.error(err);
    }
  });

  // ---------- Registro ----------
  registerForm.addEventListener("submit", async e => {
    e.preventDefault();
    const fullname = document.getElementById("fullname").value;
    const email = document.getElementById("email").value;
    const usertype = document.getElementById("user-type").value;
    const password = document.getElementById("register-password").value;
    const confirmPassword = document.getElementById("confirm-password").value;
    const acceptTerms = document.getElementById("accept-terms").checked;
    const registerBtn = registerForm.querySelector(".register-btn");

    if (!acceptTerms) { alert("Debes aceptar los términos y condiciones"); return; }
    if (password !== confirmPassword) { alert("Las contraseñas no coinciden"); return; }

    registerBtn.classList.add("loading");

    try {
      const res = await fetch("http://localhost:3000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fullname, email, usertype, password })
      });
      const data = await res.json();
      registerBtn.classList.remove("loading");

      if (res.ok) {
        alert("¡Cuenta creada exitosamente!");
        registerForm.reset();
        // Auto-login
        localStorage.setItem("loggedIn", true);
        localStorage.setItem("user", JSON.stringify({ fullname, email, usertype }));
        window.location.href = "dashboard.html";
      } else {
        alert(data.message || "Error al registrar usuario");
      }
    } catch (err) {
      registerBtn.classList.remove("loading");
      alert("No se pudo conectar con el servidor");
      console.error(err);
    }
  });

  // ---------- Recuperación de contraseña ----------
  if (forgotPasswordLink) {
    forgotPasswordLink.addEventListener("click", e => {
      e.preventDefault();
      modal.classList.add("active");
      document.getElementById("recovery-email").focus();
    });
  }

  if (closeModal) closeModal.addEventListener("click", () => modal.classList.remove("active"));
  if (cancelBtn) cancelBtn.addEventListener("click", () => modal.classList.remove("active"));

  if (recoveryBtn) {
    recoveryBtn.addEventListener("click", async () => {
      const email = document.getElementById("recovery-email").value;
      if (!email) { alert("Ingresa tu email"); return; }

      recoveryBtn.classList.add("loading");
      try {
        // Aquí podrías conectar con tu endpoint de recuperación real
        await new Promise(r => setTimeout(r, 1500));
        recoveryBtn.classList.remove("loading");
        modal.classList.remove("active");
        alert(`Se ha enviado un enlace de recuperación a ${email}`);
      } catch (err) {
        recoveryBtn.classList.remove("loading");
        alert("No se pudo conectar con el servidor");
      }
    });
  }

  // ---------- Fuerza de contraseña ----------
  const registerPasswordInput = document.getElementById("register-password");
  if (registerPasswordInput) {
    registerPasswordInput.addEventListener("input", () => {
      const val = registerPasswordInput.value;
      let strength = 0;
      if (val.length >= 8) strength++;
      if (/[a-z]/.test(val) && /[A-Z]/.test(val)) strength++;
      if (/\d/.test(val)) strength++;
      if (/[^a-zA-Z0-9]/.test(val)) strength++;

      if (strengthFill) strengthFill.style.width = `${(strength/4)*100}%`;
      if (strengthText) {
        const texts = ["Muy débil", "Débil", "Regular", "Fuerte", "Muy fuerte"];
        strengthText.textContent = texts[strength];
      }
    });
  }

  // ---------- Cargar usuario recordado ----------
  const rememberedUser = localStorage.getItem("rememberedUser");
  if (rememberedUser) {
    document.getElementById("username").value = rememberedUser;
    document.getElementById("remember-me").checked = true;
  }
});
