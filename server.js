console.log('INITIAL PROCESS.ENV:', process.env);
delete process.env.DB_USER;
delete process.env.DB_PASSWORD;
require('dotenv').config({ path: './.env' });
console.log('DEBUG: DB_USER =', process.env.DB_USER);
console.log('DEBUG: DB_PASSWORD =', process.env.DB_PASSWORD);
const express = require('express');
const morgan = require('morgan');
const { testConnection, syncDatabase } = require('./src/config/database');
const { sequelize } = require('./src/models'); // Import sequelize instance to load models
const {
  configurarCORS,
  configurarHelmet,
  limitadorGeneral,
  sanitizarDatos,
  logSeguridad
} = require('./src/middlewares/security');

// Importar rutas
const authRoutes = require('./src/routes/authRoutes');
const estudianteRoutes = require('./src/routes/estudianteRoutes');
const cursoRoutes = require('./src/routes/cursoRoutes');
const calificacionRoutes = require('./src/routes/calificacionRoutes');

// Crear aplicación Express
const app = express();
const PORT = process.env.PORT || 3000;

// ==================== MIDDLEWARES DE SEGURIDAD ====================

// Helmet - Headers de seguridad
app.use(configurarHelmet());

// CORS - Control de orígenes
app.use(configurarCORS());

// Rate Limiting - Limitar peticiones
app.use('/api/', limitadorGeneral);

// Logging de seguridad
app.use(logSeguridad);

// Morgan - Logging de peticiones HTTP
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// ==================== MIDDLEWARES GENERALES ====================

// Parser de JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Sanitizar datos de entrada
app.use(sanitizarDatos);

// ==================== RUTAS ====================

// Ruta raíz
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'API de Gestión Escolar',
    version: '1.0.0',
    documentacion: '/api/docs',
    endpoints: {
      autenticacion: '/api/auth',
      estudiantes: '/api/estudiantes',
      cursos: '/api/cursos',
      calificaciones: '/api/calificaciones'
    }
  });
});

// Ruta de salud del servidor
app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Servidor funcionando correctamente',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Rutas de la API
app.use('/api/auth', authRoutes);
app.use('/api/estudiantes', estudianteRoutes);
app.use('/api/cursos', cursoRoutes);
app.use('/api/calificaciones', calificacionRoutes);

// ==================== MANEJO DE ERRORES ====================

// Ruta no encontrada (404)
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Ruta no encontrada',
    path: req.path
  });
});

// Manejador global de errores
app.use((err, req, res, next) => {
  console.error('Error:', err);

  // Error de CORS
  if (err.message === 'No permitido por CORS') {
    return res.status(403).json({
      success: false,
      message: 'Acceso no permitido por política CORS'
    });
  }

  // Error genérico
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Error interno del servidor',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// ==================== INICIAR SERVIDOR ====================

const iniciarServidor = async () => {
  try {
    // Probar conexión a la base de datos
    console.log('🔄 Conectando a la base de datos...');
    const conexionExitosa = await testConnection();

    if (!conexionExitosa) {
      console.error('❌ No se pudo conectar a la base de datos. Verifica la configuración.');
      process.exit(1);
    }

    // Sincronizar modelos con la base de datos
    console.log('🔄 Sincronizando modelos...');
    await syncDatabase(false); // false = no borrar datos existentes

    // Iniciar servidor
    app.listen(PORT, () => {
      console.log('\n✅ ========================================');
      console.log(`✅ Servidor corriendo en puerto ${PORT}`);
      console.log(`✅ Entorno: ${process.env.NODE_ENV || 'development'}`);
      console.log(`✅ URL: http://localhost:${PORT}`);
      console.log('✅ ========================================\n');
      console.log('📚 Endpoints disponibles:');
      console.log(`   POST   /api/auth/registro`);
      console.log(`   POST   /api/auth/login`);
      console.log(`   GET    /api/auth/perfil`);
      console.log(`   GET    /api/estudiantes`);
      console.log(`   POST   /api/estudiantes`);
      console.log(`   GET    /api/cursos`);
      console.log(`   POST   /api/cursos`);
      console.log(`   GET    /api/calificaciones`);
      console.log(`   POST   /api/calificaciones`);
      console.log('\n🔐 Todas las rutas (excepto /auth/registro y /auth/login) requieren token JWT');
      console.log('📖 Usa Postman para probar la API\n');
    });
  } catch (error) {
    console.error('❌ Error al iniciar el servidor:', error);
    process.exit(1);
  }
};

// Manejo de señales para cerrar gracefully
process.on('SIGTERM', () => {
  console.log('👋 SIGTERM recibido. Cerrando servidor...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('👋 SIGINT recibido. Cerrando servidor...');
  process.exit(0);
});

// Iniciar el servidor
iniciarServidor();

module.exports = app;