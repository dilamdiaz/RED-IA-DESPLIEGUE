const foroModel = require('../models/foroModel');
const comentarioModel = require('../models/comentarioModel');

// ========================
// ➕ Crear post
// ========================
const crearPost = async (req, res) => {
  try {
    const { titulo, contenido } = req.body;
    const { id, id_pais, id_universidad } = req.user;

    if (!titulo || !contenido) {
      return res.status(400).json({
        success: false,
        message: "Datos incompletos"
      });
    }

    const postId = await foroModel.crearPost(
      titulo,
      contenido,
      id,
      id_universidad,
      id_pais
    );

    res.json({ success: true, data: postId });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ========================
// 📄 Obtener posts
// ========================
const obtenerPosts = async (req, res) => {
  try {
    const filtros = {
      id_pais: req.query.id_pais,
      id_universidad: req.query.id_universidad
    };

    const posts = await foroModel.obtenerPosts(filtros);

    res.json({ success: true, data: posts });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ========================
// 🔍 Obtener detalle
// ========================
const obtenerPostPorId = async (req, res) => {
  try {
    const post = await foroModel.obtenerPostPorId(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post no encontrado"
      });
    }

    const comentarios = await comentarioModel.obtenerComentariosPorPost(req.params.id);

    res.json({
      success: true,
      data: {
        ...post,
        comentarios
      }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ========================
// 💬 Crear comentario / respuesta
// ========================
const crearComentario = async (req, res) => {
  try {
    const { contenido, id_foro, parent_id } = req.body;
    const { id } = req.user;

    if (!contenido || !id_foro) {
      return res.status(400).json({
        success: false,
        message: "Datos incompletos"
      });
    }

    const comentarioId = await comentarioModel.crearComentario(
      contenido,
      id,
      id_foro,
      parent_id || null // 🔥 aquí está la clave
    );

    res.json({ success: true, data: comentarioId });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ========================
// 📄 Obtener comentarios
// ========================
const obtenerComentarios = async (req, res) => {
  try {
    const { id } = req.params;

    const comentarios = await comentarioModel.obtenerComentariosPorPost(id);

    res.json({
      success: true,
      data: comentarios
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};


// ========================
// 🌎 PAÍSES
// ========================
const obtenerPaises = async (req, res) => {
  try {
    const paises = await foroModel.obtenerPaises();

    res.json({
      success: true,
      data: paises
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ========================
// 🏫 UNIVERSIDADES
// ========================
const obtenerUniversidades = async (req, res) => {
  try {
    const universidades = await foroModel.obtenerUniversidades();

    res.json({
      success: true,
      data: universidades
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};



module.exports = {
  crearPost,
  obtenerPosts,
  obtenerPostPorId,
  crearComentario,
  obtenerComentarios,
  obtenerPaises,
  obtenerUniversidades
};