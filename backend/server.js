const express = require('express');
const cors = require('cors');
const path = require('path');
const authRoutes = require('./routes/authRoutes');

const app = express();
const PORT = 3000;

// Middleware CORS COMPLETO
app.use(cors({
    origin: function(origin, callback) {
        const allowedOrigins = [
            'http://localhost:5500', 
            'http://127.0.0.1:5500', 
            'http://localhost:3000',
            'http://localhost:8080',
            'http://127.0.0.1:8080',
            'http://localhost:3001',
            null
        ];
        
        if (!origin || allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            console.log('⚠️ Origen bloqueado:', origin);
            callback(new Error('Origen no permitido por CORS'));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'Origin', 'X-Requested-With']
}));

app.options('*', cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ======================================================
// RUTAS DEFINIDAS ANTES DE STATIC (IMPORTANTE)
// ======================================================

// Ruta principal - HOME (landing page)
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/home.html'));
});

// Ruta para LOGIN
app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
});

// Redirección específica para /index.html
app.get('/index.html', (req, res) => {
    res.redirect('/login');
});

// ======================================================
// ARCHIVOS ESTÁTICOS (con index: false)
// ======================================================

app.use(express.static(path.join(__dirname, '../public'), {
    index: false // IMPORTANTE: Deshabilitar autoindex
}));

// ======================================================
// RUTAS API
// ======================================================

app.use('/api/auth', authRoutes);

// ======================================================
// OTRAS RUTAS DE APLICACIÓN
// ======================================================

app.get('/dashboard', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/dashboard.html'));
});

app.get('/profile', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/profile.html'));
});

app.get('/analysis', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/analysis.html'));
});

app.get('/reports', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/reports.html'));
});

app.get('/simulations', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/simulations.html'));
});

// ======================================================

// Ruta de prueba del API
app.get('/api/test', (req, res) => {
    res.json({ 
        success: true,
        message: '✅ Backend funcionando correctamente',
        timestamp: new Date().toISOString(),
        endpoints: {
            auth: 'http://localhost:3000/api/auth',
            profile: 'http://localhost:3000/api/auth/profile',
            stats: 'http://localhost:3000/api/auth/profile/stats',
            activity: 'http://localhost:3000/api/auth/profile/activity'
        }
    });
});

// Middleware de error
app.use((err, req, res, next) => {
    console.error('💥 Error del servidor:', err.message);
    res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`\n🚀 SERVIDOR INICIADO`);
    console.log(`=========================================`);
    console.log(`📡 Backend API:  http://localhost:${PORT}/api`);
    console.log(`🏠 Home:         http://localhost:${PORT}`);
    console.log(`🔐 Login:        http://localhost:${PORT}/login`);
    console.log(`📊 Dashboard:    http://localhost:${PORT}/dashboard`);
    console.log(`👤 Perfil:       http://localhost:${PORT}/profile`);
    console.log(`\n🔑 USUARIOS DE PRUEBA:`);
    console.log(`   1. juan@validai.com    / password123`);
    console.log(`   2. maria@validai.com   / password456`);
    console.log(`   3. carlos@validai.com  / password789`);
    console.log(`   4. ana@validai.com     / password101`);
    console.log(`   5. admin@validai.com   / admin123`);
    console.log(`\n📊 Endpoints disponibles:`);
    console.log(`   POST /api/auth/login`);
    console.log(`   GET  /api/auth/profile`);
    console.log(`   GET  /api/auth/profile/stats`);
    console.log(`   GET  /api/auth/profile/activity`);
    console.log(`\n⚡ Listo para usar!`);
});