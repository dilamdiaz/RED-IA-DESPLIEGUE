// controllers/resourceController.js
const cloudinary = require('../config/cloudinary');
const uploadToCloudinary = require('../utils/uploadToCloudinary');
const resourceModel = require('../models/resourceModel');


const crearRecurso = async (req, res) => {
  try {

    console.log('🟡 BODY:', req.body);
    console.log('🟡 FILE:', req.file);
    console.log('🟡 USER:', req.user);

    let { titulo, descripcion, tipo, categoria } = req.body;

    const archivo = req.file;

    tipo = (tipo || '').toLowerCase().trim();

    const tipoMap = {
      pdf: 'pdf',
      imagen: 'imagen',
      image: 'imagen',
      jpg: 'imagen',
      jpeg: 'imagen',
      png: 'imagen',
      video: 'video',
      mp4: 'video',
      ppt: 'presentacion',
      pptx: 'presentacion'
    };

    const tipoNormalizado = tipoMap[tipo] || tipo;

    if (!titulo || !descripcion || !tipo || !categoria) {
      return res.status(400).json({
        error: 'Todos los campos son obligatorios'
      });
    }

    if (!archivo) {
      return res.status(400).json({
        error: 'Archivo requerido'
      });
    }

    const id_usuario = req.user?.id;

    if (!id_usuario) {
      return res.status(401).json({
        error: 'Usuario no autenticado'
      });
    }

    // 🔥 SUBIR A CLOUDINARY
    const result = await uploadToCloudinary(archivo.buffer, 'recursos');

    const archivo_url = result.secure_url;

    // 🔥 GUARDAR EN DB
    const recurso = await resourceModel.crearRecurso({
      titulo,
      descripcion,
      tipo: tipoNormalizado,
      categoria,
      archivo_url,
      id_usuario,
    });

    return res.status(201).json(recurso);

  } catch (error) {
    console.error('🔥 ERROR SERVER:', error);
    return res.status(500).json({
      error: 'Error interno del servidor'
    });
  }
};

const obtenerRecursos = async (req, res) => {
  try {
    const recursos = await resourceModel.obtenerRecursos();
    return res.json(recursos);
  } catch (error) {
    console.error('Error al obtener recursos:', error.message);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
};

module.exports = {
  crearRecurso,
  obtenerRecursos,
};