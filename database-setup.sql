-- ============================================
-- SCRIPT DE CONFIGURACIÓN DE BASE DE DATOS
-- Sistema de Gestión Escolar
-- ============================================

-- Crear base de datos si no existe
CREATE DATABASE IF NOT EXISTS gestion_escolar 
  CHARACTER SET utf8mb4 
  COLLATE utf8mb4_unicode_ci;

-- Usar la base de datos
USE gestion_escolar;

-- ============================================
-- CREAR USUARIO DE APLICACIÓN (OPCIONAL)
-- ============================================

-- Descomentar las siguientes líneas para crear un usuario específico
-- CREATE USER IF NOT EXISTS 'app_escolar'@'localhost' IDENTIFIED BY 'password_seguro_123';
-- GRANT ALL PRIVILEGES ON gestion_escolar.* TO 'app_escolar'@'localhost';
-- FLUSH PRIVILEGES;

-- ============================================
-- ELIMINAR TABLAS EXISTENTES (SI APLICA)
-- ============================================

-- Desactivar verificación de claves foráneas temporalmente
SET FOREIGN_KEY_CHECKS = 0;

-- Eliminar tablas en orden inverso a dependencias
DROP TABLE IF EXISTS calificaciones;
DROP TABLE IF EXISTS cursos;
DROP TABLE IF EXISTS estudiantes;
DROP TABLE IF EXISTS usuarios;

-- Reactivar verificación de claves foráneas
SET FOREIGN_KEY_CHECKS = 1;

-- ============================================
-- TABLA: USUARIOS
-- Para autenticación y control de acceso
-- ============================================

CREATE TABLE usuarios (
  id_usuario INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  rol ENUM('admin', 'profesor', 'estudiante') DEFAULT 'estudiante' NOT NULL,
  activo BOOLEAN DEFAULT TRUE,
  fecha_registro DATETIME DEFAULT CURRENT_TIMESTAMP,
  fecha_actualizacion DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  INDEX idx_username (username),
  INDEX idx_email (email),
  INDEX idx_rol (rol)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABLA: ESTUDIANTES
-- Información de estudiantes registrados
-- ============================================

CREATE TABLE estudiantes (
  id_estudiante INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  apellidos VARCHAR(100) NOT NULL,
  email VARCHAR(150) UNIQUE NOT NULL,
  fecha_nacimiento DATE NOT NULL,
  matricula VARCHAR(20) UNIQUE NOT NULL,
  telefono VARCHAR(15) NULL,
  direccion TEXT NULL,
  activo BOOLEAN DEFAULT TRUE,
  fecha_registro DATETIME DEFAULT CURRENT_TIMESTAMP,
  fecha_actualizacion DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  INDEX idx_matricula (matricula),
  INDEX idx_email (email),
  INDEX idx_nombre_apellidos (nombre, apellidos),
  INDEX idx_activo (activo)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABLA: CURSOS
-- Catálogo de cursos ofrecidos
-- ============================================

CREATE TABLE cursos (
  id_curso INT AUTO_INCREMENT PRIMARY KEY,
  nombre_curso VARCHAR(150) NOT NULL,
  codigo_curso VARCHAR(20) UNIQUE NOT NULL,
  descripcion TEXT NULL,
  creditos INT NOT NULL DEFAULT 3,
  profesor VARCHAR(150) NOT NULL,
  periodo_academico VARCHAR(20) NOT NULL,
  cupo_maximo INT DEFAULT 30,
  activo BOOLEAN DEFAULT TRUE,
  fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP,
  fecha_actualizacion DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  INDEX idx_codigo_curso (codigo_curso),
  INDEX idx_periodo (periodo_academico),
  INDEX idx_profesor (profesor),
  INDEX idx_activo (activo),
  
  CHECK (creditos >= 1 AND creditos <= 10),
  CHECK (cupo_maximo >= 1 AND cupo_maximo <= 100)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABLA: CALIFICACIONES
-- Registro de calificaciones estudiante-curso
-- ============================================

CREATE TABLE calificaciones (
  id_calificacion INT AUTO_INCREMENT PRIMARY KEY,
  id_estudiante INT NOT NULL,
  id_curso INT NOT NULL,
  calificacion DECIMAL(5,2) NOT NULL,
  periodo VARCHAR(20) NOT NULL,
  tipo_evaluacion ENUM('parcial', 'final', 'proyecto', 'tarea', 'examen') DEFAULT 'parcial',
  observaciones TEXT NULL,
  fecha_registro DATETIME DEFAULT CURRENT_TIMESTAMP,
  fecha_actualizacion DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  FOREIGN KEY (id_estudiante) REFERENCES estudiantes(id_estudiante) ON DELETE CASCADE,
  FOREIGN KEY (id_curso) REFERENCES cursos(id_curso) ON DELETE CASCADE,
  
  INDEX idx_estudiante (id_estudiante),
  INDEX idx_curso (id_curso),
  INDEX idx_periodo (periodo),
  INDEX idx_tipo_evaluacion (tipo_evaluacion),
  INDEX idx_estudiante_curso (id_estudiante, id_curso),
  
  CHECK (calificacion >= 0 AND calificacion <= 100)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- DATOS DE EJEMPLO (OPCIONAL)
-- ============================================

-- Insertar usuarios de ejemplo (las contraseñas están hasheadas con bcrypt)
-- Password para todos: "Admin123!"
INSERT INTO usuarios (username, email, password, rol) VALUES
('admin', 'admin@escuela.edu.mx', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'admin'),
('prof_carlos', 'carlos@escuela.edu.mx', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'profesor'),
('est_maria', 'maria@estudiante.edu.mx', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'estudiante');

-- Insertar estudiantes de ejemplo
INSERT INTO estudiantes (nombre, apellidos, email, fecha_nacimiento, matricula, telefono, direccion) VALUES
('María', 'González López', 'maria.gonzalez@estudiante.edu.mx', '2005-03-15', '2024001', '3312345678', 'Av. Universidad 123, Guadalajara'),
('Juan', 'Pérez García', 'juan.perez@estudiante.edu.mx', '2004-07-22', '2024002', '3398765432', 'Calle Reforma 456, Zapopan'),
('Ana', 'Martínez Rodríguez', 'ana.martinez@estudiante.edu.mx', '2005-11-08', '2024003', '3387654321', 'Av. Chapultepec 789, Guadalajara'),
('Carlos', 'López Hernández', 'carlos.lopez@estudiante.edu.mx', '2004-05-19', '2024004', '3376543210', 'Calle Juárez 321, Tlaquepaque'),
('Laura', 'Ramírez Silva', 'laura.ramirez@estudiante.edu.mx', '2005-09-30', '2024005', '3365432109', 'Av. Américas 654, Guadalajara');

-- Insertar cursos de ejemplo
INSERT INTO cursos (nombre_curso, codigo_curso, descripcion, creditos, profesor, periodo_academico, cupo_maximo) VALUES
('Programación Web Avanzada', 'PWA-301', 'Desarrollo de aplicaciones web modernas con Node.js y React', 6, 'Dr. Carlos Ramírez', '2024-2', 30),
('Base de Datos', 'BD-201', 'Diseño, implementación y administración de bases de datos relacionales', 5, 'Mtra. Patricia Gómez', '2024-2', 35),
('Estructuras de Datos', 'ED-202', 'Algoritmos y estructuras de datos fundamentales', 6, 'Dr. Roberto Sánchez', '2024-2', 30),
('Desarrollo Móvil', 'DM-302', 'Creación de aplicaciones móviles nativas e híbridas', 5, 'Mtro. Luis Torres', '2024-2', 25),
('Seguridad Informática', 'SI-401', 'Principios y prácticas de seguridad en sistemas informáticos', 4, 'Dra. Ana Flores', '2024-2', 28);

-- Insertar calificaciones de ejemplo
INSERT INTO calificaciones (id_estudiante, id_curso, calificacion, periodo, tipo_evaluacion, observaciones) VALUES
-- María (id_estudiante: 1)
(1, 1, 95.50, '2024-2', 'parcial', 'Excelente desempeño en proyecto web'),
(1, 2, 88.00, '2024-2', 'parcial', 'Buen dominio de SQL'),
(1, 3, 92.75, '2024-2', 'final', 'Implementación correcta de algoritmos'),

-- Juan (id_estudiante: 2)
(2, 1, 85.00, '2024-2', 'parcial', 'Buen trabajo en equipo'),
(2, 2, 90.50, '2024-2', 'final', 'Excelente diseño de base de datos'),
(2, 4, 87.25, '2024-2', 'proyecto', 'App móvil funcional y bien diseñada'),

-- Ana (id_estudiante: 3)
(3, 2, 93.00, '2024-2', 'parcial', 'Dominio de normalización'),
(3, 3, 89.50, '2024-2', 'parcial', 'Buena comprensión de estructuras'),
(3, 5, 96.00, '2024-2', 'final', 'Excelente análisis de vulnerabilidades'),

-- Carlos (id_estudiante: 4)
(4, 1, 78.50, '2024-2', 'parcial', 'Mejorar en frontend'),
(4, 4, 92.00, '2024-2', 'proyecto', 'Aplicación innovadora'),
(4, 5, 85.75, '2024-2', 'final', 'Buen entendimiento de criptografía'),

-- Laura (id_estudiante: 5)
(5, 1, 91.00, '2024-2', 'final', 'API REST bien estructurada'),
(5, 3, 87.50, '2024-2', 'parcial', 'Buena implementación de árboles'),
(5, 4, 94.25, '2024-2', 'proyecto', 'UI/UX excepcional');

-- ============================================
-- VERIFICAR INSTALACIÓN
-- ============================================

-- Contar registros en cada tabla
SELECT 'usuarios' as tabla, COUNT(*) as registros FROM usuarios
UNION ALL
SELECT 'estudiantes' as tabla, COUNT(*) as registros FROM estudiantes
UNION ALL
SELECT 'cursos' as tabla, COUNT(*) as registros FROM cursos
UNION ALL
SELECT 'calificaciones' as tabla, COUNT(*) as registros FROM calificaciones;

-- Mostrar información de tablas
SHOW TABLES;

-- Descripción de tabla usuarios
DESCRIBE usuarios;

-- Descripción de tabla estudiantes
DESCRIBE estudiantes;

-- Descripción de tabla cursos
DESCRIBE cursos;

-- Descripción de tabla calificaciones
DESCRIBE calificaciones;

-- ============================================
-- CONSULTAS ÚTILES PARA VERIFICACIÓN
-- ============================================

-- Ver todos los usuarios
SELECT id_usuario, username, email, rol, activo FROM usuarios;

-- Ver todos los estudiantes
SELECT id_estudiante, nombre, apellidos, matricula, email FROM estudiantes;

-- Ver todos los cursos
SELECT id_curso, nombre_curso, codigo_curso, profesor, periodo_academico FROM cursos;

-- Ver calificaciones con información completa
SELECT 
    c.id_calificacion,
    e.nombre AS estudiante_nombre,
    e.apellidos AS estudiante_apellidos,
    e.matricula,
    cu.nombre_curso,
    cu.codigo_curso,
    c.calificacion,
    c.tipo_evaluacion,
    c.periodo
FROM calificaciones c
INNER JOIN estudiantes e ON c.id_estudiante = e.id_estudiante
INNER JOIN cursos cu ON c.id_curso = cu.id_curso
ORDER BY e.apellidos, e.nombre;

-- Promedio de calificaciones por estudiante
SELECT 
    e.id_estudiante,
    e.nombre,
    e.apellidos,
    e.matricula,
    COUNT(c.id_calificacion) AS total_calificaciones,
    ROUND(AVG(c.calificacion), 2) AS promedio
FROM estudiantes e
LEFT JOIN calificaciones c ON e.id_estudiante = c.id_estudiante
GROUP BY e.id_estudiante, e.nombre, e.apellidos, e.matricula
ORDER BY promedio DESC;

-- Estudiantes por curso
SELECT 
    cu.nombre_curso,
    cu.codigo_curso,
    cu.profesor,
    COUNT(DISTINCT c.id_estudiante) AS total_estudiantes
FROM cursos cu
LEFT JOIN calificaciones c ON cu.id_curso = c.id_curso
GROUP BY cu.id_curso, cu.nombre_curso, cu.codigo_curso, cu.profesor
ORDER BY total_estudiantes DESC;

-- ============================================
-- SCRIPT COMPLETADO
-- ============================================

SELECT '✅ Base de datos configurada exitosamente' AS mensaje;