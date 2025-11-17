require('dotenv').config();
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');

// Middleware para configurar Helmet
const configurarHelmet = () => {
  return helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'"],
        imgSrc: ["'self'", 'data:', 'https:']
      }
    },
    hsts: {
      maxAge: 31536000,
      includeSubDomains: true,
      preload: true
    },
    frameguard: {
      action: 'deny'
    },
    noSniff: true,
    xssFilter: true,
    referrerPolicy: {
      policy: 'no-referrer'
    }
  });
};

// Middleware para configurar CORS
const configurarCORS = () => {
  const allowedOrigins = process.env.ALLOWED_ORIGINS 
    ? process.env.ALLOWED_ORIGINS.split(',') 
    : ['http://localhost:3000']; // Default for development

  return cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) === -1) {
        const msg = 'La política CORS para este sitio no permite el acceso desde el Origen especificado.';
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
  });
};

// Limitador de peticiones general
const limitadorGeneral = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'), // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'), // Max 100 requests per 15 minutes
  message: 'Demasiadas peticiones desde esta IP, por favor intenta de nuevo después de un momento.'
});

// Limitador de peticiones para autenticación (más estricto)
const limitadorAuth = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_AUTH_WINDOW_MS || '900000'), // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_AUTH_MAX_REQUESTS || '5'), // Max 5 failed login attempts per 15 minutes
  message: 'Demasiados intentos de inicio de sesión fallidos desde esta IP, por favor intenta de nuevo después de un momento.',
  skipSuccessfulRequests: true // Don't count successful requests against the limit
});

// Middleware para sanitizar datos de entrada
const sanitizarDatos = (req, res, next) => {
  if (req.body) {
    Object.keys(req.body).forEach(key => {
      if (typeof req.body[key] === 'string') {
        req.body[key] = req.body[key]
          .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // Remove script tags
          .replace(/javascript:/gi, '')   // Remove javascript:
          .replace(/on\w+=/gi, '');       // Remove event handlers like onclick=
      }
    });
  }
  next();
};

// Middleware para logging de seguridad
const logSeguridad = (req, res, next) => {
  const timestamp = new Date().toISOString();
  const ip = req.ip || req.connection.remoteAddress;
  const metodo = req.method;
  const ruta = req.path;
  
  console.log(`[${timestamp}] ${metodo} ${ruta} - IP: ${ip}`);
  next();
};

module.exports = {
  configurarHelmet,
  configurarCORS,
  limitadorGeneral,
  limitadorAuth,
  sanitizarDatos,
  logSeguridad
};
