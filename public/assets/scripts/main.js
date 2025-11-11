// main.js - Login mejorado para ValidAI

// LIMPIAR SESIÓN AL CARGAR EL LOGIN (por si acaso)
localStorage.removeItem("loggedIn");

document.addEventListener('DOMContentLoaded', function() {
  initializeLogin();
  setupEventListeners();
  loadSavedCredentials();
});

function initializeLogin() {
  console.log("Inicializando login de ValidAI...");
  
  // Verificar si ya está logueado (protección extra)
  if (localStorage.getItem("loggedIn") === "true") {
    window.location.href = "dashboard.html";
    return;
  }
  
  // Inicializar animaciones
  startBackgroundAnimations();
}

document.addEventListener('DOMContentLoaded', function() {
  initializeLogin();
  setupEventListeners();
  loadSavedCredentials();
});

function initializeLogin() {
  console.log("Inicializando login de ValidAI...");
  
  // Verificar si ya está logueado (protección extra)
  if (localStorage.getItem("loggedIn") === "true") {
    window.location.href = "dashboard.html";
    return;
  }
  
  // Inicializar animaciones
  startBackgroundAnimations();
}

function setupEventListeners() {
  const loginForm = document.getElementById("login-form");
  const registerForm = document.getElementById("register-form");
  const forgotPasswordLink = document.querySelector(".forgot-password");
  const modal = document.getElementById("forgot-password-modal");
  const closeModal = document.querySelector(".close-modal");
  const cancelBtn = document.querySelector(".cancel-btn");
  const recoveryBtn = document.querySelector(".recovery-btn");
  const tabBtns = document.querySelectorAll(".tab-btn");
  const togglePasswordBtns = document.querySelectorAll(".toggle-password");
  const registerPassword = document.getElementById("register-password");

  // Cambio entre pestañas
  tabBtns.forEach(btn => {
    btn.addEventListener("click", function() {
      const targetTab = this.getAttribute("data-tab");
      switchTab(targetTab);
    });
  });

  // Login form
  if (loginForm) {
    loginForm.addEventListener("submit", handleLogin);
  }

  // Register form
  if (registerForm) {
    registerForm.addEventListener("submit", handleRegister);
  }

  // Mostrar/ocultar contraseña
  togglePasswordBtns.forEach(btn => {
    btn.addEventListener("click", function() {
      const input = this.closest('.input-group').querySelector('input[type="password"]');
      togglePasswordVisibility(input, this);
    });
  });

  // Fuerza de contraseña
  if (registerPassword) {
    registerPassword.addEventListener("input", function() {
      checkPasswordStrength(this.value);
    });
  }

  // Modal de recuperación
  if (forgotPasswordLink) {
    forgotPasswordLink.addEventListener("click", function(e) {
      e.preventDefault();
      showModal();
    });
  }

  // Cerrar modal
  if (closeModal) {
    closeModal.addEventListener("click", hideModal);
  }

  if (cancelBtn) {
    cancelBtn.addEventListener("click", hideModal);
  }

  if (recoveryBtn) {
    recoveryBtn.addEventListener("click", handlePasswordRecovery);
  }

  // Cerrar modal al hacer clic fuera
  if (modal) {
    modal.addEventListener("click", function(e) {
      if (e.target === modal) {
        hideModal();
      }
    });
  }

  // Validación en tiempo real
  document.querySelectorAll('input').forEach(input => {
    input.addEventListener('blur', validateField);
    input.addEventListener('input', clearFieldError);
  });
}

function switchTab(tabName) {
  // Actualizar botones de pestaña
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.classList.remove('active');
  });
  document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');

  // Mostrar formulario correspondiente
  document.querySelectorAll('.auth-form').forEach(form => {
    form.classList.remove('active');
  });
  document.getElementById(`${tabName}-form`).classList.add('active');

  // Limpiar formularios al cambiar
  clearForms();
}

function handleLogin(e) {
  e.preventDefault();
  
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;
  const rememberMe = document.getElementById("remember-me").checked;

  // Validación básica
  if (!username || !password) {
    showNotification('Por favor, completa todos los campos', 'error');
    return;
  }

  // Mostrar loading
  const loginBtn = document.querySelector('.login-btn');
  loginBtn.classList.add('loading');

  // Simular proceso de login
  setTimeout(() => {
    // Credenciales de demo
    if ((username === "admin" && password === "1234") || 
        (username === "emprendedor" && password === "validai2025") ||
        (username === "estudiante" && password === "upc2025")) {
      
      // Guardar sesión
      localStorage.setItem("loggedIn", "true");
      localStorage.setItem("currentUser", username);
      
      if (rememberMe) {
        localStorage.setItem("rememberedUser", username);
      } else {
        localStorage.removeItem("rememberedUser");
      }
      
      // Track login exitoso
      trackLoginSuccess(username);
      
      // Redirigir al dashboard
      showNotification('¡Bienvenido a ValidAI!', 'success');
      setTimeout(() => {
        window.location.href = "dashboard.html";
      }, 1000);
      
    } else {
      loginBtn.classList.remove('loading');
      showNotification('Usuario o contraseña incorrectos', 'error');
      trackLoginFailed(username);
    }
  }, 1500);
}

function handleRegister(e) {
  e.preventDefault();
  
  const fullname = document.getElementById("fullname").value;
  const email = document.getElementById("email").value;
  const userType = document.getElementById("user-type").value;
  const password = document.getElementById("register-password").value;
  const confirmPassword = document.getElementById("confirm-password").value;
  const acceptTerms = document.getElementById("accept-terms").checked;

  // Validaciones
  if (!fullname || !email || !userType || !password || !confirmPassword) {
    showNotification('Por favor, completa todos los campos', 'error');
    return;
  }

  if (!acceptTerms) {
    showNotification('Debes aceptar los términos y condiciones', 'error');
    return;
  }

  if (password !== confirmPassword) {
    showNotification('Las contraseñas no coinciden', 'error');
    return;
  }

  if (password.length < 8) {
    showNotification('La contraseña debe tener al menos 8 caracteres', 'error');
    return;
  }

  // Mostrar loading
  const registerBtn = document.querySelector('.register-btn');
  registerBtn.classList.add('loading');

  // Simular registro
  setTimeout(() => {
    registerBtn.classList.remove('loading');
    
    // Guardar usuario de demo
    const userData = {
      fullname,
      email,
      userType,
      registrationDate: new Date().toISOString()
    };
    
    localStorage.setItem(`user_${email}`, JSON.stringify(userData));
    trackRegistration(userData);
    
    showNotification('¡Cuenta creada exitosamente! Redirigiendo...', 'success');
    
    // Auto-login después del registro
    setTimeout(() => {
      localStorage.setItem("loggedIn", "true");
      localStorage.setItem("currentUser", email);
      window.location.href = "dashboard.html";
    }, 1500);
    
  }, 2000);
}

function handlePasswordRecovery() {
  const email = document.getElementById("recovery-email").value;
  
  if (!email) {
    showNotification('Por favor ingresa tu email', 'error');
    return;
  }
  
  if (!isValidEmail(email)) {
    showNotification('Por favor ingresa un email válido', 'error');
    return;
  }
  
  const recoveryBtn = document.querySelector('.recovery-btn');
  recoveryBtn.classList.add('loading');
  
  // Simular envío de email
  setTimeout(() => {
    recoveryBtn.classList.remove('loading');
    hideModal();
    showNotification('Se ha enviado un enlace de recuperación a tu email', 'success');
    trackPasswordRecovery(email);
  }, 1500);
}

function togglePasswordVisibility(input, icon) {
  if (input.type === 'password') {
    input.type = 'text';
    icon.classList.remove('fa-eye');
    icon.classList.add('fa-eye-slash');
  } else {
    input.type = 'password';
    icon.classList.remove('fa-eye-slash');
    icon.classList.add('fa-eye');
  }
}

function checkPasswordStrength(password) {
  const strengthBar = document.querySelector('.strength-fill');
  const strengthText = document.querySelector('.strength-text');
  
  if (!strengthBar || !strengthText) return;
  
  let strength = 0;
  let feedback = '';
  
  if (password.length >= 8) strength++;
  if (password.match(/[a-z]/) && password.match(/[A-Z]/)) strength++;
  if (password.match(/\d/)) strength++;
  if (password.match(/[^a-zA-Z\d]/)) strength++;
  
  strengthBar.setAttribute('data-strength', strength);
  
  switch(strength) {
    case 0:
      feedback = 'Muy débil';
      break;
    case 1:
      feedback = 'Débil';
      break;
    case 2:
      feedback = 'Regular';
      break;
    case 3:
      feedback = 'Fuerte';
      break;
    case 4:
      feedback = 'Muy fuerte';
      break;
  }
  
  strengthText.textContent = feedback;
}

function validateField(e) {
  const field = e.target;
  const value = field.value.trim();
  
  if (!value) {
    field.classList.add('error');
    return false;
  }
  
  if (field.type === 'email' && !isValidEmail(value)) {
    field.classList.add('error');
    return false;
  }
  
  field.classList.remove('error');
  return true;
}

function clearFieldError(e) {
  e.target.classList.remove('error');
}

function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function showModal() {
  const modal = document.getElementById('forgot-password-modal');
  modal.classList.add('active');
  document.getElementById('recovery-email').focus();
}

function hideModal() {
  const modal = document.getElementById('forgot-password-modal');
  modal.classList.remove('active');
  document.getElementById('recovery-email').value = '';
}

function clearForms() {
  // Limpiar todos los formularios
  document.querySelectorAll('.auth-form input').forEach(input => {
    input.value = '';
    input.classList.remove('error');
  });
  
  // Resetear fuerza de contraseña
  const strengthBar = document.querySelector('.strength-fill');
  if (strengthBar) {
    strengthBar.setAttribute('data-strength', '0');
    document.querySelector('.strength-text').textContent = 'Seguridad de la contraseña';
  }
}

function showNotification(message, type = 'info') {
  // Crear notificación
  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  notification.innerHTML = `
    <div class="notification-content">
      <i class="fas fa-${getNotificationIcon(type)}"></i>
      <span>${message}</span>
    </div>
    <button class="notification-close">&times;</button>
  `;
  
  // Estilos para la notificación
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: ${getNotificationColor(type)};
    color: white;
    padding: 15px 20px;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    z-index: 10000;
    display: flex;
    align-items: center;
    gap: 10px;
    max-width: 400px;
    animation: slideInRight 0.3s ease;
  `;
  
  document.body.appendChild(notification);
  
  // Auto-remover después de 5 segundos
  setTimeout(() => {
    notification.style.animation = 'slideOutRight 0.3s ease';
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 300);
  }, 5000);
  
  // Cerrar manualmente
  notification.querySelector('.notification-close').addEventListener('click', () => {
    notification.style.animation = 'slideOutRight 0.3s ease';
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 300);
  });
}

function getNotificationIcon(type) {
  const icons = {
    success: 'check-circle',
    error: 'exclamation-circle',
    warning: 'exclamation-triangle',
    info: 'info-circle'
  };
  return icons[type] || 'info-circle';
}

function getNotificationColor(type) {
  const colors = {
    success: '#00C853',
    error: '#f44336',
    warning: '#FF9800',
    info: '#2196F3'
  };
  return colors[type] || '#2196F3';
}

function startBackgroundAnimations() {
  console.log('Animaciones de fondo iniciadas');
}

function loadSavedCredentials() {
  const rememberedUser = localStorage.getItem('rememberedUser');
  if (rememberedUser) {
    document.getElementById('username').value = rememberedUser;
    document.getElementById('remember-me').checked = true;
  }
}

// Funciones de analytics
function trackLoginSuccess(username) {
  console.log(`Login exitoso: ${username}`);
}

function trackLoginFailed(username) {
  console.log(`Login fallido intento para: ${username}`);
}

function trackRegistration(userData) {
  console.log('Nuevo registro:', userData);
}

function trackPasswordRecovery(email) {
  console.log(`Recuperación de contraseña solicitada para: ${email}`);
}

// Añadir estilos CSS para las animaciones de notificación
const style = document.createElement('style');
style.textContent = `
  @keyframes slideInRight {
    from {
      transform: translateX(100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
  
  @keyframes slideOutRight {
    from {
      transform: translateX(0);
      opacity: 1;
    }
    to {
      transform: translateX(100%);
      opacity: 0;
    }
  }
  
  .notification-close {
    background: none;
    border: none;
    color: white;
    font-size: 1.2rem;
    cursor: pointer;
    padding: 0;
    width: 20px;
    height: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;
document.head.appendChild(style);