const { Calificacion, Estudiante, Curso } = require('../models'); // Import models from index.js

// Obtener todas las calificaciones
const getAllCalificaciones = async (req, res) => {
  try {
    const calificaciones = await Calificacion.findAll({
      include: [
        { model: Estudiante, as: 'estudiante', attributes: ['id_estudiante', 'nombre', 'apellidos', 'matricula'] },
        { model: Curso, as: 'curso', attributes: ['id_curso', 'nombre_curso', 'codigo_curso'] }
      ]
    });
    res.status(200).json({
      success: true,
      data: calificaciones
    });
  } catch (error) {
    console.error('Error al obtener calificaciones:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener calificaciones',
      error: error.message
    });
  }
};

// Obtener una calificación por ID
const getCalificacionById = async (req, res) => {
  try {
    const { id } = req.params;
    const calificacion = await Calificacion.findByPk(id, {
      include: [
        { model: Estudiante, as: 'estudiante', attributes: ['id_estudiante', 'nombre', 'apellidos', 'matricula'] },
        { model: Curso, as: 'curso', attributes: ['id_curso', 'nombre_curso', 'codigo_curso'] }
      ]
    });

    if (!calificacion) {
      return res.status(404).json({
        success: false,
        message: 'Calificación no encontrada'
      });
    }

    res.status(200).json({
      success: true,
      data: calificacion
    });
  } catch (error) {
    console.error('Error al obtener calificación por ID:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener calificación',
      error: error.message
    });
  }
};

// Crear una nueva calificación
const createCalificacion = async (req, res) => {
  try {
    const nuevaCalificacion = await Calificacion.create(req.body);
    res.status(201).json({
      success: true,
      message: 'Calificación creada exitosamente',
      data: nuevaCalificacion
    });
  } catch (error) {
    console.error('Error al crear calificación:', error);
    res.status(500).json({
      success: false,
      message: 'Error al crear calificación',
      error: error.message
    });
  }
};

// Actualizar una calificación existente
const updateCalificacion = async (req, res) => {
  try {
    const { id } = req.params;
    const [updated] = await Calificacion.update(req.body, {
      where: { id_calificacion: id }
    });

    if (updated) {
      const updatedCalificacion = await Calificacion.findByPk(id, {
        include: [
          { model: Estudiante, as: 'estudiante', attributes: ['id_estudiante', 'nombre', 'apellidos', 'matricula'] },
          { model: Curso, as: 'curso', attributes: ['id_curso', 'nombre_curso', 'codigo_curso'] }
        ]
      });
      return res.status(200).json({
        success: true,
        message: 'Calificación actualizada exitosamente',
        data: updatedCalificacion
      });
    }

    throw new Error('Calificación no encontrada');
  } catch (error) {
    console.error('Error al actualizar calificación:', error);
    res.status(500).json({
      success: false,
      message: 'Error al actualizar calificación',
      error: error.message
    });
  }
};

// Eliminar una calificación
const deleteCalificacion = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Calificacion.destroy({
      where: { id_calificacion: id }
    });

    if (deleted) {
      return res.status(200).json({
        success: true,
        message: 'Calificación eliminada exitosamente'
      });
    }

    throw new Error('Calificación no encontrada');
  } catch (error) {
    console.error('Error al eliminar calificación:', error);
    res.status(500).json({
      success: false,
      message: 'Error al eliminar calificación',
      error: error.message
    });
  }
};

module.exports = {
  getAllCalificaciones,
  getCalificacionById,
  createCalificacion,
  updateCalificacion,
  deleteCalificacion
};
