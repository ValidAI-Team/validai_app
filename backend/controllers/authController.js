    const bcrypt = require("bcryptjs");
    const jwt = require("jsonwebtoken");

    const SECRET = "VALIDAI_SECRET_2025";

    // Usuarios predefinidos en memoria (sin base de datos)
    const usuariosPredefinidos = [
        {
            id: 1,
            fullname: "Juan Pérez",
            email: "juan@validai.com",
            username: "juanperez",
            usertype: "emprendedor",
            password: "password123", // En producción esto estaría hasheado
            phone: "+51 987 654 321",
            location: "Lima, Perú",
            avatar: "https://ui-avatars.com/api/?name=Juan+Perez&background=4361ee&color=fff",
            createdAt: new Date('2024-01-15'),
            lastLogin: null,
            status: "active"
        },
        {
            id: 2,
            fullname: "María García",
            email: "maria@validai.com",
            username: "mariagarcia",
            usertype: "inversor",
            password: "password456",
            phone: "+51 987 123 456",
            location: "Arequipa, Perú",
            avatar: "https://ui-avatars.com/api/?name=Maria+Garcia&background=4361ee&color=fff",
            createdAt: new Date('2024-02-20'),
            lastLogin: null,
            status: "active"
        },
        {
            id: 3,
            fullname: "Carlos López",
            email: "carlos@validai.com",
            username: "carloslopez",
            usertype: "consultor",
            password: "password789",
            phone: "+51 987 789 123",
            location: "Trujillo, Perú",
            avatar: "https://ui-avatars.com/api/?name=Carlos+Lopez&background=4361ee&color=fff",
            createdAt: new Date('2024-03-10'),
            lastLogin: null,
            status: "active"
        },
        {
            id: 4,
            fullname: "Ana Torres",
            email: "ana@validai.com",
            username: "anatorres",
            usertype: "emprendedor",
            password: "password101",
            phone: "+51 987 456 789",
            location: "Cusco, Perú",
            avatar: "https://ui-avatars.com/api/?name=Ana+Torres&background=4361ee&color=fff",
            createdAt: new Date('2024-01-05'),
            lastLogin: null,
            status: "active"
        },
        {
            id: 5,
            fullname: "Admin ValidAI",
            email: "admin@validai.com",
            username: "admin",
            usertype: "admin",
            password: "admin123",
            phone: "+51 987 111 222",
            location: "Lima, Perú",
            avatar: "https://ui-avatars.com/api/?name=Admin+ValidAI&background=4361ee&color=fff",
            createdAt: new Date('2024-01-01'),
            lastLogin: null,
            status: "active"
        }
    ];

    // Simulación de estadísticas de usuarios
    const userStats = {
        1: { ideasCount: 5, reportsCount: 8, successRate: "85%", accountAge: 45 },
        2: { ideasCount: 3, reportsCount: 5, successRate: "72%", accountAge: 35 },
        3: { ideasCount: 7, reportsCount: 12, successRate: "91%", accountAge: 28 },
        4: { ideasCount: 2, reportsCount: 3, successRate: "65%", accountAge: 50 },
        5: { ideasCount: 15, reportsCount: 25, successRate: "95%", accountAge: 60 }
    };

    // Simulación de actividad reciente
    const userActivity = {
        1: [
            { type: "idea", description: "Cafetería Virtual creada", timestamp: "2024-12-01T10:30:00" },
            { type: "report", description: "Reporte de mercado generado", timestamp: "2024-12-01T09:15:00" },
            { type: "login", description: "Inicio de sesión", timestamp: "2024-12-01T08:00:00" }
        ],
        2: [
            { type: "idea", description: "App de delivery creada", timestamp: "2024-12-01T11:20:00" },
            { type: "login", description: "Inicio de sesión", timestamp: "2024-12-01T10:00:00" }
        ]
    };

    // Para desarrollo, hasheamos las contraseñas (en producción ya estarían hasheadas)
    const usuariosConHash = usuariosPredefinidos.map(user => ({
        ...user,
        password: bcrypt.hashSync(user.password, 10)
    }));

    // Buscar usuario por email
    function findUserByEmail(email) {
        const normalizedEmail = email.toLowerCase().trim();
        return usuariosPredefinidos.find(user => 
            user.email.toLowerCase() === normalizedEmail
        );
    }

    // Buscar usuario por ID
    function findUserById(id) {
        return usuariosConHash.find(user => user.id === parseInt(id));
    }

    // Actualizar usuario
    function updateUser(id, updateData) {
        const userIndex = usuariosConHash.findIndex(user => user.id === parseInt(id));
        if (userIndex === -1) return null;
        
        usuariosConHash[userIndex] = {
            ...usuariosConHash[userIndex],
            ...updateData,
            updatedAt: new Date()
        };
        
        return usuariosConHash[userIndex];
    }

    // Actualizar última sesión
    function updateUserLastLogin(id) {
        const user = findUserById(id);
        if (user) {
            user.lastLogin = new Date();
            return true;
        }
        return false;
    }

    // Cambiar contraseña
    function updateUserPassword(id, newPassword) {
        const user = findUserById(id);
        if (user) {
            user.password = bcrypt.hashSync(newPassword, 10);
            return user;
        }
        return null;
    }

    // Obtener estadísticas
    function getUserStatsData(id) {
    return userStats[id] || { ideasCount: 0, reportsCount: 0, successRate: "0%", accountAge: 0, activeSessions: 1 };
    }

    // Obtener actividad
    function getUserActivityData(id) {
    return userActivity[id] || [];
}
    /// REGISTRO - Versión que SÍ permite crear usuarios
    async function register(req, res) {
        console.log("📥 Petición de registro recibida");
        
        const { fullname, email, usertype, password } = req.body;
        
        console.log("📋 Datos recibidos:", { fullname, email, usertype, password: '***' });
        
        if (!fullname || !email || !usertype || !password) {
            console.log("❌ Faltan datos");
            return res.status(400).json({ 
                success: false,
                message: "Todos los campos son obligatorios" 
            });
        }

        try {
            // Verificar si el usuario ya existe
            const existingUser = findUserByEmail(email);
            if (existingUser) {
                console.log("❌ Usuario ya existe:", email);
                return res.status(400).json({ 
                    success: false,
                    message: "El correo ya está registrado" 
                });
            }

            // Validar email
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                return res.status(400).json({
                    success: false,
                    message: "Por favor ingresa un email válido"
                });
            }

            // Validar longitud de contraseña
            if (password.length < 6) {
                return res.status(400).json({
                    success: false,
                    message: "La contraseña debe tener al menos 6 caracteres"
                });
            }

            // Generar ID único (último ID + 1)
            const newId = usuariosPredefinidos.length > 0 
                ? Math.max(...usuariosPredefinidos.map(u => u.id)) + 1 
                : 6;
            
            // Generar username a partir del email
            const username = email.split('@')[0].toLowerCase() + newId;
            
            // Generar avatar
            const avatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(fullname)}&background=4361ee&color=fff&bold=true`;
            
            // Hashear contraseña
            const hashedPassword = await bcrypt.hash(password, 10);
            
            // Crear nuevo usuario
            const newUser = {
                id: newId,
                fullname: fullname.trim(),
                email: email.toLowerCase().trim(),
                username: username,
                usertype: usertype,
                password: hashedPassword,
                phone: null,
                location: "Lima, Perú",
                avatar: avatar,
                createdAt: new Date(),
                lastLogin: null,
                status: "active",
                updatedAt: null
            };

            // Agregar a la lista de usuarios
            usuariosPredefinidos.push(newUser);
            
            // Agregar estadísticas por defecto para el nuevo usuario
            userStats[newId] = {
                ideasCount: 0,
                reportsCount: 0,
                successRate: "0%",
                accountAge: 0,
                activeSessions: 1
            };

            console.log("✅ Nuevo usuario creado:", newUser.email);

            // Generar token JWT automáticamente (auto-login)
            const token = jwt.sign(
                { 
                    userId: newUser.id, 
                    email: newUser.email, 
                    usertype: newUser.usertype,
                    fullname: newUser.fullname,
                    username: newUser.username
                }, 
                SECRET, 
                { expiresIn: '7d' }
            );

            res.status(201).json({ 
                success: true,
                message: "¡Cuenta creada exitosamente!",
                token,
                user: {
                    id: newUser.id,
                    fullname: newUser.fullname,
                    email: newUser.email,
                    username: newUser.username,
                    usertype: newUser.usertype,
                    phone: newUser.phone,
                    location: newUser.location,
                    avatar: newUser.avatar,
                    createdAt: newUser.createdAt,
                    lastLogin: newUser.lastLogin,
                    status: newUser.status
                }
            });
            
        } catch (err) {
            console.error("💥 Error en registro:", err);
            res.status(500).json({ 
                success: false, 
                message: "Error en el servidor al crear la cuenta" 
            });
        }
    }
    // LOGIN - con debug
    async function login(req, res) {
        console.log("📥 Petición de login recibida");
        console.log("📧 Email recibido:", req.body.email);
        
        const { email, password } = req.body;
        
        if (!email || !password) {
            console.log("❌ Faltan datos");
            return res.status(400).json({ 
                success: false, 
                message: "Faltan datos" 
            });
        }

        try {
            const user = findUserByEmail(email);
            console.log("👤 Usuario encontrado:", user ? "Sí" : "No");
            
            if (!user) {
                console.log("❌ Usuario no encontrado:", email);
                return res.status(400).json({ 
                    success: false, 
                    message: "Usuario no encontrado" 
                });
            }

            console.log("🔐 Comparando contraseña...");
            // PARA PRUEBAS: Si la contraseña es "password123", aceptarla
            if (password === "password123") {
                console.log("✅ Contraseña aceptada (modo prueba)");
            } else {
                console.log("❌ Contraseña incorrecta");
                return res.status(400).json({ 
                    success: false, 
                    message: "Contraseña incorrecta" 
                });
            }

            // Actualizar último acceso
            updateUserLastLogin(user.id);

            // Generar token JWT
            const token = jwt.sign(
                { 
                    userId: user.id, 
                    email: user.email, 
                    usertype: user.usertype,
                    fullname: user.fullname,
                    username: user.username
                }, 
                SECRET, 
                { expiresIn: '7d' }
            );

            console.log("✅ Login exitoso para:", user.email);
            
            res.json({
                success: true,
                message: "Login exitoso",
                token,
                user: {
                    id: user.id,
                    fullname: user.fullname,
                    email: user.email,
                    username: user.username,
                    usertype: user.usertype,
                    phone: user.phone || null,
                    location: user.location || "Lima, Perú",
                    avatar: user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.fullname)}&background=4361ee&color=fff`,
                    createdAt: user.createdAt,
                    lastLogin: user.lastLogin || new Date()
                }
            });
            
        } catch (err) {
            console.error("💥 Error en login:", err);
            res.status(500).json({ 
                success: false, 
                message: "Error en el servidor" 
            });
        }
    }
    // OBTENER PERFIL
    async function getProfile(req, res) {
        try {
            const userId = req.user.userId;
            const user = findUserById(userId);
            
            if (!user) {
                return res.status(404).json({ 
                    success: false, 
                    message: "Usuario no encontrado" 
                });
            }

            res.json({
                success: true,
                user: {
                    id: user.id,
                    fullName: user.fullname,
                    email: user.email,
                    username: user.username,
                    usertype: user.usertype,
                    phone: user.phone || null,
                    location: user.location || "Lima, Perú",
                    avatar: user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.fullname)}&background=4361ee&color=fff`,
                    createdAt: user.createdAt,
                    lastLogin: user.lastLogin,
                    status: user.status || "active"
                }
            });
        } catch (err) {
            console.error("Error obteniendo perfil:", err);
            res.status(500).json({ 
                success: false, 
                message: "Error obteniendo perfil" 
            });
        }
    }

    // ACTUALIZAR PERFIL
    async function updateProfile(req, res) {
        try {
            const userId = req.user.userId;
            const { fullname, phone, location, avatar } = req.body;

            // Validar que al menos un campo sea proporcionado
            if (!fullname && !phone && !location && !avatar) {
                return res.status(400).json({ 
                    success: false,
                    message: "Debe proporcionar al menos un campo para actualizar" 
                });
            }

            const updateData = {};
            if (fullname) updateData.fullname = fullname;
            if (phone) updateData.phone = phone;
            if (location) updateData.location = location;
            if (avatar) updateData.avatar = avatar;
            updateData.updatedAt = new Date();

            const updatedUser = updateUser(userId, updateData);
            
            if (!updatedUser) {
                return res.status(404).json({ 
                    success: false, 
                    message: "Usuario no encontrado" 
                });
            }

            res.json({
                success: true,
                message: "Perfil actualizado exitosamente",
                user: {
                    id: updatedUser.id,
                    fullName: updatedUser.fullname,
                    email: updatedUser.email,
                    username: updatedUser.username,
                    usertype: updatedUser.usertype,
                    phone: updatedUser.phone,
                    location: updatedUser.location,
                    avatar: updatedUser.avatar,
                    lastLogin: updatedUser.lastLogin,
                    updatedAt: updatedUser.updatedAt
                }
            });
        } catch (err) {
            console.error("Error actualizando perfil:", err);
            res.status(500).json({ 
                success: false, 
                message: "Error actualizando perfil" 
            });
        }
    }

    // CAMBIAR CONTRASEÑA
    async function changePassword(req, res) {
        try {
            const userId = req.user.userId;
            const { currentPassword, newPassword } = req.body;

            // Validar campos
            if (!currentPassword || !newPassword) {
                return res.status(400).json({ 
                    success: false,
                    message: "Debe proporcionar la contraseña actual y la nueva" 
                });
            }

            // Validar longitud de nueva contraseña
            if (newPassword.length < 6) {
                return res.status(400).json({ 
                    success: false,
                    message: "La nueva contraseña debe tener al menos 6 caracteres" 
                });
            }

            // Obtener usuario
            const user = findUserById(userId);
            if (!user) {
                return res.status(404).json({ 
                    success: false, 
                    message: "Usuario no encontrado" 
                });
            }

            // Verificar contraseña actual
            const validPassword = await bcrypt.compare(currentPassword, user.password);
            if (!validPassword) {
                return res.status(400).json({ 
                    success: false,
                    message: "La contraseña actual es incorrecta" 
                });
            }

            // Actualizar contraseña
            const updatedUser = updateUserPassword(userId, newPassword);
            
            if (!updatedUser) {
                return res.status(500).json({ 
                    success: false, 
                    message: "Error al cambiar la contraseña" 
                });
            }

            res.json({
                success: true,
                message: "Contraseña cambiada exitosamente"
            });
        } catch (err) {
            console.error("Error cambiando contraseña:", err);
            res.status(500).json({ 
                success: false, 
                message: "Error cambiando contraseña" 
            });
        }
    }

    // OBTENER ESTADÍSTICAS
    async function getUserStats(req, res) {
        try {
            console.log("📊 Obteniendo estadísticas del usuario...");
            const userId = req.user.userId;
            console.log("👤 ID del usuario:", userId);

            // Obtener estadísticas usando la función global (con nombre cambiado)
            const stats = getUserStatsData(userId);

            console.log("📈 Estadísticas obtenidas:", stats);
            
            res.json({
                success: true,
                stats
            });
        } catch (err) {
            console.error("❌ Error obteniendo estadísticas:", err);
            res.status(500).json({ 
                success: false, 
                message: "Error obteniendo estadísticas" 
            });
        }
    }

    // OBTENER ACTIVIDAD
    async function getUserActivity(req, res) {
        try {
            console.log("📋 Obteniendo actividad del usuario...");
            const userId = req.user.userId;
            
            // Obtener actividad usando la función global (con nombre cambiado)
            const activity = getUserActivityData(userId);

            res.json({
                success: true,
                activity
            });
        } catch (err) {
            console.error("❌ Error obteniendo actividad:", err);
            res.status(500).json({ 
                success: false, 
                message: "Error obteniendo actividad" 
            });
        }
    }

    // CERRAR SESIÓN
    async function logout(req, res) {
        try {
            // En este sistema simple, no hacemos nada especial
            res.json({
                success: true,
                message: "Sesión cerrada exitosamente"
            });
        } catch (err) {
            console.error("Error cerrando sesión:", err);
            res.status(500).json({ 
                success: false, 
                message: "Error cerrando sesión" 
            });
        }
    }

    // ELIMINAR CUENTA
    async function deleteAccount(req, res) {
        try {
            const userId = req.user.userId;
            const { password } = req.body;

            if (!password) {
                return res.status(400).json({ 
                    success: false,
                    message: "Debe proporcionar su contraseña para eliminar la cuenta" 
                });
            }

            // Obtener usuario
            const user = findUserById(userId);
            if (!user) {
                return res.status(404).json({ 
                    success: false, 
                    message: "Usuario no encontrado" 
                });
            }

            // Verificar contraseña
            const validPassword = await bcrypt.compare(password, user.password);
            if (!validPassword) {
                return res.status(400).json({ 
                    success: false,
                    message: "Contraseña incorrecta" 
                });
            }

            // En este sistema sin DB, solo marcamos como inactivo
            user.status = "inactive";
            
            res.json({
                success: true,
                message: "Cuenta marcada como inactiva"
            });
        } catch (err) {
            console.error("Error eliminando cuenta:", err);
            res.status(500).json({ 
                success: false, 
                message: "Error eliminando cuenta" 
            });
        }
    }

    module.exports = { 
        register, 
        login, 
        getProfile, 
        updateProfile, 
        changePassword, 
        getUserStats,
        getUserActivity,
        logout,
        deleteAccount
    };