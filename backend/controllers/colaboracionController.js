// controllers/colaboracionController.js

const masterclassModel = require('../models/masterclassModel');
const mentoriaModel = require('../models/mentoriaModel');
const proyectoModel = require('../models/proyectoModel');
const inscripcionModel = require('../models/inscripcionModel');
const usuarioModel = require('../models/userModel');
const { enviarCorreo } = require('../services/emailService');
const masterclassTemplate = require('../templates/masterclassTemplate');
const mentoriaTemplate = require('../templates/mentoriaTemplate');
const proyectoBienvenidaTemplate = require('../templates/proyectoBienvenidaTemplate');
const proyectoInicioTemplate = require('../templates/proyectoInicioTemplate');
const proyectoFinalizadoTemplate = require('../templates/proyectoFinalizadoTemplate');
// ======================================
// 📚 MASTERCLASS
// ======================================
const crearMasterclass = async (req, res) => {

    try {

        const {
            titulo,
            descripcion,
            fecha,
            hora,
            enlace,
            cupos
        } = req.body;

        // ======================================
        // VALIDACIONES
        // ======================================
        if (
            !titulo ||
            !descripcion ||
            !fecha ||
            !hora ||
            !enlace
        ) {
            return res.status(400).json({
                success: false,
                message:
                    'Título, descripción, fecha, hora y enlace son obligatorios'
            });
        }

        const id = await masterclassModel.crearMasterclass(
            titulo,
            descripcion,
            fecha,
            hora,
            enlace,
            cupos || 100,
            req.user.id,
            req.user.id_universidad,
            req.user.id_pais
        );

        return res.status(201).json({
            success: true,
            message: 'Masterclass creada correctamente',
            data: id
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
const obtenerMasterclass = async (req, res) => {
    try {
        const data = await masterclassModel.obtenerMasterclass(req.user.id);
        return res.json({ success: true, data });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};


// ======================================
// 🔍 MASTERCLASS POR ID
// ======================================
const obtenerMasterclassPorId = async (req, res) => {
    try {
        const data = await masterclassModel.obtenerMasterclassPorId(req.params.id, req.user.id);

        if (!data) {
            return res.status(404).json({
                success: false,
                message: 'Masterclass no encontrada'
            });
        }

        return res.json({ success: true, data });

    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};


// ======================================
// 🎓 MENTORÍAS
// ======================================
const crearMentoria = async (req, res) => {

    try {

        const {
            titulo,
            descripcion,
            fecha,
            hora,
            especialidad,
            enlace,
            cupos
        } = req.body;

        // ======================================
        // VALIDACIONES
        // ======================================
        if (
            !titulo ||
            !descripcion ||
            !fecha ||
            !hora
        ) {
            return res.status(400).json({
                success: false,
                message:
                    'Título, descripción, fecha y hora son obligatorios'
            });
        }

        const id = await mentoriaModel.crearMentoria({

            titulo,
            descripcion,
            fecha,
            hora,

            especialidad:
                especialidad || null,

            enlace:
                enlace || null,

            cupos:
                cupos
                    ? Number(cupos)
                    : 20,

            id_coordinador:
                req.user.id,

            id_universidad:
                req.user.id_universidad,

            id_pais:
                req.user.id_pais
        });

        return res.status(201).json({
            success: true,
            message: 'Mentoría creada correctamente',
            data: id
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// ======================================
// ✏️ ACTUALIZAR MENTORÍA
// ======================================
const actualizarMentoria = async (req, res) => {

    try {

        const { id } = req.params;

        const {
            titulo,
            descripcion,
            fecha,
            hora
        } = req.body;

        // ======================================
        // VALIDACIONES
        // ======================================
        if (
            !titulo ||
            !descripcion ||
            !fecha ||
            !hora
        ) {
            return res.status(400).json({
                success: false,
                message:
                    'Título, descripción, fecha y hora son obligatorios'
            });
        }

        await mentoriaModel.actualizarMentoria(
            id,
            req.body
        );

        return res.json({
            success: true,
            message: 'Mentoría actualizada correctamente'
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const obtenerMentorias = async (req, res) => {
    try {
        const data = await mentoriaModel.obtenerMentorias();
        return res.json({ success: true, data });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

const obtenerMentoriaPorId = async (req, res) => {
    try {
        const data = await mentoriaModel.obtenerMentoriaPorId(req.params.id);

        if (!data) {
            return res.status(404).json({
                success: false,
                message: 'Mentoría no encontrada'
            });
        }

        return res.json({ success: true, data });

    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};


// ======================================
// 🚀 PROYECTOS
// ======================================

const crearProyecto = async (req, res) => {
    try {
        const {
            titulo,
            descripcion,
            objetivo,
            tecnologias,
            fecha_inicio,
            fecha_fin,
            cupos,
            tipo_link,
            link_proyecto
        } = req.body;

        if (!titulo || !descripcion || !fecha_inicio) {
            return res.status(400).json({
                success: false,
                message: 'Título, descripción y fecha de inicio son obligatorios'
            });
        }

        // 🔥 Validación simple de links (consistencia básica)
        if ((tipo_link && !link_proyecto) || (!tipo_link && link_proyecto)) {
            return res.status(400).json({
                success: false,
                message: 'Debes completar tipo_link y link_proyecto juntos'
            });
        }

        const id = await proyectoModel.crearProyecto(
            titulo,
            descripcion,
            objetivo || null,
            tecnologias || null,
            'Planeacion',
            fecha_inicio,
            fecha_fin || null,
            cupos || 50,
            req.user.id,
            req.user.id_universidad,
            req.user.id_pais,
            tipo_link || null,
            link_proyecto || null
        );

        return res.status(201).json({
            success: true,
            message: 'Proyecto creado correctamente',
            data: id
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// ======================================
// ✏️ ACTUALIZAR PROYECTO
// ======================================

const actualizarProyecto = async (req, res) => {

    try {

        const { id } = req.params;

        const {
            titulo,
            descripcion,
            objetivo,
            tecnologias,
            estado,
            fecha_inicio,
            fecha_fin,
            cupos,
            tipo_link,
            link_proyecto
        } = req.body;

        // ======================================
        // VALIDAR LINKS
        // ======================================
        if (
            (tipo_link && !link_proyecto) ||
            (!tipo_link && link_proyecto)
        ) {
            return res.status(400).json({
                success: false,
                message:
                    'Debes completar tipo_link y link_proyecto juntos'
            });
        }

        // ======================================
        // OBTENER PROYECTO ACTUAL
        // ======================================
        const proyectoActual =
            await proyectoModel.obtenerProyectoPorId(id);

        // ======================================
        // ACTUALIZAR
        // ======================================
        await proyectoModel.actualizarProyecto(id, {

            titulo,
            descripcion,
            objetivo,
            tecnologias,
            estado,
            fecha_inicio,
            fecha_fin,
            cupos,

            tipo_link:
                tipo_link || null,

            link_proyecto:
                link_proyecto || null
        });

        // ======================================
        // DETECTAR CAMBIO DE ESTADO
        // ======================================
        const cambioAEnDesarrollo =
            proyectoActual.estado !== 'En desarrollo' &&
            estado === 'En desarrollo';

        const cambioAFinalizado =
            proyectoActual.estado !== 'Finalizado' &&
            estado === 'Finalizado';

        // ======================================
        // OBTENER INSCRITOS
        // ======================================
        if (
            cambioAEnDesarrollo ||
            cambioAFinalizado
        ) {

            const inscritos =
                await inscripcionModel.obtenerInscritos(
                    'proyecto',
                    id
                );

            // ======================================
            // RECORRER INSCRITOS
            // ======================================
            for (const usuario of inscritos) {

                // ================================
                // 📧 EN DESARROLLO
                // ================================
                if (cambioAEnDesarrollo) {

                    const html =
                        proyectoInicioTemplate({

                            nombre:
                                usuario.nombre,

                            titulo,

                            descripcion,

                            objetivo,

                            tipo_link,

                            link_proyecto,

                            fecha_inicio,

                            fecha_fin
                        });

                    await enviarCorreo({
                        to: usuario.email,
                        subject:
                            '🚀 Proyecto iniciado - Red IA Company',
                        html
                    });
                }

                // ================================
                // 📧 FINALIZADO
                // ================================
                if (cambioAFinalizado) {

                    const html =
                        proyectoFinalizadoTemplate({

                            nombre:
                                usuario.nombre,

                            titulo
                        });

                    await enviarCorreo({
                        to: usuario.email,
                        subject:
                            '🎉 Proyecto finalizado - Gracias por participar',
                        html
                    });
                }
            }
        }

        return res.json({
            success: true,
            message:
                'Proyecto actualizado correctamente'
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


const obtenerProyectos = async (req, res) => {
    try {
        const data = await proyectoModel.obtenerProyectos();
        return res.json({ success: true, data });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

const obtenerProyectoPorId = async (req, res) => {
    try {
        const data = await proyectoModel.obtenerProyectoPorId(req.params.id);

        if (!data) {
            return res.status(404).json({
                success: false,
                message: 'Proyecto no encontrado'
            });
        }

        return res.json({ success: true, data });

    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};


// ======================================
// 📝 INSCRIPCIONES
// ======================================
const inscribirse = async (req, res) => {

    try {

        const { tipo, id_referencia } = req.body;

        if (!tipo || !id_referencia) {
            return res.status(400).json({
                success: false,
                message: 'Datos incompletos'
            });
        }

        // ======================================
        // VALIDAR INSCRIPCIÓN EXISTENTE
        // ======================================
        const existe = await inscripcionModel.existeInscripcion(
            req.user.id,
            tipo,
            id_referencia
        );

        if (existe) {
            return res.status(400).json({
                success: false,
                message: 'Ya estás inscrito'
            });
        }

        // ======================================
        // OBTENER PUBLICACIÓN
        // ======================================
        let item;

        if (tipo === 'masterclass') {

            item = await masterclassModel.obtenerMasterclassPorId(
                id_referencia
            );

        } else if (tipo === 'mentoria') {

            item = await mentoriaModel.obtenerMentoriaPorId(
                id_referencia
            );

        } else if (tipo === 'proyecto') {

            item = await proyectoModel.obtenerProyectoPorId(
                id_referencia
            );

        } else {

            return res.status(400).json({
                success: false,
                message: 'Tipo inválido'
            });
        }

        // ======================================
        // VALIDAR EXISTENCIA
        // ======================================
        if (!item) {
            return res.status(404).json({
                success: false,
                message: 'Publicación no encontrada'
            });
        }

        // ======================================
        // VALIDAR ESTADO PROYECTO
        // ======================================
        if (
            tipo === 'proyecto' &&
            item.estado !== 'Planeacion'
        ) {
            return res.status(400).json({
                success: false,
                message:
                    'Las inscripciones para este proyecto están cerradas'
            });
        }

        // ======================================
        // VALIDAR CUPOS
        // ======================================
        if (
            item.cupos !== null &&
            Number(item.cupos) <= 0
        ) {
            return res.status(400).json({
                success: false,
                message: 'No hay cupos disponibles'
            });
        }

        // ======================================
        // CREAR INSCRIPCIÓN
        // ======================================
        const id = await inscripcionModel.crearInscripcion(
            req.user.id,
            tipo,
            id_referencia
        );

        // ======================================
        // 📧 ENVIAR CORREO MASTERCLASS
        // ======================================
        if (tipo === 'masterclass') {

            const usuario =
                await usuarioModel.obtenerUsuarioPorId(
                    req.user.id
                );

            const html = masterclassTemplate({
                nombre: usuario.nombre,
                titulo: item.titulo,
                fecha: item.fecha,
                hora: item.hora,
                enlace: item.enlace
            });

            await enviarCorreo({
                to: usuario.email,
                subject: 'Inscripción Exitosa - Masterclass',
                html
            });
        }

        // ======================================
        // 📧 ENVIAR CORREO MENTORÍA
        // ======================================
        if (tipo === 'mentoria') {

            const usuario =
                await usuarioModel.obtenerUsuarioPorId(
                    req.user.id
                );

            const html = mentoriaTemplate({
                nombre: usuario.nombre,
                titulo: item.titulo,
                descripcion: item.descripcion,
                fecha: item.fecha,
                hora: item.hora,
                especialidad: item.especialidad,
                enlace: item.enlace,
                mentor: item.creador,
                universidad: item.universidad,
                pais: item.pais
            });

            await enviarCorreo({
                to: usuario.email,
                subject: 'Inscripción Exitosa - Mentoría',
                html
            });
        }
        // ======================================
        // 📧 ENVIAR CORREO PROYECTO
        // ======================================
        if (tipo === 'proyecto') {

            const usuario =
                await usuarioModel.obtenerUsuarioPorId(
                    req.user.id
                );

            const html = proyectoBienvenidaTemplate({
                nombre: usuario.nombre,
                titulo: item.titulo,
                fecha_inicio: item.fecha_inicio,
                fecha_fin: item.fecha_fin,
                estado: item.estado
            });

            await enviarCorreo({
                to: usuario.email,
                subject: 'Inscripción Confirmada - Proyecto',
                html
            });
        }

        // ======================================
        // DESCONTAR CUPOS
        // ======================================
        if (item.cupos !== null) {

            const nuevosCupos =
                Number(item.cupos) - 1;

            // ================= MASTERCLASS
            if (tipo === 'masterclass') {

                await masterclassModel.actualizarCuposMasterclass(
                    id_referencia,
                    nuevosCupos
                );
            }

            // ================= MENTORIA
            else if (tipo === 'mentoria') {

                await mentoriaModel.actualizarCuposMentoria(
                    id_referencia,
                    nuevosCupos
                );
            }

            // ================= PROYECTO
            else if (tipo === 'proyecto') {

                await proyectoModel.actualizarCuposProyecto(
                    id_referencia,
                    nuevosCupos
                );
            }
        }

        return res.status(201).json({
            success: true,
            message: 'Inscripción realizada correctamente',
            data: id
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// ======================================
// ✏️ ACTUALIZAR
// ======================================

// MASTERCLASS
const actualizarMasterclass = async (req, res) => {
    try {
        const { id } = req.params;

        await masterclassModel.actualizarMasterclass(id, req.body);

        return res.json({
            success: true,
            message: 'Masterclass actualizada correctamente'
        });

    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};




// ======================================
// 🗑 ELIMINAR
// ======================================

// MASTERCLASS
const eliminarMasterclass = async (req, res) => {
    try {
        await masterclassModel.eliminarMasterclass(req.params.id);

        return res.json({
            success: true,
            message: 'Masterclass eliminada correctamente'
        });

    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

// MENTORÍA
const eliminarMentoria = async (req, res) => {
    try {
        await mentoriaModel.eliminarMentoria(req.params.id);

        return res.json({
            success: true,
            message: 'Mentoría eliminada correctamente'
        });

    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

// PROYECTO
const eliminarProyecto = async (req, res) => {
    try {
        await proyectoModel.eliminarProyecto(req.params.id);

        return res.json({
            success: true,
            message: 'Proyecto eliminado correctamente'
        });

    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

// ======================================
// 👥 VER INSCRITOS
// ======================================
const obtenerInscritos = async (req, res) => {


    try {

        const { tipo, id } = req.params;

        const inscritos =
            await inscripcionModel.obtenerInscritos(
                tipo,
                id
            );

        return res.json({
            success: true,
            total: inscritos.length,
            data: inscritos
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// ======================================
// ❌ ABANDONAR INSCRIPCIÓN
// ======================================
const abandonarInscripcion = async (req, res) => {

    try {

        // ✅ AHORA VIENE POR PARAMS
        const { tipo, id } = req.params;

        const id_referencia = Number(id);

        // =============================
        // VALIDAR DATOS
        // =============================
        if (!tipo || !id_referencia) {
            return res.status(400).json({
                success: false,
                message: 'Tipo e ID son obligatorios'
            });
        }

        // =============================
        // VALIDAR EXISTENCIA
        // =============================
        const existe =
            await inscripcionModel.existeInscripcion(
                req.user.id,
                tipo,
                id_referencia
            );

        if (!existe) {
            return res.status(400).json({
                success: false,
                message: 'No estás inscrito'
            });
        }

        // =============================
        // ⚠️ VALIDAR ESTADO PROYECTO
        // =============================
        if (tipo === 'proyecto') {

            const proyecto =
                await proyectoModel.obtenerProyectoPorId(
                    id_referencia
                );

            if (!proyecto) {
                return res.status(404).json({
                    success: false,
                    message: 'Proyecto no encontrado'
                });
            }

            if (proyecto.estado !== 'Planeacion') {
                return res.status(400).json({
                    success: false,
                    message:
                        'No puedes abandonar este proyecto. Solo se permite abandonar en estado de Planeación'
                });
            }
        }

        // =============================
        // ❌ ELIMINAR INSCRIPCIÓN
        // =============================
        const eliminado =
            await inscripcionModel.eliminarInscripcion(
                req.user.id,
                tipo,
                id_referencia
            );

        if (!eliminado) {
            return res.status(400).json({
                success: false,
                message: 'No se pudo eliminar la inscripción'
            });
        }

        // =============================
        // 🔄 DEVOLVER CUPO
        // =============================
        let item;

        if (tipo === 'masterclass') {

            item =
                await masterclassModel.obtenerMasterclassPorId(
                    id_referencia
                );

            if (item && item.cupos !== null) {

                await masterclassModel.actualizarCuposMasterclass(
                    id_referencia,
                    Number(item.cupos) + 1
                );
            }

        } else if (tipo === 'mentoria') {

            item =
                await mentoriaModel.obtenerMentoriaPorId(
                    id_referencia
                );

            if (item && item.cupos !== null) {

                await mentoriaModel.actualizarCuposMentoria(
                    id_referencia,
                    Number(item.cupos) + 1
                );
            }

        } else if (tipo === 'proyecto') {

            item =
                await proyectoModel.obtenerProyectoPorId(
                    id_referencia
                );

            if (item && item.cupos !== null) {

                await proyectoModel.actualizarCuposProyecto(
                    id_referencia,
                    Number(item.cupos) + 1
                );
            }
        }

        return res.json({
            success: true,
            message: 'Inscripción cancelada correctamente'
        });

    } catch (error) {

        console.log(error);

        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};



// ======================================
// 📚 MIS INSCRIPCIONES
// ======================================
const obtenerMisInscripciones = async (req, res) => {

    try {

        const data =
            await inscripcionModel.obtenerMisInscripciones(
                req.user.id
            );

        return res.json({
            success: true,
            data
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const contarInscritos = async (req, res) => {
    try {
        const { tipo, id } = req.params;

        const total = await inscripcionModel.contarInscritos(
            tipo,
            id
        );

        return res.json({
            success: true,
            total
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// ======================================
// EXPORTS
// ======================================
module.exports = {
    crearMasterclass,
    obtenerMasterclass,
    obtenerMasterclassPorId,

    crearMentoria,
    obtenerMentorias,
    obtenerMentoriaPorId,

    crearProyecto,
    obtenerProyectos,
    obtenerProyectoPorId,

    inscribirse,

    actualizarMasterclass,
    eliminarMasterclass,

    actualizarMentoria,
    eliminarMentoria,

    actualizarProyecto,
    eliminarProyecto,

    obtenerInscritos,
    abandonarInscripcion,
    obtenerMisInscripciones,
    contarInscritos
};