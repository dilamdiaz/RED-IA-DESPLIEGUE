const bcrypt = require('bcrypt');
const crypto = require('crypto');

const userModel = require('../models/userModel');

const generateToken = require('../utils/generateToken');

const { enviarCorreo } = require('../services/emailService');

const recoveryTemplate =
  require('../templates/recoveryTemplate');

// ========================
// 🔐 AUTH
// ========================

const register = async (req, res) => {

  try {

    const {
      nombre,
      email,
      contraseña,
      id_rol,
      id_universidad,
      id_pais
    } = req.body;

    // ========================
    // VALIDACIONES BÁSICAS
    // ========================

    if (
      !nombre ||
      !email ||
      !contraseña ||
      id_rol == null
    ) {

      return res.status(400).json({
        error:
          'Todos los campos básicos son obligatorios.'
      });
    }

    if (!id_pais) {

      return res.status(400).json({
        error: 'El país es obligatorio.'
      });
    }

    const requiereUniversidad = id_rol !== 1;

    if (
      requiereUniversidad &&
      !id_universidad
    ) {

      return res.status(400).json({
        error:
          'La universidad es obligatoria para este rol.'
      });
    }

    // ========================
    // VALIDAR UNIVERSIDAD
    // ========================

    if (requiereUniversidad) {

      const universidadValida =
        await userModel.validarUniversidadPais(
          id_universidad,
          id_pais
        );

      if (!universidadValida) {

        return res.status(400).json({
          error:
            'La universidad no pertenece al país seleccionado.'
        });
      }
    }

    // ========================
    // VALIDAR EMAIL EXISTENTE
    // ========================

    const usuarioExistente =
      await userModel.obtenerUsuarioPorEmail(email);

    if (usuarioExistente) {

      return res.status(409).json({
        error: 'El email ya existe.'
      });
    }

    // ========================
    // ENCRIPTAR PASSWORD
    // ========================

    const hashedPassword =
      await bcrypt.hash(contraseña, 10);

    // ========================
    // CREAR USUARIO
    // ========================

    await userModel.crearUsuario({

      nombre,

      email,

      contraseña: hashedPassword,

      id_rol,

      id_universidad:
        requiereUniversidad
          ? id_universidad
          : null,

      id_pais
    });

    return res.status(201).json({
      message: 'Usuario creado correctamente'
    });

  } catch (error) {

    console.error(
      'Error en register:',
      error.message
    );

    return res.status(500).json({
      error: 'Error interno del servidor'
    });
  }
};

const login = async (req, res) => {

  try {

    const {
      email,
      contraseña
    } = req.body;

    // ========================
    // VALIDACIONES
    // ========================

    if (!email || !contraseña) {

      return res.status(400).json({
        error:
          'Email y contraseña son obligatorios.'
      });
    }

    // ========================
    // BUSCAR USUARIO
    // ========================

    const usuario =
      await userModel.obtenerUsuarioPorEmail(email);

    if (!usuario) {

      return res.status(401).json({
        error: 'Credenciales incorrectas.'
      });
    }

    // ========================
    // VALIDAR PASSWORD
    // ========================

    const esValido =
      await bcrypt.compare(
        contraseña,
        usuario.contraseña
      );

    if (!esValido) {

      return res.status(401).json({
        error: 'Credenciales incorrectas.'
      });
    }

    // ========================
    // GENERAR JWT
    // ========================

    const token = generateToken({

      id: usuario.id,

      nombre: usuario.nombre,

      email: usuario.email,

      id_rol: usuario.id_rol,

      id_universidad:
        usuario.id_universidad,

      id_pais: usuario.id_pais
    });

    return res.json({

      token,

      usuario: {

        id: usuario.id,

        nombre: usuario.nombre,

        email: usuario.email,

        rol: usuario.id_rol,

        universidad:
          usuario.id_universidad,

        pais: usuario.id_pais
      }
    });

  } catch (error) {

    console.error(
      'Error en login:',
      error.message
    );

    return res.status(500).json({
      error: 'Error interno del servidor'
    });
  }
};

const getProfile = async (req, res) => {

  try {

    const userId = req.user.id;

    const usuario =
      await userModel.obtenerUsuarioPorId(userId);

    if (!usuario) {

      return res.status(404).json({
        error: 'Usuario no encontrado'
      });
    }

    return res.json(usuario);

  } catch (error) {

    console.error(
      'Error en profile:',
      error.message
    );

    return res.status(500).json({
      error: 'Error interno del servidor'
    });
  }
};

// ========================
// 🌍 PAÍSES
// ========================

const getPaises = async (req, res) => {

  try {

    const [rows] =
      await require('../config/db').pool.query(
        'SELECT * FROM paises'
      );

    return res.json(rows);

  } catch (error) {

    console.error(
      'Error en getPaises:',
      error.message
    );

    return res.status(500).json({
      error: 'Error al obtener países'
    });
  }
};

// ========================
// 🏫 UNIVERSIDADES
// ========================

const getUniversidadesPorPais =
  async (req, res) => {

    try {

      const { idPais } = req.params;

      const [rows] =
        await require('../config/db').pool.query(
          'SELECT * FROM universidades WHERE id_pais = ?',
          [idPais]
        );

      return res.json(rows);

    } catch (error) {

      console.error(
        'Error en universidades:',
        error.message
      );

      return res.status(500).json({
        error:
          'Error al obtener universidades'
      });
    }
  };

// ========================
// 🔐 FORGOT PASSWORD
// ========================

const forgotPassword = async (req, res) => {

  try {

    const { email } = req.body;

    if (!email) {

      return res.status(400).json({
        error: 'El email es obligatorio'
      });
    }

    // ========================
    // BUSCAR USUARIO
    // ========================

    const usuario =
      await userModel.obtenerUsuarioPorEmail(email);

    if (!usuario) {

      return res.status(404).json({
        error:
          'No existe una cuenta con este email'
      });
    }

    // ========================
    // GENERAR TOKEN
    // ========================

    const token =
      crypto.randomBytes(32).toString('hex');

    const expiration =
      new Date(Date.now() + 1000 * 60 * 30);

    // ========================
    // GUARDAR TOKEN
    // ========================

    await userModel.guardarResetToken({

      email,

      token,

      expiration
    });

    // ========================
    // LINK RECOVERY
    // ========================

    const recoveryLink =

      `${process.env.FRONTEND_URL}/reset-password/${token}`;

    // ========================
    // ENVIAR CORREO
    // ========================

    await enviarCorreo({

      to: email,

      subject:
        'Recuperación de contraseña',

      html: recoveryTemplate({

        nombre: usuario.nombre,

        recoveryLink
      })
    });

    return res.json({
      message:
        'Correo de recuperación enviado'
    });

  } catch (error) {

    console.error(
      'Error en forgotPassword:',
      error.message
    );

    return res.status(500).json({
      error: 'Error interno del servidor'
    });
  }
};

// ========================
// 🔑 RESET PASSWORD
// ========================

const resetPassword = async (req, res) => {

  try {

    const {
      token,
      nuevaPassword
    } = req.body;

    // ========================
    // VALIDACIONES
    // ========================

    if (!token || !nuevaPassword) {

      return res.status(400).json({
        error:
          'Todos los campos son obligatorios'
      });
    }

    // ========================
    // BUSCAR TOKEN
    // ========================

    const usuario =
      await userModel.obtenerUsuarioPorToken(token);

    if (!usuario) {

      return res.status(400).json({
        error: 'Token inválido'
      });
    }

    // ========================
    // VALIDAR EXPIRACIÓN
    // ========================

    const ahora = new Date();

    if (
      ahora > usuario.reset_token_expiration
    ) {

      return res.status(400).json({
        error: 'El token expiró'
      });
    }

    // ========================
    // ENCRIPTAR PASSWORD
    // ========================

    const hashedPassword =
      await bcrypt.hash(nuevaPassword, 10);

    // ========================
    // ACTUALIZAR PASSWORD
    // ========================

    await userModel.actualizarPassword({

      userId: usuario.id,

      nuevaPassword: hashedPassword
    });

    return res.json({
      message:
        'Contraseña actualizada correctamente'
    });

  } catch (error) {

    console.error(
      'Error en resetPassword:',
      error.message
    );

    return res.status(500).json({
      error: 'Error interno del servidor'
    });
  }
};

// ========================
// EXPORTS
// ========================

module.exports = {

  register,

  login,

  getProfile,

  getPaises,

  getUniversidadesPorPais,

  forgotPassword,

  resetPassword
};