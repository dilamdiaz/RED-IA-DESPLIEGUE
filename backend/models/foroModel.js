// models/foroModel.js

const { pool } = require('../config/db');

// ➕ Crear post
const crearPost = async (titulo, contenido, id_usuario, id_universidad, id_pais) => {
  const sql = `
    INSERT INTO foro (titulo, contenido, id_usuario, id_universidad, id_pais)
    VALUES (?, ?, ?, ?, ?)
  `;

  const [result] = await pool.query(sql, [
    titulo,
    contenido,
    id_usuario,
    id_universidad,
    id_pais
  ]);

  return result.insertId;
};

// 📄 Obtener posts (con universidad y país)
const obtenerPosts = async (filtros = {}) => {
  let sql = `
    SELECT 
      f.*, 
      u.nombre AS autor,
      uni.nombre AS universidad,
      p.nombre AS pais,
      p.codigo AS codigo_pais,
      COUNT(c.id) AS total_comentarios
    FROM foro f
    JOIN usuarios u ON f.id_usuario = u.id
    LEFT JOIN universidades uni ON f.id_universidad = uni.id
    LEFT JOIN paises p ON f.id_pais = p.id
    LEFT JOIN comentarios c ON c.id_foro = f.id
    WHERE 1=1
  `;

  const params = [];

  if (filtros.id_pais) {
    sql += " AND f.id_pais = ?";
    params.push(filtros.id_pais);
  }

  if (filtros.id_universidad) {
    sql += " AND f.id_universidad = ?";
    params.push(filtros.id_universidad);
  }

  sql += " GROUP BY f.id ORDER BY f.fecha DESC";

  const [rows] = await pool.query(sql, params);
  return rows;
};
// 🔍 Obtener post por ID (también con universidad y país)
const obtenerPostPorId = async (id) => {
  const sql = `
    SELECT 
      f.*, 
      u.nombre AS autor,
      uni.nombre AS universidad,
      p.nombre AS pais,
      p.codigo AS codigo_pais
    FROM foro f
    JOIN usuarios u ON f.id_usuario = u.id
    LEFT JOIN universidades uni ON f.id_universidad = uni.id
    LEFT JOIN paises p ON f.id_pais = p.id
    WHERE f.id = ?
  `;

  const [rows] = await pool.query(sql, [id]);
  return rows[0];
};


// ========================
// 🌎 PAÍSES
// ========================
const obtenerPaises = async () => {
  const sql = `
        SELECT id, nombre
        FROM paises
        ORDER BY nombre ASC
    `;

  const [rows] = await pool.query(sql);
  return rows;
};

// ========================
// 🏫 UNIVERSIDADES
// ========================
const obtenerUniversidades = async () => {
  const sql = `
        SELECT id, nombre, id_pais
        FROM universidades
        ORDER BY nombre ASC
    `;

  const [rows] = await pool.query(sql);
  return rows;
};


module.exports = {
  crearPost,
  obtenerPosts,
  obtenerPostPorId,
  obtenerPaises,
  obtenerUniversidades
};