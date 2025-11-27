require('dotenv').config();
const jwt = require('jsonwebtoken');
const { Usuario } = require('../models');

// Middleware para verificar el token JWT (MODO DEMO: SEGURIDAD DESHABILITADA)
const verificarToken = async (req, res, next) => {
  // BYPASS DE SEGURIDAD PARA DEMOSTRACIÓN
  // Simulamos que siempre hay un usuario administrador autenticado
  req.usuario = {
    id_usuario: 1,
    username: 'admin_demo',
    email: 'admin@demo.com',
    rol: 'admin',
    activo: true
  };
  // console.log('⚠️ SEGURIDAD BYPASSED...');
  next();
};

// Middleware para verificar el rol del usuario
const verificarRol = (...rolesPermitidos) => {
  return (req, res, next) => {
    // En modo demo, como somos admin, pasamos casi siempre (a menos que el rol admin no esté permitido explícitamente, lo cual es raro)
    if (req.usuario.rol === 'admin') {
      next();
      return;
    }
    
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