require('dotenv').config();
const jwt = require('jsonwebtoken');
const { Usuario } = require('../models'); // Import Usuario model

// Middleware para verificar el token JWT
const verificarToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Acceso denegado. No se proporcionó token.'
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Buscar el usuario para asegurarse de que aún existe y está activo
    const usuario = await Usuario.findByPk(decoded.id_usuario);

    if (!usuario || !usuario.activo) {
      return res.status(403).json({
        success: false,
        message: 'Acceso denegado. Usuario inactivo o no encontrado.'
      });
    }

    req.usuario = usuario; // Adjuntar el usuario al objeto de solicitud
    next();
  } catch (error) {
    console.error('Error al verificar token:', error);
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token expirado. Por favor, inicia sesión de nuevo.'
      });
    }
    return res.status(403).json({
      success: false,
      message: 'Token inválido.'
    });
  }
};

// Middleware para verificar el rol del usuario
const verificarRol = (...rolesPermitidos) => {
  return (req, res, next) => {
    if (!req.usuario || !rolesPermitidos.includes(req.usuario.rol)) {
      return res.status(403).json({
        success: false,
        message: 'No tienes permisos para realizar esta acción.'
      });
    }
    next();
  };
};

module.exports = {
  verificarToken,
  verificarRol
};
