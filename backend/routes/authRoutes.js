const express = require('express');
const authController = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// 🔐 AUTH
router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/profile', protect, authController.getProfile);
router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password', authController.resetPassword);

// 🌍 PAÍSES
router.get('/paises', authController.getPaises);

// 🏫 UNIVERSIDADES POR PAÍS
router.get('/universidades/:idPais', authController.getUniversidadesPorPais);

module.exports = router;