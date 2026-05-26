// middleware/roleMiddleware.js

const roleMiddleware = (rolesPermitidos = []) => {

  return (req, res, next) => {

    try {

      // 🔐 validar usuario autenticado
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'No autenticado'
        });
      }

      // 🔐 validar rol
      if (!rolesPermitidos.includes(req.user.id_rol)) {

        return res.status(403).json({
          success: false,
          message: 'No tienes permisos para realizar esta acción'
        });
      }

      next();

    } catch (error) {

      console.error(error);

      return res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
      });
    }
  };
};

module.exports = roleMiddleware;