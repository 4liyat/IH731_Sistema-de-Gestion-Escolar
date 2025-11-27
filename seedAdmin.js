const { sequelize } = require('./src/config/database');
const Usuario = require('./src/models/Usuario');

const crearAdmin = async () => {
  try {
    // Conectar a la base de datos
    await sequelize.authenticate();
    console.log('✅ Conexión establecida.');

    // Sincronizar modelos (crear tablas si no existen)
    await sequelize.sync();

    // Datos del admin
    const adminData = {
      username: 'admin',
      email: 'admin@escolar.com',
      password: 'AdminPassword123!',
      nombre: 'Super',
      apellidos: 'Admin',
      rol: 'admin',
      activo: true
    };

    // Verificar si ya existe
    const existe = await Usuario.findOne({ where: { username: adminData.username } });
    
    if (existe) {
      console.log('⚠️ El usuario admin ya existe.');
    } else {
      const usuario = await Usuario.create(adminData);
      console.log('🎉 Usuario Administrador creado exitosamente:');
      console.log(`   User: ${adminData.email}`);
      console.log(`   Pass: ${adminData.password}`);
    }

  } catch (error) {
    console.error('❌ Error fatal:', error);
  } finally {
    await sequelize.close();
  }
};

crearAdmin();
