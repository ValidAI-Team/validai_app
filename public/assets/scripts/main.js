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
        const res = await fetch("/api/auth/login", {
            method: "POST",
            headers: { 
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify({ email, password })
        });
        
        const data = await res.json();
        loginBtn.classList.remove("loading");

        if (data.success) {
            // ¡IMPORTANTE! Guardar TODOS los datos
            localStorage.setItem("loggedIn", "true");
            localStorage.setItem("authToken", data.token);
            localStorage.setItem("userData", JSON.stringify(data.user));
            localStorage.setItem("validAIUserProfile", JSON.stringify(data.user));
            
            if (rememberMe) {
                localStorage.setItem("rememberedUser", email);
            } else {
                localStorage.removeItem("rememberedUser");
            }
            
            console.log("✅ Login exitoso. Datos guardados:", data.user);
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

  registerForm.addEventListener("submit", async e => {
    e.preventDefault();
    
    const fullname = document.getElementById("fullname").value.trim();
    const email = document.getElementById("email").value.trim().toLowerCase();
    const usertype = document.getElementById("user-type").value;
    const password = document.getElementById("register-password").value;
    const confirmPassword = document.getElementById("confirm-password").value;
    const acceptTerms = document.getElementById("accept-terms").checked;
    const registerBtn = registerForm.querySelector(".register-btn");

    console.log("🔄 Intentando registro:", { fullname, email, usertype });

    // Validaciones
    if (!acceptTerms) { 
        showNotification("Debes aceptar los términos y condiciones", "error"); 
        return; 
    }
    
    if (!fullname || !email || !usertype || !password || !confirmPassword) {
        showNotification("Todos los campos son obligatorios", "error"); 
        return; 
    }
    
    if (password !== confirmPassword) { 
        showNotification("Las contraseñas no coinciden", "error"); 
        return; 
    }

    if (password.length < 6) {
        showNotification("La contraseña debe tener al menos 6 caracteres", "error");
        return;
    }

    // Validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showNotification("Por favor ingresa un email válido", "error");
        return;
    }

    registerBtn.classList.add("loading");

    try {
        const res = await fetch("/api/auth/register", {
            method: "POST",
            headers: { 
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify({ fullname, email, usertype, password })
        });
        
        console.log("📡 Respuesta del servidor (registro):", res.status);
        const data = await res.json();
        console.log("📦 Datos recibidos:", data);
        
        registerBtn.classList.remove("loading");

        if (data.success) {
            showNotification("¡Cuenta creada exitosamente! Redirigiendo...", "success");
            
            // Guardar datos del usuario automáticamente
            localStorage.setItem("loggedIn", "true");
            localStorage.setItem("authToken", data.token);
            localStorage.setItem("userData", JSON.stringify(data.user));
            
            // Redirigir después de 1.5 segundos
            setTimeout(() => {
                window.location.href = "dashboard.html";
            }, 1500);
            
            // Opcional: Limpiar formulario
            registerForm.reset();
            
        } else {
            showNotification(data.message || "Error al registrar usuario", "error");
        }
    } catch (err) {
        registerBtn.classList.remove("loading");
        console.error("💥 Error en registro:", err);
        showNotification("No se pudo conectar con el servidor", "error");
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
      if (!email) { 
        showNotification("Ingresa tu email", "error"); 
        return; 
      }

      recoveryBtn.classList.add("loading");
      try {
        // Simulamos el envío del email
        await new Promise(r => setTimeout(r, 1500));
        recoveryBtn.classList.remove("loading");
        modal.classList.remove("active");
        showNotification(`Se ha enviado un enlace de recuperación a ${email}`, "success");
      } catch (err) {
        recoveryBtn.classList.remove("loading");
        showNotification("No se pudo conectar con el servidor", "error");
        console.error("Error en recuperación:", err);
      }
    });
  }

  // ---------- Fuerza de contraseña (MEJORADA) ----------
const registerPasswordInput = document.getElementById("register-password");
if (registerPasswordInput) {
    registerPasswordInput.addEventListener("input", () => {
        const val = registerPasswordInput.value;
        let strength = 0;
        
        // Validaciones más detalladas
        if (val.length >= 6) strength++;
        if (val.length >= 8) strength++; // Extra punto por longitud
        if (val.length >= 12) strength++; // Otro punto por longitud extra
        
        if (/[a-z]/.test(val)) strength++; // Minúsculas
        if (/[A-Z]/.test(val)) strength++; // Mayúsculas
        if (/\d/.test(val)) strength++;    // Números
        if (/[^a-zA-Z0-9]/.test(val)) strength++; // Símbolos

        // Limitar a 5 niveles máximo
        strength = Math.min(strength, 5);
        
        if (strengthFill) {
            const percentage = (strength / 5) * 100;
            strengthFill.style.width = `${percentage}%`;
            
            // Cambiar color y texto según fuerza
            let color, text, bgColor;
            if (val.length === 0) {
                color = "#6c757d"; // Gris
                text = "Ingresa una contraseña";
                bgColor = "#e9ecef";
            } else if (strength <= 1) {
                color = "#ef476f"; // Rojo
                text = "Muy débil";
                bgColor = "#ef476f";
            } else if (strength === 2) {
                color = "#ff9e00"; // Naranja
                text = "Débil";
                bgColor = "#ff9e00";
            } else if (strength === 3) {
                color = "#ffd166"; // Amarillo
                text = "Regular";
                bgColor = "#ffd166";
            } else if (strength === 4) {
                color = "#06d6a0"; // Verde
                text = "Fuerte";
                bgColor = "#06d6a0";
            } else {
                color = "#118ab2"; // Azul fuerte
                text = "Muy fuerte";
                bgColor = "#118ab2";
            }
            
            strengthFill.style.backgroundColor = bgColor;
            strengthFill.style.transition = "all 0.3s ease";
            
            if (strengthText) {
                strengthText.textContent = text;
                strengthText.style.color = color;
                strengthText.style.fontWeight = "600";
                
                // Mostrar sugerencias
                const suggestions = document.getElementById("password-suggestions");
                if (!suggestions) {
                    createPasswordSuggestions();
                }
                updatePasswordSuggestions(val);
            }
        }
    });
    
    // También evaluar cuando se pega texto
    registerPasswordInput.addEventListener("paste", (e) => {
        setTimeout(() => {
            registerPasswordInput.dispatchEvent(new Event("input"));
        }, 10);
    });
}

// Función para crear sugerencias de contraseña
function createPasswordSuggestions() {
    const passwordGroup = document.querySelector('#register-password').closest('.input-group');
    const suggestions = document.createElement('div');
    suggestions.id = "password-suggestions";
    suggestions.className = "password-suggestions";
    suggestions.innerHTML = `
        <div class="suggestion-item" data-check="length">
            <i class="fas fa-check"></i>
            <span>Al menos 6 caracteres</span>
        </div>
        <div class="suggestion-item" data-check="uppercase">
            <i class="fas fa-check"></i>
            <span>Incluir mayúsculas</span>
        </div>
        <div class="suggestion-item" data-check="number">
            <i class="fas fa-check"></i>
            <span>Incluir números</span>
        </div>
        <div class="suggestion-item" data-check="symbol">
            <i class="fas fa-check"></i>
            <span>Incluir símbolos (!@#$%)</span>
        </div>
    `;
    passwordGroup.appendChild(suggestions);
    
    // Agregar estilos
    const style = document.createElement('style');
    style.textContent = `
        .password-suggestions {
            margin-top: 10px;
            padding: 10px;
            background: #f8f9fa;
            border-radius: 6px;
            border: 1px solid #dee2e6;
        }
        .suggestion-item {
            display: flex;
            align-items: center;
            gap: 8px;
            margin: 5px 0;
            font-size: 13px;
            color: #6c757d;
        }
        .suggestion-item i {
            font-size: 12px;
            color: #adb5bd;
        }
        .suggestion-item.valid i {
            color: #06d6a0;
        }
        .suggestion-item.valid span {
            color: #06d6a0;
            font-weight: 500;
        }
    `;
    document.head.appendChild(style);
}

// Función para actualizar sugerencias
function updatePasswordSuggestions(password) {
    const suggestions = {
        length: password.length >= 6,
        uppercase: /[A-Z]/.test(password),
        number: /\d/.test(password),
        symbol: /[^a-zA-Z0-9]/.test(password)
    };
    
    Object.keys(suggestions).forEach(key => {
        const item = document.querySelector(`[data-check="${key}"]`);
        if (item) {
            if (suggestions[key]) {
                item.classList.add("valid");
                item.querySelector("i").className = "fas fa-check-circle";
            } else {
                item.classList.remove("valid");
                item.querySelector("i").className = "fas fa-check";
            }
        }
    });
}

  // ---------- Cargar usuario recordado ----------
  const rememberedUser = localStorage.getItem("rememberedUser");
  if (rememberedUser) {
    document.getElementById("username").value = rememberedUser;
    document.getElementById("remember-me").checked = true;
  }

  // ---------- Función para mostrar notificaciones ----------
  function showNotification(message, type = "info") {
    // Crear elemento de notificación
    const notification = document.createElement("div");
    notification.className = `notification ${type}`;
    notification.innerHTML = `
      <span>${message}</span>
      <button class="close-notification">&times;</button>
    `;
    
    // Estilos para la notificación
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      padding: 15px 20px;
      border-radius: 8px;
      color: white;
      font-weight: 500;
      z-index: 10000;
      display: flex;
      align-items: center;
      justify-content: space-between;
      min-width: 300px;
      max-width: 400px;
      animation: slideIn 0.3s ease;
      box-shadow: 0 4px 15px rgba(0,0,0,0.2);
    `;
    
    // Colores según tipo
    if (type === "success") {
      notification.style.background = "linear-gradient(135deg, #06d6a0 0%, #05c592 100%)";
    } else if (type === "error") {
      notification.style.background = "linear-gradient(135deg, #ef476f 0%, #e63946 100%)";
    } else if (type === "warning") {
      notification.style.background = "linear-gradient(135deg, #ffd166 0%, #ffc43d 100%)";
      notification.style.color = "#333";
    } else {
      notification.style.background = "linear-gradient(135deg, #118ab2 0%, #0c7a99 100%)";
    }
    
    // Agregar animación
    const style = document.createElement("style");
    style.textContent = `
      @keyframes slideIn {
        from {
          transform: translateX(100%);
          opacity: 0;
        }
        to {
          transform: translateX(0);
          opacity: 1;
        }
      }
      
      .close-notification {
        background: none;
        border: none;
        color: inherit;
        font-size: 20px;
        cursor: pointer;
        margin-left: 10px;
        padding: 0;
        width: 24px;
        height: 24px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
        transition: background-color 0.2s;
      }
      
      .close-notification:hover {
        background-color: rgba(255,255,255,0.2);
      }
    `;
    document.head.appendChild(style);
    
    // Agregar al DOM
    document.body.appendChild(notification);
    
    // Botón para cerrar
    const closeBtn = notification.querySelector(".close-notification");
    closeBtn.addEventListener("click", () => {
      notification.style.animation = "slideIn 0.3s ease reverse";
      setTimeout(() => notification.remove(), 300);
    });
    
    // Auto-remover después de 5 segundos
    setTimeout(() => {
      if (notification.parentNode) {
        notification.style.animation = "slideIn 0.3s ease reverse";
        setTimeout(() => notification.remove(), 300);
      }
    }, 5000);
  }

  // ---------- Precargar datos de usuario para pruebas ----------
  function autoFillCredentials() {
    // Verificar si estamos en modo desarrollo
    const urlParams = new URLSearchParams(window.location.search);
    const testUser = urlParams.get('test');
    
    if (testUser) {
      const users = {
        'juan': { email: 'juan@validai.com', password: 'password123' },
        'maria': { email: 'maria@validai.com', password: 'password456' },
        'carlos': { email: 'carlos@validai.com', password: 'password789' },
        'ana': { email: 'ana@validai.com', password: 'password101' },
        'admin': { email: 'admin@validai.com', password: 'admin123' }
      };
      
      if (users[testUser]) {
        document.getElementById('username').value = users[testUser].email;
        document.getElementById('password').value = users[testUser].password;
        
        // Cambiar a pestaña de login si no está activa
        if (!document.querySelector('.tab-btn[data-tab="login"]').classList.contains('active')) {
          document.querySelector('.tab-btn[data-tab="login"]').click();
        }
      }
    }
  }
  
  // Ejecutar auto-fill
  autoFillCredentials();

  // ---------- Event listener para tecla Enter ----------
  document.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      const activeForm = document.querySelector('.auth-form.active');
      if (activeForm) {
        const submitBtn = activeForm.querySelector('.btn');
        if (submitBtn) submitBtn.click();
      }
    }
  });
});

// Función para limpiar el formulario de registro
function clearRegisterForm() {
    document.getElementById("fullname").value = "";
    document.getElementById("email").value = "";
    document.getElementById("user-type").selectedIndex = 0;
    document.getElementById("register-password").value = "";
    document.getElementById("confirm-password").value = "";
    document.getElementById("accept-terms").checked = false;
    
    // Resetear barra de fuerza de contraseña
    if (strengthFill) {
        strengthFill.style.width = "0%";
    }
    if (strengthText) {
        strengthText.textContent = "Seguridad de la contraseña";
    }
}