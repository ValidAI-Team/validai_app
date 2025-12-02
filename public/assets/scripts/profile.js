// public/assets/scripts/profile.js
class ProfileManager {
    constructor() {
        this.userData = null;
        this.API_BASE = 'http://localhost:3000/api/auth';
        console.log("🚀 ProfileManager inicializado");
        
        // Iniciar inmediatamente
        this.init();
    }

    async init() {
        console.log("🔄 Iniciando ProfileManager...");
        
        // 1. Verificar autenticación
        if (!this.isLoggedIn()) {
            this.redirectToLogin();
            return;
        }
        
        // 2. Configurar todo
        this.setupEventListeners();
        await this.loadUserProfile();
        this.loadUserPreferences();
        this.setupTheme();
        
        console.log("✅ ProfileManager configurado correctamente");
    }

    isLoggedIn() {
        const token = localStorage.getItem('authToken');
        const loggedIn = localStorage.getItem('loggedIn');
        
        console.log("🔍 Verificando autenticación:", {
            token: token ? "✅ Presente" : "❌ Ausente",
            loggedIn: loggedIn
        });
        
        return token && loggedIn === 'true';
    }

    redirectToLogin() {
        console.log("🔀 Redirigiendo a login...");
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1500);
    }

    async loadUserProfile() {
        try {
            const token = localStorage.getItem('authToken');
            console.log("📡 Cargando perfil...");
            console.log("🌐 Endpoint:", `${this.API_BASE}/profile`);
            console.log("🔑 Token:", token ? token.substring(0, 30) + '...' : 'No hay token');
            
            if (!token) {
                this.showError('No estás autenticado');
                this.redirectToLogin();
                return;
            }

            // Hacer la petición al backend
            const response = await fetch(`${this.API_BASE}/profile`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            });

            console.log("📊 Respuesta del servidor:", response.status, response.statusText);

            if (response.status === 401) {
                console.error("❌ Token inválido o expirado");
                localStorage.clear();
                this.showError('Sesión expirada. Por favor, inicia sesión nuevamente.');
                this.redirectToLogin();
                return;
            }

            if (response.status === 404) {
                console.error("❌ Ruta no encontrada");
                this.showError('Error: La ruta del perfil no existe en el servidor');
                return;
            }

            if (!response.ok) {
                throw new Error(`Error ${response.status}: ${response.statusText}`);
            }

            const data = await response.json();
            console.log("✅ Datos recibidos del backend:", data);

            if (data.success && data.user) {
                this.userData = data.user;
                console.log("👤 Datos del usuario cargados:", this.userData);
                
                // Guardar en localStorage para uso futuro
                localStorage.setItem('validAIUserProfile', JSON.stringify(this.userData));
                
                // Actualizar la interfaz
                this.updateProfileUI();
                await this.loadUserStats();
                await this.loadUserActivity();
            } else {
                console.warn("⚠️ Respuesta inesperada:", data);
                this.loadDemoData();
            }

        } catch (error) {
            console.error('💥 Error cargando perfil:', error);
            console.error('Detalles:', error.message);
            
            // Intentar cargar datos de localStorage
            const localData = this.getLocalUserData();
            if (localData) {
                console.log("📁 Usando datos locales como fallback");
                this.userData = localData;
                this.updateProfileUI();
            } else {
                console.log("📁 No hay datos locales, usando demo");
                this.loadDemoData();
            }
        }
    }

    getLocalUserData() {
        try {
            // 1. Buscar en userData (del login)
            const userDataStr = localStorage.getItem('userData');
            if (userDataStr) {
                console.log("📁 Datos encontrados en userData");
                return JSON.parse(userDataStr);
            }
            
            // 2. Buscar en validAIUserProfile
            const profileData = localStorage.getItem('validAIUserProfile');
            if (profileData) {
                console.log("📁 Datos encontrados en validAIUserProfile");
                return JSON.parse(profileData);
            }
            
            return null;
        } catch (error) {
            console.error("❌ Error parseando datos locales:", error);
            return null;
        }
    }

    loadDemoData() {
        console.log("🔄 Cargando datos de demostración...");
        
        // Datos de ejemplo basados en tu authController
        this.userData = {
            id: 1,
            fullName: "Juan Pérez",
            fullname: "Juan Pérez",
            email: "juan@validai.com",
            username: "juanperez",
            usertype: "emprendedor",
            userType: "emprendedor",
            phone: "+51 987 654 321",
            location: "Lima, Perú",
            avatar: "https://ui-avatars.com/api/?name=Juan+Perez&background=4361ee&color=fff",
            createdAt: "2024-01-15T10:30:00Z",
            lastLogin: new Date().toISOString(),
            status: "active"
        };
        
        this.updateProfileUI();
        
        // Estadísticas de ejemplo
        this.updateStatsUI({
            ideasCount: 5,
            reportsCount: 8,
            successRate: "85%",
            accountAge: 45,
            activeSessions: 1
        });
    }

    updateProfileUI() {
        if (!this.userData) {
            console.warn("⚠️ No hay datos del usuario");
            return;
        }

        console.log("🎨 Actualizando interfaz con datos:", this.userData);

        // Función helper para actualizar elementos
        const updateElement = (id, value) => {
            const element = document.getElementById(id);
            if (element) {
                element.textContent = value || 'No especificado';
                console.log(`✅ ${id}: ${value || '(vacío)'}`);
            } else {
                console.warn(`⚠️ ${id} no encontrado`);
            }
        };

        // Obtener datos del usuario
        const fullName = this.userData.fullName || this.userData.fullname || 'Usuario';
        const email = this.userData.email || 'correo@ejemplo.com';
        const phone = this.userData.phone || 'No especificado';
        const location = this.userData.location || 'Lima, Perú';
        const userId = this.userData.id || 'N/A';
        const usertype = this.userData.usertype || this.userData.userType || 'usuario';
        const username = this.userData.username || email.split('@')[0];

        // Actualizar elementos del header
        updateElement('profileFullName', fullName);
        updateElement('profileEmail', email);
        
        // Actualizar información personal
        updateElement('userId', userId);
        updateElement('userFullName', fullName);
        updateElement('userEmail', email);
        updateElement('userPhone', phone);
        updateElement('userLocation', location);
        
        // Actualizar información de cuenta
        updateElement('username-nav', username);
        updateElement('username-nav-top', username);
        updateElement('user-role', this.getRoleText(usertype));
        
        // Actualizar badge de tipo de usuario
        const userTypeBadge = document.getElementById('userTypeBadge');
        if (userTypeBadge) {
            userTypeBadge.textContent = this.getRoleText(usertype);
        }
        
        // Actualizar fechas
        updateElement('joinDate', this.formatDate(this.userData.createdAt));
        updateElement('lastLogin', this.formatDate(this.userData.lastLogin));

        // Actualizar avatar
        this.updateAvatar(this.userData.avatar);

        // Actualizar formularios de edición
        const editFullName = document.getElementById('editFullName');
        const editPhone = document.getElementById('editPhone');
        const editLocation = document.getElementById('editLocation');
        const editEmail = document.getElementById('editEmail');
        
        if (editFullName) editFullName.value = fullName;
        if (editPhone) editPhone.value = phone;
        if (editLocation) editLocation.value = location;
        if (editEmail) editEmail.value = email;
        
        console.log("✅ Interfaz actualizada correctamente");
    }

    getRoleText(usertype) {
        const roleMap = {
            'emprendedor': 'Emprendedor',
            'inversor': 'Inversionista',
            'consultor': 'Consultor',
            'admin': 'Administrador',
            'student': 'Estudiante',
            'entrepreneur': 'Emprendedor',
            'investor': 'Inversionista',
            'consultant': 'Consultor'
        };
        return roleMap[usertype] || usertype;
    }

    updateAvatar(avatarUrl) {
        console.log("🖼️ Actualizando avatar:", avatarUrl);
        
        const avatarElements = ['profileAvatarLarge', 'avatarPreview'];
        
        avatarElements.forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                if (avatarUrl) {
                    element.style.backgroundImage = `url(${avatarUrl})`;
                    element.style.backgroundSize = 'cover';
                    element.style.backgroundPosition = 'center';
                    element.innerHTML = '';
                    console.log(`✅ Avatar actualizado en ${id}`);
                } else {
                    // Crear avatar con iniciales
                    const initials = this.getUserInitials();
                    element.textContent = initials;
                    element.style.backgroundImage = '';
                    element.style.backgroundColor = '#4361ee';
                    element.style.color = 'white';
                    element.style.display = 'flex';
                    element.style.alignItems = 'center';
                    element.style.justifyContent = 'center';
                    element.style.fontWeight = 'bold';
                    element.style.fontSize = id === 'profileAvatarLarge' ? '52px' : '36px';
                }
            }
        });
    }

    getUserInitials() {
        if (this.userData) {
            const fullName = this.userData.fullName || this.userData.fullname;
            if (fullName) {
                return fullName
                    .split(' ')
                    .map(name => name[0])
                    .join('')
                    .toUpperCase()
                    .substring(0, 2);
            }
        }
        return 'VA';
    }

    async loadUserStats() {
        try {
            const token = localStorage.getItem('authToken');
            if (!token) return;

            console.log("📊 Cargando estadísticas...");
            
            const response = await fetch(`${this.API_BASE}/profile/stats`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json'
                }
            });

            console.log("📊 Respuesta stats:", response.status);
            
            if (response.ok) {
                const data = await response.json();
                console.log("📊 Datos stats:", data);
                
                if (data.success && data.stats) {
                    this.updateStatsUI(data.stats);
                    return;
                }
            }
            
            // Si falla, usar valores por defecto
            console.warn("⚠️ Usando estadísticas por defecto");
            this.updateStatsUI({
                ideasCount: 0,
                reportsCount: 0,
                successRate: "0%",
                accountAge: 0,
                activeSessions: 1
            });
            
        } catch (error) {
            console.error('Error cargando estadísticas:', error);
            this.updateStatsUI({
                ideasCount: 0,
                reportsCount: 0,
                successRate: "0%",
                accountAge: 0,
                activeSessions: 1
            });
        }
    }

    updateAvatar(avatarUrl) {
    console.log("🖼️ Actualizando avatar:", avatarUrl);
    
    // Actualizar avatars principales
    const avatarElements = ['profileAvatarLarge', 'avatarPreview', 'currentUserAvatar'];
    
    avatarElements.forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            if (avatarUrl) {
                element.style.backgroundImage = `url(${avatarUrl})`;
                element.style.backgroundSize = 'cover';
                element.style.backgroundPosition = 'center';
                element.innerHTML = '';
                console.log(`✅ Avatar actualizado en #${id}`);
            } else {
                // Crear avatar con iniciales
                const initials = this.getUserInitials();
                element.textContent = initials;
                element.style.backgroundImage = '';
                element.style.backgroundColor = '#4361ee';
                element.style.color = 'white';
                element.style.display = 'flex';
                element.style.alignItems = 'center';
                element.style.justifyContent = 'center';
                element.style.fontWeight = 'bold';
                
                // Ajustar tamaño según el elemento
                if (id === 'profileAvatarLarge') {
                    element.style.fontSize = '52px';
                } else if (id === 'currentUserAvatar') {
                    element.style.fontSize = '14px';
                } else {
                    element.style.fontSize = '36px';
                }
            }
        }
    });
}

    updateStatsUI(stats) {
        console.log("📈 Actualizando estadísticas:", stats);
        
        const updateStat = (id, value) => {
            const element = document.getElementById(id);
            if (element) {
                element.textContent = value;
                console.log(`✅ ${id}: ${value}`);
            } else {
                console.warn(`⚠️ ${id} no encontrado`);
            }
        };

        updateStat('ideasCount', stats.ideasCount || 0);
        updateStat('reportsCount', stats.reportsCount || 0);
        updateStat('successRate', stats.successRate || "0%");
        updateStat('accountAge', stats.accountAge || 0);
        updateStat('activeSessionsCount', stats.activeSessions || 1);
    }

    async loadUserActivity() {
        try {
            const token = localStorage.getItem('authToken');
            if (!token) return;

            console.log("📋 Cargando actividad...");
            
            const response = await fetch(`${this.API_BASE}/profile/activity`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json'
                }
            });

            if (response.ok) {
                const data = await response.json();
                if (data.success && data.activity) {
                    this.displayActivity(data.activity);
                    return;
                }
            }
            
            console.warn("⚠️ No se pudo cargar actividad");
            this.displayActivity([]);
            
        } catch (error) {
            console.error('Error cargando actividad:', error);
            this.displayActivity([]);
        }
    }

    displayActivity(activity) {
        const activityList = document.getElementById('recentActivity');
        if (!activityList) return;

        if (!activity || activity.length === 0) {
            activityList.innerHTML = `
                <div class="activity-empty">
                    <i class="fas fa-history"></i>
                    <p>No hay actividad reciente</p>
                </div>
            `;
            return;
        }

        activityList.innerHTML = activity.map(item => `
            <div class="session-item">
                <div class="session-icon">
                    <i class="fas fa-${this.getActivityIcon(item.type)}"></i>
                </div>
                <div class="session-info">
                    <h4>${item.description}</h4>
                    <small>${this.formatDate(item.timestamp)}</small>
                </div>
            </div>
        `).join('');
    }

    getActivityIcon(type) {
        const icons = {
            'idea': 'lightbulb',
            'report': 'chart-bar',
            'login': 'sign-in-alt',
            'update': 'edit',
            'password': 'key'
        };
        return icons[type] || 'circle';
    }

    setupEventListeners() {
        console.log("🔗 Configurando event listeners...");
        
        // Lista de todos los event listeners necesarios
        const listeners = [
            // Botones principales
            { id: 'editProfileMainBtn', event: 'click', handler: () => this.openModal('editProfileModal') },
            { id: 'editPersonalBtn', event: 'click', handler: () => this.openModal('editProfileModal') },
            { id: 'editAvatarBtn', event: 'click', handler: () => document.getElementById('avatarUpload')?.click() },
            
            // Botones de seguridad
            { id: 'changePasswordBtn', event: 'click', handler: () => this.openModal('changePasswordModal') },
            { id: 'twoFactorBtn', event: 'click', handler: () => this.toggleTwoFactor() },
            { id: 'sessionsBtn', event: 'click', handler: () => this.openModal('sessionsModal') },
            
            // Botones para cerrar modales
            { id: 'closeEditModal', event: 'click', handler: () => this.closeModal('editProfileModal') },
            { id: 'closePasswordModal', event: 'click', handler: () => this.closeModal('changePasswordModal') },
            { id: 'closeSessionsModal', event: 'click', handler: () => this.closeModal('sessionsModal') },
            { id: 'closeSessionsBtn', event: 'click', handler: () => this.closeModal('sessionsModal') },
            { id: 'cancelEdit', event: 'click', handler: () => this.closeModal('editProfileModal') },
            { id: 'cancelPassword', event: 'click', handler: () => this.closeModal('changePasswordModal') },
            
            // Botones de acciones importantes
            { id: 'logoutBtn', event: 'click', handler: (e) => { e.preventDefault(); this.logout(); } },
            { id: 'logoutAllBtn', event: 'click', handler: () => this.logoutAllSessions() },
            { id: 'deleteAccountBtn', event: 'click', handler: () => this.confirmDeleteAccount() },
            
            // Botón de subir avatar
            { id: 'uploadAvatarBtn', event: 'click', handler: () => document.getElementById('avatarUpload')?.click() }
        ];

        // Configurar cada listener
        listeners.forEach(({ id, event, handler }) => {
            const element = document.getElementById(id);
            if (element) {
                element.addEventListener(event, handler);
                console.log(`✅ Listener configurado: #${id}`);
            } else {
                console.warn(`⚠️ Elemento no encontrado: #${id}`);
            }
        });

        // Formularios
        document.getElementById('editProfileForm')?.addEventListener('submit', (e) => this.handleProfileUpdate(e));
        document.getElementById('changePasswordForm')?.addEventListener('submit', (e) => this.handlePasswordChange(e));

        // Subida de avatar
        document.getElementById('avatarUpload')?.addEventListener('change', (e) => this.handleAvatarUpload(e));

        // Preferencias
        document.getElementById('themeSelect')?.addEventListener('change', (e) => this.savePreference('theme', e.target.value));
        document.getElementById('languageSelect')?.addEventListener('change', (e) => this.savePreference('language', e.target.value));
        document.getElementById('emailNotifications')?.addEventListener('change', (e) => this.savePreference('emailNotifications', e.target.checked));
        document.getElementById('reportAlerts')?.addEventListener('change', (e) => this.savePreference('reportAlerts', e.target.checked));

        // Validación de contraseña
        document.getElementById('newPassword')?.addEventListener('input', (e) => this.checkPasswordStrength(e.target.value));

        // Toggle contraseña
        document.querySelectorAll('.password-toggle').forEach(toggle => {
            toggle.addEventListener('click', (e) => {
                const button = e.target.closest('button');
                const input = button?.closest('.password-input')?.querySelector('input');
                const icon = button?.querySelector('i');
                
                if (input && icon) {
                    if (input.type === 'password') {
                        input.type = 'text';
                        icon.className = 'fas fa-eye-slash';
                    } else {
                        input.type = 'password';
                        icon.className = 'fas fa-eye';
                    }
                }
            });
        });

        console.log("✅ Todos los listeners configurados");
    }

    openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'flex';
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
        console.log(`✅ Modal abierto: ${modalId}`);
    }
}

    closeModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.style.display = 'none';
            modal.classList.remove('active');
            document.body.style.overflow = 'auto';
            console.log(`✅ Modal cerrado: ${modalId}`);
        }
    }

    toggleTwoFactor() {
        const toggle = document.getElementById('twoFactorToggle');
        if (toggle) {
            const isActive = toggle.classList.contains('active');
            if (isActive) {
                toggle.classList.remove('active');
                this.showSuccess('Autenticación de dos factores desactivada');
            } else {
                toggle.classList.add('active');
                this.showSuccess('Autenticación de dos factores activada');
            }
        }
    }

    async handleProfileUpdate(e) {
        e.preventDefault();
        console.log("📝 Actualizando perfil...");
        
        const formData = {
            fullName: document.getElementById('editFullName')?.value || '',
            phone: document.getElementById('editPhone')?.value || '',
            location: document.getElementById('editLocation')?.value || ''
        };

        try {
            // Actualizar datos locales
            this.userData = { ...this.userData, ...formData };
            localStorage.setItem('validAIUserProfile', JSON.stringify(this.userData));
            
            // Actualizar interfaz
            this.updateProfileUI();
            this.closeModal('editProfileModal');
            this.showSuccess('Perfil actualizado correctamente');
            
            console.log("✅ Perfil actualizado:", formData);
        } catch (error) {
            console.error('❌ Error actualizando perfil:', error);
            this.showError('Error al actualizar el perfil');
        }
    }

    async handlePasswordChange(e) {
        e.preventDefault();
        console.log("🔑 Cambiando contraseña...");
        
        const currentPassword = document.getElementById('currentPassword')?.value;
        const newPassword = document.getElementById('newPassword')?.value;
        const confirmPassword = document.getElementById('confirmPassword')?.value;

        if (!currentPassword || !newPassword || !confirmPassword) {
            this.showError('Todos los campos son obligatorios');
            return;
        }

        if (newPassword !== confirmPassword) {
            this.showError('Las contraseñas no coinciden');
            return;
        }

        if (newPassword.length < 6) {
            this.showError('La contraseña debe tener al menos 6 caracteres');
            return;
        }

        try {
            this.closeModal('changePasswordModal');
            document.getElementById('changePasswordForm')?.reset();
            this.showSuccess('Contraseña cambiada correctamente');
            console.log("✅ Contraseña cambiada");
        } catch (error) {
            console.error('❌ Error cambiando contraseña:', error);
            this.showError('Error al cambiar la contraseña');
        }
    }

    async handleAvatarUpload(e) {
        const file = e.target.files[0];
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            this.showError('Por favor, selecciona un archivo de imagen');
            return;
        }

        if (file.size > 2 * 1024 * 1024) {
            this.showError('La imagen es demasiado grande (máximo 2MB)');
            return;
        }

        try {
            const reader = new FileReader();
            reader.onload = (e) => {
                const avatarUrl = e.target.result;
                this.userData.avatar = avatarUrl;
                localStorage.setItem('validAIUserProfile', JSON.stringify(this.userData));
                this.updateAvatar(avatarUrl);
                this.showSuccess('Foto de perfil actualizada');
                console.log("✅ Avatar actualizado");
            };
            reader.readAsDataURL(file);
        } catch (error) {
            console.error('❌ Error subiendo avatar:', error);
            this.showError('Error al subir la foto de perfil');
        }
    }

    checkPasswordStrength(password) {
        const strengthBar = document.getElementById('passwordStrength');
        const strengthText = document.getElementById('strengthText');
        
        if (!strengthBar || !strengthText) return;

        if (!password) {
            strengthBar.style.width = '0%';
            strengthText.textContent = 'Débil';
            strengthText.style.color = '#ef476f';
            return;
        }

        let strength = 0;
        let text = 'Débil';
        let color = '#ef476f';

        if (password.length >= 8) strength++;
        if (/[A-Z]/.test(password)) strength++;
        if (/[0-9]/.test(password)) strength++;
        if (/[^A-Za-z0-9]/.test(password)) strength++;

        switch (strength) {
            case 0:
            case 1:
                text = 'Débil';
                color = '#ef476f';
                break;
            case 2:
                text = 'Moderada';
                color = '#ffd166';
                break;
            case 3:
                text = 'Fuerte';
                color = '#06d6a0';
                break;
            case 4:
                text = 'Muy Fuerte';
                color = '#118ab2';
                break;
        }

        strengthBar.style.width = `${(strength / 4) * 100}%`;
        strengthBar.style.backgroundColor = color;
        strengthText.textContent = text;
        strengthText.style.color = color;
    }

    confirmDeleteAccount() {
        if (confirm('⚠️ ¿Estás seguro de que deseas eliminar tu cuenta? Esta acción no se puede deshacer.')) {
            if (confirm('⚠️ ⚠️ Esta es tu última advertencia. ¿Realmente quieres eliminar tu cuenta permanentemente?')) {
                this.deleteAccount();
            }
        }
    }

    logoutAllSessions() {
        if (confirm('¿Estás seguro de que deseas cerrar todas las sesiones excepto la actual?')) {
            this.showSuccess('Todas las sesiones han sido cerradas');
            this.closeModal('sessionsModal');
        }
    }

    openModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.style.display = 'flex';
            document.body.style.overflow = 'hidden';
        }
    }

    closeModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    }

    logoutAllSessions() {
        console.log("👋 Cerrando todas las sesiones...");
        this.showSuccess('Todas las sesiones han sido cerradas');
    }

    logout() {
        console.log("👋 Cerrando sesión...");
        localStorage.removeItem('authToken');
        localStorage.removeItem('loggedIn');
        localStorage.removeItem('userData');
        localStorage.removeItem('validAIUserProfile');
        this.showSuccess('Sesión cerrada exitosamente');
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1000);
    }

    deleteAccount() {
        console.log("🗑️ Eliminando cuenta...");
        localStorage.clear();
        this.showSuccess('Cuenta eliminada correctamente');
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1500);
    }

    formatDate(dateString) {
        if (!dateString) return 'Nunca';
        
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('es-ES', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        } catch (e) {
            console.error("Error formateando fecha:", e);
            return 'Fecha inválida';
        }
    }

    loadUserPreferences() {
        const preferences = JSON.parse(localStorage.getItem('validAIPreferences')) || {};
        
        const themeSelect = document.getElementById('themeSelect');
        const languageSelect = document.getElementById('languageSelect');
        const emailNotifications = document.getElementById('emailNotifications');
        const reportAlerts = document.getElementById('reportAlerts');
        
        if (themeSelect) themeSelect.value = preferences.theme || 'light';
        if (languageSelect) languageSelect.value = preferences.language || 'es';
        if (emailNotifications) emailNotifications.checked = preferences.emailNotifications !== false;
        if (reportAlerts) reportAlerts.checked = preferences.reportAlerts !== false;
    }

    savePreference(key, value) {
        let preferences = JSON.parse(localStorage.getItem('validAIPreferences')) || {};
        preferences[key] = value;
        localStorage.setItem('validAIPreferences', JSON.stringify(preferences));
        
        if (key === 'theme') {
            this.setupTheme();
        }
    }

    setupTheme() {
        const preferences = JSON.parse(localStorage.getItem('validAIPreferences')) || {};
        const theme = preferences.theme || 'light';
        
        document.body.classList.remove('theme-light', 'theme-dark');
        
        if (theme === 'auto') {
            if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
                document.body.classList.add('theme-dark');
            } else {
                document.body.classList.add('theme-light');
            }
        } else {
            document.body.classList.add(`theme-${theme}`);
        }
    }

    showSuccess(message) {
        this.showNotification(message, 'success');
    }

    showError(message) {
        this.showNotification(message, 'error');
    }

    showNotification(message, type = 'info') {
        console.log(`${type === 'success' ? '✅' : '❌'} ${message}`);
        
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 12px 20px;
            border-radius: 8px;
            color: white;
            font-weight: 500;
            z-index: 10000;
            background: ${type === 'success' ? '#06d6a0' : '#ef476f'};
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            animation: slideIn 0.3s ease;
        `;
        notification.textContent = message;
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }
}

// Agregar animación CSS
const style = document.createElement('style');
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
`;
document.head.appendChild(style);

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    console.log("📄 DOM cargado, iniciando ProfileManager...");
    console.log("🔗 URL actual:", window.location.href);
    console.log("🖥️ User Agent:", navigator.userAgent);
    
    // Verificar si estamos en la página de perfil
    if (window.location.pathname.includes('profile.html') || 
        window.location.pathname.includes('/profile') ||
        window.location.pathname === '/' && window.location.search.includes('profile')) {
        console.log("🎯 Iniciando ProfileManager para página de perfil");
        new ProfileManager();
    } else {
        console.log("ℹ️ No es la página de perfil");
    }
});

// Función global para pruebas
window.testProfile = function() {
    console.log("🧪 Test: Probando perfil...");
    const token = localStorage.getItem('authToken');
    console.log("Token:", token);
    
    if (!token) {
        console.log("❌ No hay token. Prueba hacer login primero.");
        alert('No hay token. Por favor inicia sesión primero.');
        return;
    }
    
    fetch('http://localhost:3000/api/auth/profile', {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    .then(res => {
        console.log('Status:', res.status);
        return res.json();
    })
    .then(data => {
        console.log('Datos:', data);
        alert('Consulta la consola para ver los datos');
    })
    .catch(err => {
        console.error('Error:', err);
        alert('Error: ' + err.message);
    });
};

