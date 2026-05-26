// models/comentarioModel.js

const { pool } = require('../config/db');

// ➕ Crear comentario
const crearComentario = async (contenido, id_usuario, id_foro, parent_id = null) => {
    const sql = `
    INSERT INTO comentarios (contenido, id_usuario, id_foro, parent_id)
    VALUES (?, ?, ?, ?)
  `;

    const [result] = await pool.query(sql, [
        contenido,
        id_usuario,
        id_foro,
        parent_id
    ]);

    return result.insertId;
};

// 📄 Obtener comentarios por post (MEJORADO 🔥)
const obtenerComentariosPorPost = async (id_foro) => {
    const sql = `
    SELECT 
    c.id,
    c.contenido,
    c.parent_id,
    c.fecha,
    u.nombre AS autor,
    u.id_universidad,
    u.id_pais,
    uni.nombre AS universidad,
    p.nombre AS pais,
    p.codigo AS codigo_pais
FROM comentarios c
LEFT JOIN usuarios u ON c.id_usuario = u.id
LEFT JOIN universidades uni ON u.id_universidad = uni.id
LEFT JOIN paises p ON u.id_pais = p.id
WHERE c.id_foro = ?
ORDER BY c.fecha ASC
`;
    const [rows] = await pool.query(sql, [id_foro]);
    return rows;
};
module.exports = {
    crearComentario,
    obtenerComentariosPorPost,
};