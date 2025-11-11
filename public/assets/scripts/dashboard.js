// dashboard.js - Funcionalidades mejoradas
console.log("Dashboard ValidAI cargado correctamente");

// Inicialización del Dashboard
document.addEventListener('DOMContentLoaded', function() {
  // Verificación de sesión al cargar
  if (!localStorage.getItem("loggedIn")) {
    window.location.href = "index.html";
    return;
  }
  
  initializeDashboard();
  loadUserData();
  setupEventListeners();
});

function initializeDashboard() {
  console.log("Inicializando dashboard ValidAI...");
  
  // Actualizar estadísticas en tiempo real
  updateRealTimeStats();
  
  // Inicializar círculos de progreso
  initProgressCircles();
  
  // Simular datos de mercado
  simulateMarketData();
}

function loadUserData() {
  // Cargar datos del usuario desde localStorage
  const username = localStorage.getItem('currentUser') || 'Emprendedor';
  document.getElementById('username').textContent = username;
  
  // Cargar estadísticas del usuario
  const userStats = JSON.parse(localStorage.getItem('userStats')) || {
    ideasCount: 3,
    successRate: 85
  };
  
  document.getElementById('ideas-count').textContent = userStats.ideasCount;
  document.getElementById('success-rate').textContent = userStats.successRate + '%';
}

function setupEventListeners() {
  // Navegación entre herramientas
  document.querySelectorAll('.tool-card').forEach(card => {
    card.addEventListener('click', function() {
      if (!this.classList.contains('coming-soon')) {
        const toolName = this.querySelector('h4').textContent;
        trackToolUsage(toolName);
        
        // Redirigir según la herramienta
        if (toolName === 'Análisis Competitivo') {
          window.location.href = 'analysis.html';
        }
      }
    });
  });
  
  // Botones de acción rápida
  document.querySelectorAll('.action-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      if (!this.classList.contains('coming-soon')) {
        const action = this.querySelector('span').textContent;
        console.log(`Acción realizada: ${action}`);
        
        if (action === 'Nueva Validación') {
          window.location.href = 'analysis.html';
        }
      }
    });
  });
  
  // Notificaciones
  document.querySelectorAll('.notification-item').forEach(notification => {
    notification.addEventListener('click', function() {
      this.classList.remove('new');
      updateNotificationBadge();
    });
  });
  
  // Botones educativos
  document.querySelectorAll('.edu-btn').forEach(btn => {
    btn.addEventListener('click', function(e) {
      if (this.classList.contains('coming-soon')) {
        e.preventDefault();
        showNotification('Esta funcionalidad estará disponible próximamente', 'info');
      }
    });
  });
  
  // Logout functionality
  const logout = document.getElementById("logout");
  if (logout) {
    logout.addEventListener("click", (e) => {
      e.preventDefault();
      localStorage.removeItem("loggedIn");
      localStorage.removeItem("currentUser");
      showNotification('Sesión cerrada correctamente', 'success');
      setTimeout(() => {
        window.location.href = "index.html";
      }, 1000);
    });
  }
}

function updateRealTimeStats() {
  // Simular actualización de estadísticas en tiempo real
  setInterval(() => {
    const ideasCount = document.getElementById('ideas-count');
    const currentCount = parseInt(ideasCount.textContent);
    
    // Simular nuevo análisis ocasionalmente
    if (Math.random() < 0.01) { // 1% de probabilidad cada intervalo
      ideasCount.textContent = currentCount + 1;
      showNewIdeaNotification();
      
      // Actualizar localStorage
      const userStats = JSON.parse(localStorage.getItem('userStats')) || { ideasCount: 3, successRate: 85 };
      userStats.ideasCount = currentCount + 1;
      localStorage.setItem('userStats', JSON.stringify(userStats));
    }
  }, 10000); // Actualizar cada 10 segundos
}

function initProgressCircles() {
  document.querySelectorAll('.progress-circle').forEach(circle => {
    const progress = circle.getAttribute('data-progress');
    circle.style.background = `conic-gradient(var(--green) ${progress}%, #e9ecef 0)`;
    
    // Agregar texto de progreso
    const progressText = document.createElement('span');
    progressText.textContent = `${progress}%`;
    progressText.style.fontSize = '0.6rem';
    progressText.style.fontWeight = '600';
    circle.appendChild(progressText);
  });
}

function simulateMarketData() {
  // Simular fluctuaciones del mercado
  setInterval(() => {
    document.querySelectorAll('.metric-value').forEach(metric => {
      const currentValue = parseInt(metric.textContent);
      const change = Math.floor(Math.random() * 5) - 2; // Cambio de -2% a +2%
      const newValue = Math.max(0, Math.min(100, currentValue + change));
      metric.textContent = newValue + '%';
      
      // Actualizar tendencia
      const trendElement = metric.closest('.metric-card').querySelector('.metric-trend');
      if (trendElement) {
        trendElement.textContent = change >= 0 ? `+${change}%` : `${change}%`;
        trendElement.className = `metric-trend ${change >= 0 ? 'up' : 'down'}`;
      }
    });
  }, 15000); // Actualizar cada 15 segundos
}

function trackToolUsage(toolName) {
  console.log(`Herramienta utilizada: ${toolName}`);
  const analyticsData = {
    tool: toolName,
    timestamp: new Date().toISOString(),
    user: localStorage.getItem('currentUser')
  };
  
  // Guardar en localStorage para demo
  const usageHistory = JSON.parse(localStorage.getItem('toolUsage') || '[]');
  usageHistory.push(analyticsData);
  localStorage.setItem('toolUsage', JSON.stringify(usageHistory));
  
  showNotification(`Herramienta "${toolName}" iniciada`, 'info');
}

function showNewIdeaNotification() {
  // Mostrar notificación de nueva idea (simulación)
  const notification = document.createElement('div');
  notification.className = 'notification-item new';
  notification.innerHTML = `
    <div class="notification-icon">
      <i class="fas fa-lightbulb"></i>
    </div>
    <div class="notification-content">
      <p><strong>Nueva validación completada:</strong> Análisis automatizado finalizado</p>
      <span class="notification-time">Justo ahora</span>
    </div>
  `;
  
  document.querySelector('.notifications-list').prepend(notification);
  updateNotificationBadge();
  
  // Agregar funcionalidad de click
  notification.addEventListener('click', function() {
    this.classList.remove('new');
    updateNotificationBadge();
    showNotification('Redirigiendo a análisis...', 'info');
    setTimeout(() => {
      window.location.href = 'analysis.html';
    }, 1000);
  });
}

function updateNotificationBadge() {
  const newNotifications = document.querySelectorAll('.notification-item.new').length;
  const badge = document.querySelector('.notification-badge');
  
  if (badge) {
    if (newNotifications > 0) {
      badge.textContent = newNotifications;
      badge.style.display = 'inline-block';
    } else {
      badge.style.display = 'none';
    }
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

// Añadir estilos CSS para las animaciones de notificación si no existen
if (!document.querySelector('#notification-styles')) {
  const style = document.createElement('style');
  style.id = 'notification-styles';
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
}

// Inicializar notificaciones al cargar
updateNotificationBadge();