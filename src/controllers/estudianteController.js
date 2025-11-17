const { Estudiante } = require('../models'); // Import Estudiante model from index.js

// Obtener todos los estudiantes
const getAllEstudiantes = async (req, res) => {
  try {
    const estudiantes = await Estudiante.findAll();
    res.status(200).json({
      success: true,
      data: estudiantes
    });
  } catch (error) {
    console.error('Error al obtener estudiantes:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener estudiantes',
      error: error.message
    });
  }
};

// Obtener un estudiante por ID
const getEstudianteById = async (req, res) => {
  try {
    const { id } = req.params;
    const estudiante = await Estudiante.findByPk(id);

    if (!estudiante) {
      return res.status(404).json({
        success: false,
        message: 'Estudiante no encontrado'
      });
    }

    res.status(200).json({
      success: true,
      data: estudiante
    });
  } catch (error) {
    console.error('Error al obtener estudiante por ID:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener estudiante',
      error: error.message
    });
  }
};

// Crear un nuevo estudiante
const createEstudiante = async (req, res) => {
  try {
    const nuevoEstudiante = await Estudiante.create(req.body);
    res.status(201).json({
      success: true,
      message: 'Estudiante creado exitosamente',
      data: nuevoEstudiante
    });
  } catch (error) {
    console.error('Error al crear estudiante:', error);
    res.status(500).json({
      success: false,
      message: 'Error al crear estudiante',
      error: error.message
    });
  }
};

// Actualizar un estudiante existente
const updateEstudiante = async (req, res) => {
  try {
    const { id } = req.params;
    const [updated] = await Estudiante.update(req.body, {
      where: { id_estudiante: id }
    });

    if (updated) {
      const updatedEstudiante = await Estudiante.findByPk(id);
      return res.status(200).json({
        success: true,
        message: 'Estudiante actualizado exitosamente',
        data: updatedEstudiante
      });
    }

    throw new Error('Estudiante no encontrado');
  } catch (error) {
    console.error('Error al actualizar estudiante:', error);
    res.status(500).json({
      success: false,
      message: 'Error al actualizar estudiante',
      error: error.message
    });
  }
};

// Eliminar un estudiante
const deleteEstudiante = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Estudiante.destroy({
      where: { id_estudiante: id }
    });

    if (deleted) {
      return res.status(200).json({
        success: true,
        message: 'Estudiante eliminado exitosamente'
      });
    }

    throw new Error('Estudiante no encontrado');
  } catch (error) {
    console.error('Error al eliminar estudiante:', error);
    res.status(500).json({
      success: false,
      message: 'Error al eliminar estudiante',
      error: error.message
    });
  }
};

module.exports = {
  getAllEstudiantes,
  getEstudianteById,
  createEstudiante,
  updateEstudiante,
  deleteEstudiante
};
