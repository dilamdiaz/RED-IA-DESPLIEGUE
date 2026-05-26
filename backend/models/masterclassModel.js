const { pool } = require('../config/db');

// ➕ CREAR
const crearMasterclass = async (
    titulo,
    descripcion,
    fecha,
    hora,
    enlace,
    cupos,
    id_coordinador,
    id_universidad,
    id_pais
) => {

    const sql = `
        INSERT INTO masterclass (
            titulo,
            descripcion,
            fecha,
            hora,
            enlace,
            cupos,
            id_coordinador,
            id_universidad,
            id_pais
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const [result] = await pool.execute(sql, [
        titulo,
        descripcion,
        fecha,
        hora,
        enlace,
        cupos,
        id_coordinador,
        id_universidad,
        id_pais
    ]);

    return result.insertId;
};

// 📄 OBTENER TODAS
const obtenerMasterclass = async (id_usuario = null) => {

    const sql = `
        SELECT 
            m.*,
            u.nombre AS universidad,
            p.nombre AS pais,
            us.nombre AS creador,

            -- 👥 TOTAL INSCRITOS
            (
                SELECT COUNT(*) 
                FROM inscripciones i 
                WHERE i.tipo = 'masterclass' 
                  AND i.id_referencia = m.id
            ) AS inscritos,

            -- ✅ VALIDAR SI YA ESTÁ INSCRITO
            (
                SELECT COUNT(*) 
                FROM inscripciones i2
                WHERE i2.tipo = 'masterclass'
                  AND i2.id_referencia = m.id
                  AND i2.id_usuario = ?
            ) AS ya_inscrito

        FROM masterclass m

        LEFT JOIN universidades u
            ON m.id_universidad = u.id

        LEFT JOIN paises p
            ON m.id_pais = p.id

        LEFT JOIN usuarios us
            ON m.id_coordinador = us.id

        ORDER BY m.fecha DESC, m.hora DESC
    `;

    const [rows] = await pool.execute(sql, [id_usuario]);

    return rows;
};

// 🔍 OBTENER POR ID
const obtenerMasterclassPorId = async (
    id,
    id_usuario = null
) => {

    const sql = `
        SELECT 
            m.*,
            u.nombre AS universidad,
            p.nombre AS pais,
            us.nombre AS creador,

            -- 👥 TOTAL INSCRITOS
            (
                SELECT COUNT(*) 
                FROM inscripciones i 
                WHERE i.tipo = 'masterclass' 
                  AND i.id_referencia = m.id
            ) AS inscritos,

            -- ✅ VALIDAR SI YA ESTÁ INSCRITO
            (
                SELECT COUNT(*) 
                FROM inscripciones i2
                WHERE i2.tipo = 'masterclass'
                  AND i2.id_referencia = m.id
                  AND i2.id_usuario = ?
            ) AS ya_inscrito

        FROM masterclass m

        LEFT JOIN universidades u
            ON m.id_universidad = u.id

        LEFT JOIN paises p
            ON m.id_pais = p.id

        LEFT JOIN usuarios us
            ON m.id_coordinador = us.id

        WHERE m.id = ?
    `;

    const [rows] = await pool.execute(sql, [
        id_usuario,
        id
    ]);

    return rows[0];
};

// ✏️ ACTUALIZAR
const actualizarMasterclass = async (
    id,
    data
) => {

    const sql = `
        UPDATE masterclass
        SET 
            titulo = ?,
            descripcion = ?,
            fecha = ?,
            hora = ?,
            enlace = ?,
            cupos = ?
        WHERE id = ?
    `;

    const {
        titulo,
        descripcion,
        fecha,
        hora,
        enlace,
        cupos
    } = data;

    await pool.execute(sql, [
        titulo,
        descripcion,
        fecha,
        hora,
        enlace,
        cupos,
        id
    ]);
};

// 🗑 ELIMINAR
const eliminarMasterclass = async (id) => {

    const sql = `
        DELETE FROM masterclass
        WHERE id = ?
    `;

    await pool.execute(sql, [id]);
};

// 🔽 ACTUALIZAR CUPOS
const actualizarCuposMasterclass = async (
    id,
    cupos
) => {

    const sql = `
        UPDATE masterclass
        SET cupos = ?
        WHERE id = ?
    `;

    await pool.execute(sql, [
        cupos,
        id
    ]);
};

module.exports = {
    crearMasterclass,
    obtenerMasterclass,
    obtenerMasterclassPorId,
    actualizarMasterclass,
    eliminarMasterclass,
    actualizarCuposMasterclass
};