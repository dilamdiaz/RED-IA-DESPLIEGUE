const { pool } = require('../config/db');

const crearUsuario = async ({
  nombre,
  email,
  contraseña,
  id_rol,
  id_universidad,
  id_pais
}) => {
  const [result] = await pool.query(
    `INSERT INTO usuarios 
    (nombre, email, contraseña, id_rol, id_universidad, id_pais)
    VALUES (?, ?, ?, ?, ?, ?)`,
    [nombre, email, contraseña, id_rol, id_universidad, id_pais]
  );

  return {
    id: result.insertId,
    nombre,
    email,
    id_rol,
    id_universidad,
    id_pais
  };
};

const obtenerUsuarioPorEmail = async (email) => {
  const [rows] = await pool.query(
    'SELECT * FROM usuarios WHERE email = ?',
    [email]
  );

  return rows[0] || null;
};

const obtenerUsuarioPorId = async (id) => {
  const [rows] = await pool.query(
    `SELECT 
      u.id,
      u.nombre,
      u.email,
      u.id_rol,
      u.id_universidad,
      u.id_pais,
      uni.nombre AS universidad,
      p.nombre AS pais
    FROM usuarios u
    LEFT JOIN universidades uni ON u.id_universidad = uni.id
    LEFT JOIN paises p ON u.id_pais = p.id
    WHERE u.id = ?`,
    [id]
  );

  return rows[0] || null;
};

const validarUniversidadPais = async (id_universidad, id_pais) => {
  const [rows] = await pool.query(
    `SELECT id 
     FROM universidades 
     WHERE id = ? AND id_pais = ?`,
    [id_universidad, id_pais]
  );

  return rows.length > 0;
};
module.exports = {
  crearUsuario,
  obtenerUsuarioPorEmail,
  obtenerUsuarioPorId,
  validarUniversidadPais
};