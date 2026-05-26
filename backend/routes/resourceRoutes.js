// routes/resourceRoutes.js

const express = require('express');
const router = express.Router();

const resourcesController = require('../controllers/resourceController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

// 👇 AQUÍ está el fix clave
router.get('/', resourcesController.obtenerRecursos);

router.post(
  '/',
  protect,
  upload.single('archivo'), // 🔥 ESTO ES LO QUE TE FALTA
  resourcesController.crearRecurso
);

module.exports = router;