const express = require('express');
const cors = require('cors');
require('dotenv').config();

const bodyParser = require('body-parser');

const authRoutes = require('./routes/authRoutes');
const resourceRoutes = require('./routes/resourceRoutes');
const foroRoutes = require('./routes/foroRoutes');
const colaboracionRoutes = require('./routes/colaboracionRoutes');

const { testConnection } = require('./config/db');

const app = express();
const PORT = process.env.PORT || 3001;

// ========================
// CORS (PRODUCCIÓN)
// ========================
app.use(cors({
  origin: '*', // luego lo cerramos cuando montes frontend real
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// ========================
// BODY PARSER
// ========================
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// ========================
// RUTAS API
// ========================
app.use('/api/auth', authRoutes);
app.use('/api/resources', resourceRoutes);
app.use('/api/foro', foroRoutes);
app.use('/api/colaboracion', colaboracionRoutes);

// ========================
// STATIC FILES (uploads)
// ========================
app.use(
  '/uploads',
  express.static('uploads', {
    setHeaders: (res, filePath) => {
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');

      if (filePath.endsWith('.pdf')) {
        res.setHeader('Content-Type', 'application/pdf');
      }

      if (filePath.match(/\.(jpg|jpeg|png)$/)) {
        res.setHeader('Content-Type', 'image/jpeg');
      }

      if (filePath.endsWith('.mp4')) {
        res.setHeader('Content-Type', 'video/mp4');
      }
    },
  })
);

// ========================
// HEALTH CHECK (RENDER)
// ========================
app.get('/', (req, res) => {
  res.json({
    status: 'OK',
    message: 'API funcionando correctamente 🚀'
  });
});

// ========================
// 404
// ========================
app.use((req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada' });
});

// ========================
// ERROR HANDLER
// ========================
app.use((err, req, res, next) => {
  console.error('Error de servidor:', err);
  res.status(500).json({ error: 'Error interno del servidor' });
});

// ========================
// START SERVER
// ========================
const startServer = async () => {
  try {
    await testConnection();

    app.listen(PORT, () => {
      console.log(`🚀 Servidor iniciado en puerto ${PORT}`);
    });

  } catch (error) {
    console.error('❌ Error de base de datos:', error.message);
    process.exit(1);
  }
};

startServer();
