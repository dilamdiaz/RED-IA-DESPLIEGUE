// config/db.js

const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,

  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,

  // 🔥 IMPORTANTE PARA AIVEN (SSL obligatorio)
  ssl: {
    rejectUnauthorized: false
  }
});

const testConnection = async () => {
  try {
    const connection = await pool.getConnection();
    console.log('✅ Conexión a Aiven MySQL establecida correctamente');
    connection.release();
  } catch (error) {
    console.error('❌ Error de conexión a la base de datos:', error.message);
    throw error;
  }
};

module.exports = { pool, testConnection };