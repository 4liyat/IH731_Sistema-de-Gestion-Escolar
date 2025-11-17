const { Curso } = require('../models'); // Import Curso model from index.js

// Obtener todos los cursos
const getAllCursos = async (req, res) => {
  try {
    const cursos = await Curso.findAll();
    res.status(200).json({
      success: true,
      data: cursos
    });
  } catch (error) {
    console.error('Error al obtener cursos:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener cursos',
      error: error.message
    });
  }
};

// Obtener un curso por ID
const getCursoById = async (req, res) => {
  try {
    const { id } = req.params;
    const curso = await Curso.findByPk(id);

    if (!curso) {
      return res.status(404).json({
        success: false,
        message: 'Curso no encontrado'
      });
    }

    res.status(200).json({
      success: true,
      data: curso
    });
  } catch (error) {
    console.error('Error al obtener curso por ID:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener curso',
      error: error.message
    });
  }
};

// Crear un nuevo curso
const createCurso = async (req, res) => {
  try {
    const nuevoCurso = await Curso.create(req.body);
    res.status(201).json({
      success: true,
      message: 'Curso creado exitosamente',
      data: nuevoCurso
    });
  } catch (error) {
    console.error('Error al crear curso:', error);
    res.status(500).json({
      success: false,
      message: 'Error al crear curso',
      error: error.message
    });
  }
};

// Actualizar un curso existente
const updateCurso = async (req, res) => {
  try {
    const { id } = req.params;
    const [updated] = await Curso.update(req.body, {
      where: { id_curso: id }
    });

    if (updated) {
      const updatedCurso = await Curso.findByPk(id);
      return res.status(200).json({
        success: true,
        message: 'Curso actualizado exitosamente',
        data: updatedCurso
      });
    }

    throw new Error('Curso no encontrado');
  } catch (error) {
    console.error('Error al actualizar curso:', error);
    res.status(500).json({
      success: false,
      message: 'Error al actualizar curso',
      error: error.message
    });
  }
};

// Eliminar un curso
const deleteCurso = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Curso.destroy({
      where: { id_curso: id }
    });

    if (deleted) {
      return res.status(200).json({
        success: true,
        message: 'Curso eliminado exitosamente'
      });
    }

    throw new Error('Curso no encontrado');
  } catch (error) {
    console.error('Error al eliminar curso:', error);
    res.status(500).json({
      success: false,
      message: 'Error al eliminar curso',
      error: error.message
    });
  }
};

module.exports = {
  getAllCursos,
  getCursoById,
  createCurso,
  updateCurso,
  deleteCurso
};
