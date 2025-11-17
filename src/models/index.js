const { sequelize } = require('../config/database');
const Usuario = require('./Usuario');
const Estudiante = require('./Estudiante');
const Curso = require('./Curso');
const Calificacion = require('./Calificacion');

// Define associations
// Estudiante - Calificacion (One-to-Many)
Estudiante.hasMany(Calificacion, {
  foreignKey: 'id_estudiante',
  as: 'calificaciones'
});
Calificacion.belongsTo(Estudiante, {
  foreignKey: 'id_estudiante',
  as: 'estudiante'
});

// Curso - Calificacion (One-to-Many)
Curso.hasMany(Calificacion, {
  foreignKey: 'id_curso',
  as: 'calificaciones'
});
Calificacion.belongsTo(Curso, {
  foreignKey: 'id_curso',
  as: 'curso'
});

// Export models and sequelize instance
module.exports = {
  sequelize,
  Usuario,
  Estudiante,
  Curso,
  Calificacion
};
