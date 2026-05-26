// models/inscripcionModel.js

const { pool } = require('../config/db');

// =====================================
// ✅ VALIDAR INSCRIPCIÓN EXISTENTE
// =====================================
const existeInscripcion = async (
    id_usuario,
    tipo,
    id_referencia
) => {

    const sql = `
    SELECT *
    FROM inscripciones
    WHERE id_usuario = ?
      AND tipo = ?
      AND id_referencia = ?
  `;

    const [rows] = await pool.query(sql, [
        id_usuario,
        tipo,
        id_referencia
    ]);

    return rows.length > 0;
};

// =====================================
// ➕ CREAR INSCRIPCIÓN
// =====================================
const crearInscripcion = async (
    id_usuario,
    tipo,
    id_referencia
) => {

    const sql = `
    INSERT INTO inscripciones (
      id_usuario,
      tipo,
      id_referencia
    )
    VALUES (?, ?, ?)
  `;

    const [result] = await pool.query(sql, [
        id_usuario,
        tipo,
        id_referencia
    ]);

    return result.insertId;
};


// =====================================
// 👥 OBTENER INSCRITOS
// =====================================
const obtenerInscritos = async (
    tipo,
    id_referencia
) => {

    const sql = `
    SELECT
      i.*,
      u.nombre,
      u.email,
      uni.nombre AS universidad,
      p.nombre AS pais

    FROM inscripciones i

    JOIN usuarios u
      ON i.id_usuario = u.id

    LEFT JOIN universidades uni
      ON u.id_universidad = uni.id

    LEFT JOIN paises p
      ON u.id_pais = p.id

    WHERE i.tipo = ?
      AND i.id_referencia = ?

    ORDER BY i.fecha_inscripcion DESC
  `;

    const [rows] = await pool.query(sql, [
        tipo,
        id_referencia
    ]);

    return rows;
};
// =====================================
// ❌ ELIMINAR INSCRIPCIÓN
// =====================================
const eliminarInscripcion = async (
    id_usuario,
    tipo,
    id_referencia
) => {

    const sql = `
        DELETE FROM inscripciones
        WHERE id_usuario = ?
        AND tipo = ?
        AND id_referencia = ?
    `;

    const [result] = await pool.query(sql, [
        id_usuario,
        tipo,
        id_referencia
    ]);

    return result;
};
// =====================================
// 🔢 CONTAR INSCRITOS
// =====================================
const contarInscritos = async (
    tipo,
    id_referencia
) => {

    const sql = `
    SELECT COUNT(*) AS total
    FROM inscripciones
    WHERE tipo = ?
      AND id_referencia = ?
  `;

    const [rows] = await pool.query(sql, [
        tipo,
        id_referencia
    ]);

    return rows[0].total;
};

// =====================================
// 📚 MIS INSCRIPCIONES (CON DETALLES)
// =====================================
const obtenerMisInscripciones = async (
  id_usuario
) => {

  const sql = `
    SELECT 
      i.id,
      i.id_usuario,
      i.tipo,
      i.id_referencia,
      i.fecha_inscripcion,

      -- 📌 DATOS GENERALES
      COALESCE(
        m.titulo,
        me.titulo,
        p.titulo
      ) AS titulo,

      COALESCE(
        m.descripcion,
        me.descripcion,
        p.descripcion
      ) AS descripcion,

      -- 📅 FECHA
      COALESCE(
        m.fecha,
        me.fecha,
        p.fecha_inicio
      ) AS fecha,

      -- ⚡ ESTADO
      CASE
        WHEN i.tipo = 'masterclass'
          THEN 'Activa'

        WHEN i.tipo = 'mentoria'
          THEN 'Activa'

        WHEN i.tipo = 'proyecto'
          THEN p.estado

        ELSE 'Sin estado'
      END AS estado,

      -- 👥 CUPOS
      COALESCE(
        m.cupos,
        me.cupos,
        p.cupos
      ) AS cupos,

      -- 🏫 UNIVERSIDAD
      u.nombre AS universidad,

      -- 🌎 PAÍS
      pa.nombre AS pais

    FROM inscripciones i

    -- 📚 MASTERCLASS
    LEFT JOIN masterclass m
      ON i.tipo = 'masterclass'
      AND i.id_referencia = m.id

    -- 🧠 MENTORÍAS
    LEFT JOIN mentorias me
      ON i.tipo = 'mentoria'
      AND i.id_referencia = me.id

    -- 🚀 PROYECTOS
    LEFT JOIN proyectos p
      ON i.tipo = 'proyecto'
      AND i.id_referencia = p.id

    -- 🏫 UNIVERSIDADES
    LEFT JOIN universidades u
      ON COALESCE(
        m.id_universidad,
        me.id_universidad,
        p.id_universidad
      ) = u.id

    -- 🌎 PAISES
    LEFT JOIN paises pa
      ON COALESCE(
        m.id_pais,
        me.id_pais,
        p.id_pais
      ) = pa.id

    WHERE i.id_usuario = ?

    ORDER BY i.fecha_inscripcion DESC
  `;

  const [rows] = await pool.query(
    sql,
    [id_usuario]
  );

  return rows;
};


module.exports = {
    existeInscripcion,
    crearInscripcion,
    obtenerInscritos,
    eliminarInscripcion,
    contarInscritos,
    obtenerMisInscripciones
};