const { check, validationResult } = require('express-validator');

// Middleware para manejar errores de validación
const manejarErroresValidacion = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Errores de validación',
      errors: errors.array()
    });
  }
  next();
};

// Validaciones para Usuario (registro y login)
const validarRegistro = [
  check('username')
    .trim()
    .notEmpty().withMessage('El nombre de usuario es requerido')
    .isLength({ min: 3, max: 50 }).withMessage('El nombre de usuario debe tener entre 3 y 50 caracteres'),
  check('email')
    .trim()
    .notEmpty().withMessage('El email es requerido')
    .isEmail().withMessage('Debe ser un email válido')
    .normalizeEmail(),
  check('password')
    .notEmpty().withMessage('La contraseña es requerida')
    .isLength({ min: 8 }).withMessage('La contraseña debe tener al menos 8 caracteres')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)
    .withMessage('La contraseña debe contener al menos una mayúscula, una minúscula, un número y un carácter especial'),
  check('rol')
    .optional()
    .isIn(['admin', 'profesor', 'estudiante']).withMessage('Rol inválido'),
  manejarErroresValidacion
];

const validarLogin = [
  check('username')
    .trim()
    .notEmpty().withMessage('El nombre de usuario o email es requerido'),
  check('password')
    .notEmpty().withMessage('La contraseña es requerida'),
  manejarErroresValidacion
];

const validarCambioPassword = [
  check('passwordActual')
    .notEmpty().withMessage('La contraseña actual es requerida'),
  check('passwordNuevo')
    .notEmpty().withMessage('La nueva contraseña es requerida')
    .isLength({ min: 8 }).withMessage('La nueva contraseña debe tener al menos 8 caracteres')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)
    .withMessage('La nueva contraseña debe contener al menos una mayúscula, una minúscula, un número y un carácter especial'),
  manejarErroresValidacion
];

// Validaciones para Estudiante
const validarEstudiante = [
  check('nombre')
    .trim()
    .notEmpty().withMessage('El nombre es requerido')
    .isLength({ min: 2, max: 100 }).withMessage('El nombre debe tener entre 2 y 100 caracteres')
    .matches(/^[a-záéíóúñA-ZÁÉÍÓÚÑ\s]+$/).withMessage('El nombre solo puede contener letras y espacios'),
  check('apellidos')
    .trim()
    .notEmpty().withMessage('Los apellidos son requeridos')
    .isLength({ min: 2, max: 100 }).withMessage('Los apellidos deben tener entre 2 y 100 caracteres')
    .matches(/^[a-záéíóúñA-ZÁÉÍÓÚÑ\s]+$/).withMessage('Los apellidos solo pueden contener letras y espacios'),
  check('email')
    .trim()
    .notEmpty().withMessage('El email es requerido')
    .isEmail().withMessage('Debe ser un email válido')
    .normalizeEmail(),
  check('fecha_nacimiento')
    .notEmpty().withMessage('La fecha de nacimiento es requerida')
    .isISO8601().toDate().withMessage('Formato de fecha de nacimiento inválido (YYYY-MM-DD)'),
  check('matricula')
    .trim()
    .notEmpty().withMessage('La matrícula es requerida')
    .isLength({ min: 5, max: 20 }).withMessage('La matrícula debe tener entre 5 y 20 caracteres')
    .matches(/^[a-zA-Z0-9-]+$/).withMessage('La matrícula solo puede contener letras, números y guiones'),
  check('telefono')
    .optional({ checkFalsy: true })
    .isMobilePhone('any').withMessage('Número de teléfono inválido'),
  check('direccion')
    .optional({ checkFalsy: true })
    .isLength({ max: 255 }).withMessage('La dirección no puede exceder los 255 caracteres'),
  manejarErroresValidacion
];

// Validaciones para Curso
const validarCurso = [
  check('nombre_curso')
    .trim()
    .notEmpty().withMessage('El nombre del curso es requerido')
    .isLength({ min: 3, max: 150 }).withMessage('El nombre del curso debe tener entre 3 y 150 caracteres'),
  check('codigo_curso')
    .trim()
    .notEmpty().withMessage('El código del curso es requerido')
    .isLength({ min: 3, max: 20 }).withMessage('El código del curso debe tener entre 3 y 20 caracteres')
    .matches(/^[a-zA-Z0-9-]+$/).withMessage('El código del curso solo puede contener letras, números y guiones'),
  check('descripcion')
    .optional({ checkFalsy: true })
    .isLength({ max: 500 }).withMessage('La descripción no puede exceder los 500 caracteres'),
  check('creditos')
    .notEmpty().withMessage('Los créditos son requeridos')
    .isInt({ min: 1, max: 10 }).withMessage('Los créditos deben ser un número entero entre 1 y 10'),
  check('profesor')
    .trim()
    .notEmpty().withMessage('El nombre del profesor es requerido')
    .isLength({ min: 3, max: 150 }).withMessage('El nombre del profesor debe tener entre 3 y 150 caracteres'),
  check('periodo_academico')
    .trim()
    .notEmpty().withMessage('El período académico es requerido')
    .isLength({ min: 4, max: 20 }).withMessage('El período académico debe tener entre 4 y 20 caracteres'),
  check('cupo_maximo')
    .notEmpty().withMessage('El cupo máximo es requerido')
    .isInt({ min: 1, max: 100 }).withMessage('El cupo máximo debe ser un número entero entre 1 y 100'),
  manejarErroresValidacion
];

// Validaciones para Calificacion
const validarCalificacion = [
  check('id_estudiante')
    .notEmpty().withMessage('El ID del estudiante es requerido')
    .isInt().withMessage('El ID del estudiante debe ser un número entero'),
  check('id_curso')
    .notEmpty().withMessage('El ID del curso es requerido')
    .isInt().withMessage('El ID del curso debe ser un número entero'),
  check('calificacion')
    .notEmpty().withMessage('La calificación es requerida')
    .isFloat({ min: 0, max: 100 }).withMessage('La calificación debe ser un número entre 0 y 100'),
  check('periodo')
    .trim()
    .notEmpty().withMessage('El período es requerido')
    .isLength({ min: 4, max: 20 }).withMessage('El período debe tener entre 4 y 20 caracteres'),
  check('tipo_evaluacion')
    .notEmpty().withMessage('El tipo de evaluación es requerido')
    .isIn(['parcial', 'final', 'proyecto', 'tarea', 'examen']).withMessage('Tipo de evaluación inválido'),
  check('observaciones')
    .optional({ checkFalsy: true })
    .isLength({ max: 500 }).withMessage('Las observaciones no pueden exceder los 500 caracteres'),
  manejarErroresValidacion
];

module.exports = {
  manejarErroresValidacion,
  validarRegistro,
  validarLogin,
  validarCambioPassword,
  validarEstudiante,
  validarCurso,
  validarCalificacion
};
