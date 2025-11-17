const express = require('express');
const router = express.Router();
const cursoController = require('../controllers/cursoController');
const { verificarToken, verificarRol } = require('../middlewares/auth');
const { validarCurso } = require('../middlewares/validator');

// Rutas para Cursos
// Todas las rutas requieren autenticación (verificarToken)

// Obtener todos los cursos (Admin, Profesor, Estudiante pueden ver)
router.get('/', verificarToken, cursoController.getAllCursos);

// Obtener un curso por ID (Admin, Profesor, Estudiante pueden ver)
router.get('/:id', verificarToken, cursoController.getCursoById);

// Crear un nuevo curso (Admin, Profesor)
router.post('/', verificarToken, verificarRol('admin', 'profesor'), validarCurso, cursoController.createCurso);

// Actualizar un curso existente (Admin, Profesor)
router.put('/:id', verificarToken, verificarRol('admin', 'profesor'), validarCurso, cursoController.updateCurso);

// Eliminar un curso (Solo Admin)
router.delete('/:id', verificarToken, verificarRol('admin'), cursoController.deleteCurso);

module.exports = router;
