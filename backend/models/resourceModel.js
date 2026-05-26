// models/resourceModel.js

const { pool } = require('../config/db');

const crearRecurso = async ({ titulo, descripcion, tipo, categoria, archivo_url, id_usuario }) => {
  const [result] = await pool.query(
    `INSERT INTO recursos 
    (titulo, descripcion, tipo, categoria, archivo_url, id_usuario, fecha_subida)
    VALUES (?, ?, ?, ?, ?, ?, NOW())`,
    [titulo, descripcion, tipo, categoria, archivo_url, id_usuario]
  );

  return {
    id: result.insertId,
    titulo,
    descripcion,
    tipo,
    categoria,
    archivo_url,
    id_usuario,
  };
};

const obtenerRecursos = async () => {
  const [rows] = await pool.query(`
    SELECT 
      r.*,
      u.nombre AS autor,
      uni.nombre AS universidad
    FROM recursos r
    JOIN usuarios u ON r.id_usuario = u.id
    LEFT JOIN universidades uni ON u.id_universidad = uni.id
    ORDER BY r.fecha_subida DESC
  `);

  return rows;
};


module.exports = {
  crearRecurso,
  obtenerRecursos,
};