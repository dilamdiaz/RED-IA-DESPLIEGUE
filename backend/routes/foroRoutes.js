const express = require('express');
const router = express.Router();

const foroController = require('../controllers/foroController');
const { protect } = require('../middleware/authMiddleware'); // 👈 CAMBIO AQUÍ

// POSTS
router.post('/posts', protect, foroController.crearPost);
router.get('/posts', protect, foroController.obtenerPosts);
router.get('/posts/:id', protect, foroController.obtenerPostPorId);

// COMENTARIOS
router.post('/comments', protect, foroController.crearComentario);
router.get('/posts/:id/comments', protect, foroController.obtenerComentarios);

// ========================
// 🌎 FILTROS (PAÍSES / UNIVERSIDADES)
// ========================

router.get('/paises', protect, foroController.obtenerPaises);
router.get('/universidades', protect, foroController.obtenerUniversidades);


module.exports = router;

