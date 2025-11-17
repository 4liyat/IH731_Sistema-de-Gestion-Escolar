const express = require('express');
const router = express.Router();
const estudianteController = require('../controllers/estudianteController');
const { verificarToken, verificarRol } = require('../middlewares/auth');
const { validarEstudiante } = require('../middlewares/validator');

// Rutas para Estudiantes
// Todas las rutas requieren autenticación (verificarToken)

// Obtener todos los estudiantes (Admin, Profesor, Estudiante pueden ver)
router.get('/', verificarToken, estudianteController.getAllEstudiantes);

// Obtener un estudiante por ID (Admin, Profesor, Estudiante pueden ver)
router.get('/:id', verificarToken, estudianteController.getEstudianteById);

// Crear un nuevo estudiante (Admin, Profesor)
router.post('/', verificarToken, verificarRol('admin', 'profesor'), validarEstudiante, estudianteController.createEstudiante);

// Actualizar un estudiante existente (Admin, Profesor)
router.put('/:id', verificarToken, verificarRol('admin', 'profesor'), validarEstudiante, estudianteController.updateEstudiante);

// Eliminar un estudiante (Solo Admin)
router.delete('/:id', verificarToken, verificarRol('admin'), estudianteController.deleteEstudiante);

module.exports = router;
