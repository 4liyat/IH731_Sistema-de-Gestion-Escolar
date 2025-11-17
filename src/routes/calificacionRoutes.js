const express = require('express');
const router = express.Router();
const calificacionController = require('../controllers/calificacionController');
const { verificarToken, verificarRol } = require('../middlewares/auth');
const { validarCalificacion } = require('../middlewares/validator');

// Rutas para Calificaciones
// Todas las rutas requieren autenticación (verificarToken)

// Obtener todas las calificaciones (Admin, Profesor, Estudiante pueden ver)
router.get('/', verificarToken, calificacionController.getAllCalificaciones);

// Obtener una calificación por ID (Admin, Profesor, Estudiante pueden ver)
router.get('/:id', verificarToken, calificacionController.getCalificacionById);

// Crear una nueva calificación (Admin, Profesor)
router.post('/', verificarToken, verificarRol('admin', 'profesor'), validarCalificacion, calificacionController.createCalificacion);

// Actualizar una calificación existente (Admin, Profesor)
router.put('/:id', verificarToken, verificarRol('admin', 'profesor'), validarCalificacion, calificacionController.updateCalificacion);

// Eliminar una calificación (Solo Admin)
router.delete('/:id', verificarToken, verificarRol('admin'), calificacionController.deleteCalificacion);

module.exports = router;
