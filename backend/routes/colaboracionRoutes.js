const express = require('express');
const router = express.Router();

const { protect } = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

const {

    // ======================================
    // 📚 MASTERCLASS
    // ======================================
    crearMasterclass,
    obtenerMasterclass,
    obtenerMasterclassPorId,
    actualizarMasterclass,
    eliminarMasterclass,

    // ======================================
    // 🎓 MENTORÍAS
    // ======================================
    crearMentoria,
    obtenerMentorias,
    obtenerMentoriaPorId,
    actualizarMentoria,
    eliminarMentoria,

    // ======================================
    // 🚀 PROYECTOS
    // ======================================
    crearProyecto,
    obtenerProyectos,
    obtenerProyectoPorId,
    actualizarProyecto,
    eliminarProyecto,
    // cambiarEstadoProyecto,

    // ======================================
    // 📝 INSCRIPCIONES
    // ======================================
    inscribirse,
    obtenerInscritos,
    abandonarInscripcion,
    obtenerMisInscripciones,
    contarInscritos

} = require('../controllers/colaboracionController');


// =====================================================
// 📚 MASTERCLASS
// =====================================================
router.post(
    '/masterclass',
    protect,
    roleMiddleware([2]),
    crearMasterclass
);

router.get(
    '/masterclass',
    protect,
    obtenerMasterclass
);

router.get(
    '/masterclass/:id',
    protect,
    obtenerMasterclassPorId
);

router.put(
    '/masterclass/:id',
    protect,
    roleMiddleware([2]),
    actualizarMasterclass
);

router.delete(
    '/masterclass/:id',
    protect,
    roleMiddleware([2]),
    eliminarMasterclass
);


// =====================================================
// 🎓 MENTORÍAS
// =====================================================
router.post(
    '/mentorias',
    protect,
    roleMiddleware([2]),
    crearMentoria
);

router.get(
    '/mentorias',
    protect,
    obtenerMentorias
);

router.get(
    '/mentorias/:id',
    protect,
    obtenerMentoriaPorId
);

router.put(
    '/mentorias/:id',
    protect,
    roleMiddleware([2]),
    actualizarMentoria
);

router.delete(
    '/mentorias/:id',
    protect,
    roleMiddleware([2]),
    eliminarMentoria
);


// =====================================================
// 🚀 PROYECTOS
// =====================================================
router.post(
    '/proyectos',
    protect,
    roleMiddleware([2]),
    crearProyecto
);

router.get(
    '/proyectos',
    protect,
    obtenerProyectos
);

router.get(
    '/proyectos/:id',
    protect,
    obtenerProyectoPorId
);

router.put(
    '/proyectos/:id',
    protect,
    roleMiddleware([2]),
    actualizarProyecto
);

// router.patch(
//     '/proyectos/:id/estado',
//     protect,
//     roleMiddleware([2]),
//     cambiarEstadoProyecto
// );

router.delete(
    '/proyectos/:id',
    protect,
    roleMiddleware([2]),
    eliminarProyecto
);


// =====================================================
// 📝 INSCRIPCIONES
// =====================================================

// ✅ INSCRIBIRSE
router.post(
    '/inscribirse',
    protect,
    inscribirse
);

// 👥 VER INSCRITOS
router.get(
    '/inscritos/:tipo/:id',
    protect,
    obtenerInscritos
);

// 🔢 CONTADOR DE INSCRITOS
router.get(
    '/inscritos/contador/:tipo/:id',
    protect,
    contarInscritos
);

// ❌ ABANDONAR INSCRIPCIÓN
router.delete(
    '/abandonar/:tipo/:id',
    protect,
    abandonarInscripcion
);

// 📋 MIS INSCRIPCIONES
router.get(
    '/mis-inscripciones',
    protect,
    obtenerMisInscripciones
);

module.exports = router;