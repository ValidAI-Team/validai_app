// routes/authRoutes.js
const express = require('express');
const router = express.Router();
const {
    register,
    login,
    getProfile,
    updateProfile,
    changePassword,
    getUserStats,
    getUserActivity,
    logout,
    deleteAccount
} = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');

// Rutas públicas
router.post('/register', register);
router.post('/login', login);

// Rutas protegidas (requieren autenticación)
router.get('/profile', authMiddleware, getProfile);
router.put('/profile', authMiddleware, updateProfile);
router.post('/change-password', authMiddleware, changePassword);
router.get('/profile/stats', authMiddleware, getUserStats);
router.get('/profile/activity', authMiddleware, getUserActivity);
router.post('/logout', authMiddleware, logout);
router.delete('/account', authMiddleware, deleteAccount);

module.exports = router;