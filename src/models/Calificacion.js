const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Calificacion = sequelize.define('Calificacion', {
  id_calificacion: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  id_estudiante: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'estudiantes', // This is a string, and refers to the table name
      key: 'id_estudiante'
    }
  },
  id_curso: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'cursos', // This is a string, and refers to the table name
      key: 'id_curso'
    }
  },
  calificacion: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: false,
    validate: {
      min: 0,
      max: 100
    }
  },
  periodo: {
    type: DataTypes.STRING(20),
    allowNull: false
  },
  tipo_evaluacion: {
    type: DataTypes.ENUM('parcial', 'final', 'proyecto', 'tarea', 'examen'),
    allowNull: false,
    defaultValue: 'parcial'
  },
  observaciones: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  fecha_registro: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  fecha_actualizacion: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
    onUpdate: DataTypes.NOW
  }
}, {
  tableName: 'calificaciones',
  timestamps: true,
  createdAt: 'fecha_registro',
  updatedAt: 'fecha_actualizacion'
});

module.exports = Calificacion;
