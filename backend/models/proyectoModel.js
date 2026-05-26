const { pool } = require('../config/db');

// ======================================
// ➕ CREAR
// ======================================
const crearProyecto = async (
    titulo,
    descripcion,
    objetivo,
    tecnologias,
    estado,
    fecha_inicio,
    fecha_fin,
    cupos,
    id_coordinador,
    id_universidad,
    id_pais,
    tipo_link,
    link_proyecto
) => {

    const sql = `
        INSERT INTO proyectos (
            titulo,
            descripcion,
            objetivo,
            tecnologias,
            estado,
            fecha_inicio,
            fecha_fin,
            cupos,
            id_coordinador,
            id_universidad,
            id_pais,
            tipo_link,
            link_proyecto
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const [result] = await pool.execute(sql, [
        titulo,
        descripcion,
        objetivo,
        tecnologias,
        estado,
        fecha_inicio,
        fecha_fin,
        cupos,
        id_coordinador,
        id_universidad,
        id_pais,
        tipo_link || null,
        link_proyecto || null
    ]);

    return result.insertId;
};

// ======================================
// 📄 OBTENER TODOS
// ======================================
const obtenerProyectos = async () => {

    const sql = `
        SELECT 
            p.*,
            u.nombre AS universidad,
            pa.nombre AS pais,
            us.nombre AS creador
        FROM proyectos p
        LEFT JOIN universidades u 
            ON p.id_universidad = u.id
        LEFT JOIN paises pa 
            ON p.id_pais = pa.id
        LEFT JOIN usuarios us 
            ON p.id_coordinador = us.id
        ORDER BY p.fecha_inicio DESC
    `;

    const [rows] = await pool.execute(sql);

    return rows;
};

// ======================================
// 🔍 OBTENER POR ID
// ======================================
const obtenerProyectoPorId = async (id) => {

    const sql = `
        SELECT 
            p.*,
            u.nombre AS universidad,
            pa.nombre AS pais,
            us.nombre AS creador
        FROM proyectos p
        LEFT JOIN universidades u 
            ON p.id_universidad = u.id
        LEFT JOIN paises pa 
            ON p.id_pais = pa.id
        LEFT JOIN usuarios us 
            ON p.id_coordinador = us.id
        WHERE p.id = ?
    `;

    const [rows] = await pool.execute(sql, [id]);

    return rows[0];
};

// ======================================
// ✏️ ACTUALIZAR
// ======================================
const actualizarProyecto = async (id, data) => {

    const sql = `
        UPDATE proyectos
        SET 
            titulo = ?,
            descripcion = ?,
            objetivo = ?,
            tecnologias = ?,
            estado = ?,
            fecha_inicio = ?,
            fecha_fin = ?,
            cupos = ?,
            tipo_link = ?,
            link_proyecto = ?
        WHERE id = ?
    `;

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
    } = data;

    // ✅ evitar undefined
    const valores = [
        titulo || null,
        descripcion || null,
        objetivo || null,
        tecnologias || null,
        estado || 'Planeacion',
        fecha_inicio || null,
        fecha_fin || null,
        cupos ?? null,
        tipo_link || null,
        link_proyecto || null,
        id
    ];

    await pool.execute(sql, valores);
};

// ======================================
// 🔄 CAMBIAR ESTADO
// ======================================
const cambiarEstadoProyecto = async (
    id,
    estado
) => {

    const sql = `
        UPDATE proyectos
        SET estado = ?
        WHERE id = ?
    `;

    await pool.execute(sql, [
        estado,
        id
    ]);
};

// ======================================
// 👥 ACTUALIZAR CUPOS
// ======================================
const actualizarCuposProyecto = async (
    id,
    cupos
) => {

    const sql = `
        UPDATE proyectos
        SET cupos = ?
        WHERE id = ?
    `;

    await pool.execute(sql, [
        cupos,
        id
    ]);
};

// ======================================
// 🗑 ELIMINAR
// ======================================
const eliminarProyecto = async (id) => {

    const sql = `
        DELETE FROM proyectos
        WHERE id = ?
    `;

    await pool.execute(sql, [id]);
};

// ======================================
// EXPORTS
// ======================================
module.exports = {
    crearProyecto,
    obtenerProyectos,
    obtenerProyectoPorId,
    actualizarProyecto,
    cambiarEstadoProyecto,
    eliminarProyecto,
    actualizarCuposProyecto
};