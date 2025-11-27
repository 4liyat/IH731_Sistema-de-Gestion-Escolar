const jwt = require('jsonwebtoken');
const Usuario = require('../models/Usuario');

/**
 * Generar token JWT
 */
const generarToken = (usuario) => {
  return jwt.sign(
    {
      id_usuario: usuario.id_usuario,
      username: usuario.username,
      rol: usuario.rol
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN || '24h'
    }
  );
};

/**
 * Registrar nuevo usuario
 * POST /api/auth/registro
 */
const registro = async (req, res) => {
  try {
    const { username, email, password, rol } = req.body;

    // Verificar si el usuario ya existe
    const usuarioExistente = await Usuario.findOne({
      where: {
        $or: [{ username }, { email }]
      }
    });

    if (usuarioExistente) {
      return res.status(400).json({
        success: false,
        message: 'El username o email ya están registrados'
      });
    }

    console.log('DEBUG: req.body en registro:', req.body);
    console.log('DEBUG: Datos para Usuario.create:', { username, email, password, rol: rol || 'estudiante' });
    // Crear nuevo usuario (el password se encripta automáticamente con el hook)
    const nuevoUsuario = await Usuario.create({
      username,
      email,
      password,
      rol: rol || 'estudiante'
    });

    // Generar token
    const token = generarToken(nuevoUsuario);

    res.status(201).json({
      success: true,
      message: 'Usuario registrado exitosamente',
      data: {
        usuario: nuevoUsuario.toJSON(),
        token
      }
    });
  } catch (error) {
    console.error('Error COMPLETO en registro:', error); // Log full object
    res.status(500).json({
      success: false,
      message: 'Error al registrar usuario',
      error: error.message,
      details: JSON.stringify(error) // Send details to client for visibility
    });
  }
};

/**
 * Iniciar sesión
 * POST /api/auth/login
 */
const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Buscar usuario por username o email
    const usuario = await Usuario.findOne({
      where: {
        $or: [
          { username },
          { email: username }
        ]
      }
    });

    if (!usuario) {
      return res.status(401).json({
        success: false,
        message: 'Credenciales inválidas'
      });
    }

    // Verificar si el usuario está activo
    if (!usuario.activo) {
      return res.status(403).json({
        success: false,
        message: 'Usuario inactivo. Contacta al administrador.'
      });
    }

    // Validar contraseña
    const passwordValido = await usuario.validarPassword(password);
    if (!passwordValido) {
      return res.status(401).json({
        success: false,
        message: 'Credenciales inválidas'
      });
    }

    // Generar token
    const token = generarToken(usuario);

    res.json({
      success: true,
      message: 'Inicio de sesión exitoso',
      data: {
        usuario: usuario.toJSON(),
        token
      }
    });
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({
      success: false,
      message: 'Error al iniciar sesión',
      error: error.message
    });
  }
};

/**
 * Obtener perfil del usuario autenticado
 * GET /api/auth/perfil
 */
const obtenerPerfil = async (req, res) => {
  try {
    const usuario = await Usuario.findByPk(req.usuario.id_usuario);

    if (!usuario) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }

    res.json({
      success: true,
      data: usuario.toJSON()
    });
  } catch (error) {
    console.error('Error al obtener perfil:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener perfil',
      error: error.message
    });
  }
};

/**
 * Cambiar contraseña
 * PUT /api/auth/cambiar-password
 */
const cambiarPassword = async (req, res) => {
  try {
    const { passwordActual, passwordNuevo } = req.body;

    const usuario = await Usuario.findByPk(req.usuario.id_usuario);

    if (!usuario) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }

    // Verificar contraseña actual
    const passwordValido = await usuario.validarPassword(passwordActual);
    if (!passwordValido) {
      return res.status(401).json({
        success: false,
        message: 'Contraseña actual incorrecta'
      });
    }

    // Actualizar contraseña (se encripta automáticamente con el hook)
    usuario.password = passwordNuevo;
    await usuario.save();

    res.json({
      success: true,
      message: 'Contraseña actualizada exitosamente'
    });
  } catch (error) {
    console.error('Error al cambiar contraseña:', error);
    res.status(500).json({
      success: false,
      message: 'Error al cambiar contraseña',
      error: error.message
    });
  }
};

module.exports = {
  registro,
  login,
  obtenerPerfil,
  cambiarPassword
};