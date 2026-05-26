const { pool } = require('../config/db');

// ➕ CREAR
const crearMentoria = async (data) => {
    const {
        titulo,
        descripcion,
        fecha,
        hora,
        id_coordinador,
        id_universidad,
        id_pais,
        especialidad,
        enlace,
        cupos
    } = data;

    const sql = `
        INSERT INTO mentorias (
            titulo,
            descripcion,
            fecha,
            hora,
            especialidad,
            enlace,
            cupos,
            id_coordinador,
            id_universidad,
            id_pais
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const [result] = await pool.execute(sql, [
        titulo,
        descripcion,
        fecha,
        hora,
        especialidad,
        enlace,
        cupos,
        id_coordinador,
        id_universidad,
        id_pais
    ]);

    return result.insertId;
};
// ✏️ ACTUALIZAR
const actualizarMentoria = async (id, data) => {

    const sql = `
        UPDATE mentorias
        SET
            titulo = ?,
            descripcion = ?,
            fecha = ?,
            hora = ?,
            especialidad = ?,
            enlace = ?,
            cupos = ?
        WHERE id = ?
    `;

    const {
        titulo,
        descripcion,
        fecha,
        hora,
        especialidad,
        enlace,
        cupos
    } = data;

    await pool.execute(sql, [
        titulo,
        descripcion,
        fecha,
        hora,
        especialidad,
        enlace,
        cupos,
        id
    ]);
};
// 📄 OBTENER TODAS (CON JOINS)
const obtenerMentorias = async () => {
    const sql = `
        SELECT 
            m.*,
            u.nombre AS universidad,
            p.nombre AS pais,
            us.nombre AS creador
        FROM mentorias m
        LEFT JOIN universidades u ON m.id_universidad = u.id
        LEFT JOIN paises p ON m.id_pais = p.id
        LEFT JOIN usuarios us ON m.id_coordinador = us.id
        ORDER BY m.fecha DESC
        `;

    const [rows] = await pool.execute(sql);
    return rows;
};

// 🔍 POR ID
const obtenerMentoriaPorId = async (id) => {
    const sql = `
        SELECT 
            m.*,
            u.nombre AS universidad,
            p.nombre AS pais,
            us.nombre AS creador
        FROM mentorias m
        LEFT JOIN universidades u ON m.id_universidad = u.id
        LEFT JOIN paises p ON m.id_pais = p.id
        LEFT JOIN usuarios us ON m.id_coordinador = us.id
        WHERE m.id = ?
    `;

    const [rows] = await pool.execute(sql, [id]);
    return rows[0];
};


// 🗑 ELIMINAR
const eliminarMentoria = async (id) => {
    const sql = `DELETE FROM mentorias WHERE id = ?`;
    await pool.execute(sql, [id]);
};

// 🔽 ACTUALIZAR CUPOS
const actualizarCuposMentoria = async (id, cupos) => {

    const sql = `
        UPDATE mentorias
        SET cupos = ?
        WHERE id = ?
    `;

    await pool.execute(sql, [cupos, id]);
};

// 👥 CONTAR INSCRITOS
const contarInscritosMentoria = async (id) => {

    const sql = `
        SELECT COUNT(*) AS total
        FROM inscripciones
        WHERE tipo = 'mentoria'
        AND id_referencia = ?
    `;

    const [rows] = await pool.execute(sql, [id]);

    return rows[0].total;
};



// 👥 LISTAR INSCRITOS
const obtenerInscritosMentoria = async (id) => {

    const sql = `
        SELECT 
            i.id,
            i.fecha,
            u.id AS id_usuario,
            u.nombre,
            u.email
        FROM inscripciones i
        INNER JOIN usuarios u ON i.id_usuario = u.id
        WHERE i.tipo = 'mentoria'
        AND i.id_referencia = ?
        ORDER BY i.fecha DESC
    `;

    const [rows] = await pool.execute(sql, [id]);

    return rows;
};


// ❌ ELIMINAR INSCRIPCIÓN
const eliminarInscripcion = async (id_usuario, tipo, id_referencia) => {

    const sql = `
        DELETE FROM inscripciones
        WHERE id_usuario = ?
        AND tipo = ?
        AND id_referencia = ?
    `;

    const [result] = await pool.execute(sql, [
        id_usuario,
        tipo,
        id_referencia
    ]);

    return result.affectedRows > 0;
};


const obtenerInscripcionUsuario = async (id_usuario, id_referencia) => {

    const sql = `
        SELECT *
        FROM inscripciones
        WHERE id_usuario = ?
        AND id_referencia = ?
        AND tipo = 'mentoria'
    `;

    const [rows] = await pool.execute(sql, [
        id_usuario,
        id_referencia
    ]);

    return rows[0] || null;
};


module.exports = {
    crearMentoria,
    obtenerMentorias,
    obtenerMentoriaPorId,
    actualizarMentoria,
    eliminarMentoria,
    actualizarCuposMentoria,
    contarInscritosMentoria,
    obtenerInscritosMentoria,
    eliminarInscripcion,
    obtenerInscripcionUsuario
};