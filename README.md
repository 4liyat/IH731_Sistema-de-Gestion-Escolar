# 🎓 Sistema de Gestión Escolar - API REST

Sistema de gestión escolar con servicios web RESTful, persistencia de datos y capa de seguridad completa.

![Node.js](https://img.shields.io/badge/Node.js-18+-green)
![Express](https://img.shields.io/badge/Express-4.18-blue)
![MySQL](https://img.shields.io/badge/MySQL-8.0-orange)
![License](https://img.shields.io/badge/License-MIT-yellow)

---

## 📋 Tabla de Contenidos

- [Características](#características)
- [Tecnologías](#tecnologías)
- [Requisitos Previos](#requisitos-previos)
- [Instalación](#instalación)
- [Configuración](#configuración)
- [Uso](#uso)
- [Endpoints de la API](#endpoints-de-la-api)
- [Seguridad](#seguridad)
- [Testing](#testing)

---

## ✨ Características

- ✅ **API REST** completa con operaciones CRUD
- ✅ **Autenticación JWT** con tokens seguros
- ✅ **Autorización basada en roles** (Admin, Profesor, Estudiante)
- ✅ **Encriptación de contraseñas** con Bcrypt
- ✅ **Validación de datos** con express-validator
- ✅ **Rate Limiting** para prevenir abusos
- ✅ **CORS** configurado para seguridad
- ✅ **Headers de seguridad** con Helmet
- ✅ **Base de datos MySQL** con Sequelize ORM
- ✅ **Relaciones entre tablas** (Estudiantes, Cursos, Calificaciones)
- ✅ **Logging** de peticiones y seguridad
- ✅ **Manejo de errores** centralizado

---

## 🛠 Tecnologías

- **Backend**: Node.js + Express.js
- **Base de Datos**: MySQL 8.0+
- **ORM**: Sequelize
- **Autenticación**: JWT (jsonwebtoken)
- **Encriptación**: Bcrypt
- **Validación**: express-validator
- **Seguridad**: Helmet, CORS, Rate Limiting
- **Logging**: Morgan

---

## 📦 Requisitos Previos

Antes de comenzar, asegúrate de tener instalado:

- **Node.js** 18+ ([Descargar](https://nodejs.org/))
- **MySQL** 8.0+ ([Descargar](https://dev.mysql.com/downloads/mysql/))
- **npm** (incluido con Node.js)
- **Git** (opcional, para clonar el repositorio)
- **Postman** o similar para probar la API

---

## 🚀 Instalación

### Paso 1: Descargar el Proyecto

```bash
# Opción A: Clonar repositorio (si aplica)
git clone https://github.com/tu-usuario/gestion-escolar-api.git
cd gestion-escolar-api

# Opción B: Descomprimir archivo ZIP
# Descomprime el archivo y navega a la carpeta
cd gestion-escolar-api
```

### Paso 2: Instalar Dependencias

```bash
npm install
```

Esto instalará todas las dependencias necesarias:
- express, mysql2, sequelize, dotenv, cors
- bcryptjs, jsonwebtoken, express-validator
- helmet, express-rate-limit, morgan

### Paso 3: Configurar Base de Datos

#### 3.1 Crear la Base de Datos

Abre MySQL Workbench o la terminal de MySQL:

```bash
mysql -u root -p
```

Ejecuta el siguiente script:

```sql
-- Crear base de datos
CREATE DATABASE gestion_escolar CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Verificar que se creó correctamente
SHOW DATABASES;

-- Salir
EXIT;
```

#### 3.2 Crear Usuario de Base de Datos (Opcional pero recomendado)

```sql
-- Crear usuario específico para la aplicación
CREATE USER 'app_escolar'@'localhost' IDENTIFIED BY 'password_seguro_123';

-- Dar permisos sobre la base de datos
GRANT ALL PRIVILEGES ON gestion_escolar.* TO 'app_escolar'@'localhost';

-- Aplicar cambios
FLUSH PRIVILEGES;

-- Salir
EXIT;
```

### Paso 4: Configurar Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto:

```bash
# En Windows
copy .env.example .env

# En Mac/Linux
cp .env.example .env
```

Edita el archivo `.env` con tus credenciales:

```env
# Configuración del Servidor
PORT=3000
NODE_ENV=development

# Configuración de Base de Datos
DB_HOST=localhost
DB_USER=root
# O si creaste el usuario específico: DB_USER=app_escolar
DB_PASSWORD=tu_password_mysql
DB_NAME=gestion_escolar
DB_PORT=3306

# Seguridad - JWT
JWT_SECRET=mi_clave_super_secreta_cambiar_en_produccion_minimo_32_caracteres
JWT_EXPIRES_IN=24h

# CORS - Orígenes permitidos
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:4200

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

**⚠️ IMPORTANTE**: 
- Cambia `JWT_SECRET` por una clave aleatoria única
- Usa un password fuerte para MySQL
- Nunca subas el archivo `.env` a Git

### Paso 5: Iniciar el Servidor

```bash
# Modo desarrollo (con auto-reload)
npm run dev

# Modo producción
npm start
```

Si todo está correcto, verás:

```
✅ Conexión a la base de datos establecida correctamente.
✅ Modelos sincronizados con la base de datos.
✅ ========================================
✅ Servidor corriendo en puerto 3000
✅ Entorno: development
✅ URL: http://localhost:3000
✅ ========================================
```

---

## ⚙️ Configuración

### Estructura del Proyecto

```
gestion-escolar-api/
│
├── src/
│   ├── config/
│   │   └── database.js          # Configuración de BD
│   │
│   ├── models/
│   │   ├── Usuario.js           # Modelo de Usuario (autenticación)
│   │   ├── Estudiante.js        # Modelo de Estudiante
│   │   ├── Curso.js             # Modelo de Curso
│   │   └── Calificacion.js      # Modelo de Calificación
│   │
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── estudianteController.js
│   │   ├── cursoController.js
│   │   └── calificacionController.js
│   │
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── estudianteRoutes.js
│   │   ├── cursoRoutes.js
│   │   └── calificacionRoutes.js
│   │
│   └── middlewares/
│       ├── auth.js              # Autenticación JWT y RBAC
│       ├── validator.js         # Validaciones
│       └── security.js          # Seguridad (CORS, Rate Limit, Helmet)
│
├── .env                         # Variables de entorno (NO subir a Git)
├── .gitignore
├── package.json
├── server.js                    # Punto de entrada
└── README.md
```

### Sincronización de Base de Datos

El servidor sincroniza automáticamente los modelos con MySQL al iniciar. Las tablas se crean automáticamente:

- `usuarios` - Para autenticación y roles
- `estudiantes` - Información de estudiantes
- `cursos` - Catálogo de cursos
- `calificaciones` - Relación estudiante-curso-calificación

---

## 🎯 Uso

### 1. Registrar Usuario

Primero necesitas crear un usuario para obtener un token JWT:

**Endpoint**: `POST http://localhost:3000/api/auth/registro`

**Body (JSON)**:
```json
{
  "username": "admin_juan",
  "email": "juan@escuela.edu.mx",
  "password": "Admin123!",
  "rol": "admin"
}
```

**Respuesta**:
```json
{
  "success": true,
  "message": "Usuario registrado exitosamente",
  "data": {
    "usuario": {
      "id_usuario": 1,
      "username": "admin_juan",
      "email": "juan@escuela.edu.mx",
      "rol": "admin"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**⭐ GUARDA EL TOKEN** - Lo necesitarás para todas las peticiones siguientes.

### 2. Iniciar Sesión

**Endpoint**: `POST http://localhost:3000/api/auth/login`

**Body (JSON)**:
```json
{
  "username": "admin_juan",
  "password": "Admin123!"
}
```

### 3. Usar el Token en Peticiones

Para todas las peticiones protegidas, incluye el token en el header:

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**En Postman**:
1. Ir a la pestaña "Authorization"
2. Seleccionar "Bearer Token"
3. Pegar el token

### 4. Crear un Estudiante

**Endpoint**: `POST http://localhost:3000/api/estudiantes`

**Headers**:
```
Authorization: Bearer TU_TOKEN_AQUI
Content-Type: application/json
```

**Body (JSON)**:
```json
{
  "nombre": "María",
  "apellidos": "González López",
  "email": "maria.gonzalez@estudiante.edu.mx",
  "fecha_nacimiento": "2005-08-15",
  "matricula": "2024001",
  "telefono": "3312345678",
  "direccion": "Av. Universidad 123, Guadalajara"
}
```

### 5. Crear un Curso

**Endpoint**: `POST http://localhost:3000/api/cursos`

**Body (JSON)**:
```json
{
  "nombre_curso": "Programación Web Avanzada",
  "codigo_curso": "PWA-301",
  "descripcion": "Desarrollo de aplicaciones web modernas con Node.js y React",
  "creditos": 6,
  "profesor": "Dr. Carlos Ramírez",
  "periodo_academico": "2024-2",
  "cupo_maximo": 30
}
```

### 6. Registrar una Calificación

**Endpoint**: `POST http://localhost:3000/api/calificaciones`

**Body (JSON)**:
```json
{
  "id_estudiante": 1,
  "id_curso": 1,
  "calificacion": 95.5,
  "periodo": "2024-2",
  "tipo_evaluacion": "final",
  "observaciones": "Excelente desempeño"
}
```

---

## 📚 Endpoints de la API

### 🔐 Autenticación (No requieren token)

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | `/api/auth/registro` | Registrar nuevo usuario |
| POST | `/api/auth/login` | Iniciar sesión |

### 👤 Autenticación (Requieren token)

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/auth/perfil` | Obtener perfil del usuario autenticado |
| PUT | `/api/auth/cambiar-password` | Cambiar contraseña |

### 👨‍🎓 Estudiantes (Requieren token)

| Método | Endpoint | Descripción | Roles Permitidos |
|--------|----------|-------------|------------------|
| GET | `/api/estudiantes` | Listar todos los estudiantes | Todos |
| GET | `/api/estudiantes/:id` | Obtener un estudiante | Todos |
| POST | `/api/estudiantes` | Crear estudiante | Admin, Profesor |
| PUT | `/api/estudiantes/:id` | Actualizar estudiante | Admin, Profesor |
| DELETE | `/api/estudiantes/:id` | Eliminar estudiante | Admin |
| GET | `/api/estudiantes/:id/calificaciones` | Calificaciones del estudiante | Todos |

### 📚 Cursos (Requieren token)

| Método | Endpoint | Descripción | Roles Permitidos |
|--------|----------|-------------|------------------|
| GET | `/api/cursos` | Listar todos los cursos | Todos |
| GET | `/api/cursos/:id` | Obtener un curso | Todos |
| POST | `/api/cursos` | Crear curso | Admin, Profesor |
| PUT | `/api/cursos/:id` | Actualizar curso | Admin, Profesor |
| DELETE | `/api/cursos/:id` | Eliminar curso | Admin |
| GET | `/api/cursos/:id/estudiantes` | Estudiantes del curso | Todos |

### 📊 Calificaciones (Requieren token)

| Método | Endpoint | Descripción | Roles Permitidos |
|--------|----------|-------------|------------------|
| GET | `/api/calificaciones` | Listar calificaciones | Todos |
| GET | `/api/calificaciones/:id` | Obtener una calificación | Todos |
| POST | `/api/calificaciones` | Registrar calificación | Admin, Profesor |
| PUT | `/api/calificaciones/:id` | Actualizar calificación | Admin, Profesor |
| DELETE | `/api/calificaciones/:id` | Eliminar calificación | Admin |

---

## 🔒 Seguridad

### Capas de Seguridad Implementadas

1. **Autenticación JWT**: Tokens seguros con expiración
2. **Encriptación Bcrypt**: Contraseñas hasheadas
3. **RBAC**: Control de acceso basado en roles
4. **Validación**: express-validator para datos de entrada
5. **Sanitización**: Limpieza de datos para prevenir XSS
6. **CORS**: Control de orígenes permitidos
7. **Rate Limiting**: Máximo 100 peticiones/15 min
8. **Helmet**: Headers de seguridad HTTP
9. **Logging**: Registro de todas las peticiones

### Roles y Permisos

| Rol | Descripción | Permisos |
|-----|-------------|----------|
| **admin** | Administrador del sistema | Control total |
| **profesor** | Docente | Gestión de cursos y calificaciones |
| **estudiante** | Alumno | Solo consulta de información |

### Validaciones Implementadas

- ✅ Formato de email válido
- ✅ Contraseñas con mayúsculas, minúsculas y números
- ✅ Longitud de campos (min/max)
- ✅ Tipos de datos correctos
- ✅ Valores únicos (email, matrícula, código de curso)
- ✅ Rangos válidos (calificaciones 0-100, edad 5-100)
- ✅ Formatos específicos (fechas, teléfonos, códigos)

---

## 🧪 Testing

### Probar con Postman

#### 1. Importar Colección

Crea una colección en Postman con las siguientes peticiones:

**Colección: Gestión Escolar API**

```
📁 Autenticación
  ├── POST Registro
  └── POST Login

📁 Estudiantes
  ├── GET Listar Estudiantes
  ├── GET Obtener Estudiante
  ├── POST Crear Estudiante
  ├── PUT Actualizar Estudiante
  ├── DELETE Eliminar Estudiante
  └── GET Calificaciones de Estudiante

📁 Cursos
  ├── GET Listar Cursos
  ├── GET Obtener Curso
  ├── POST Crear Curso
  ├── PUT Actualizar Curso
  ├── DELETE Eliminar Curso
  └── GET Estudiantes del Curso

📁 Calificaciones
  ├── GET Listar Calificaciones
  ├── GET Obtener Calificación
  ├── POST Crear Calificación
  ├── PUT Actualizar Calificación
  └── DELETE Eliminar Calificación
```

#### 2. Configurar Variables de Entorno en Postman

Crear una variable `baseUrl` con valor: `http://localhost:3000`
Crear una variable `token` que se actualizará automáticamente al hacer login

#### 3. Secuencia de Pruebas Recomendada

1. ✅ POST Registro (crear usuario admin)
2. ✅ POST Login (obtener token)
3. ✅ POST Crear Estudiante
4. ✅ POST Crear Curso
5. ✅ POST Crear Calificación
6. ✅ GET Listar Estudiantes
7. ✅ GET Calificaciones de Estudiante
8. ✅ GET Estudiantes del Curso

### Comandos de Testing

```bash
# Verificar servidor funcionando
curl http://localhost:3000/health

# Verificar ruta raíz
curl http://localhost:3000/

# Registrar usuario (desde terminal)
curl -X POST http://localhost:3000/api/auth/registro \
  -H "Content-Type: application/json" \
  -d '{"username":"test","email":"test@test.com","password":"Test123!"}'
```

---

## 🐛 Solución de Problemas

### Error: "Cannot connect to MySQL"

**Solución**:
1. Verifica que MySQL esté corriendo:
   ```bash
   # Windows
   services.msc
   
   # Mac
   brew services list
   
   # Linux
   sudo systemctl status mysql
   ```
2. Verifica credenciales en `.env`
3. Prueba conexión manual: `mysql -u root -p`

### Error: "Token inválido"

**Solución**:
1. Verifica que el token no haya expirado (24 horas por defecto)
2. Asegúrate de incluir "Bearer " antes del token
3. Haz login de nuevo para obtener un token nuevo

### Error: "Port 3000 already in use"

**Solución**:
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID [número_proceso] /F

# Mac/Linux
lsof -ti:3000 | xargs kill -9

# O cambiar el puerto en .env
PORT=3001
```

### Errores de Validación

Lee el mensaje de error, indica exactamente qué campo tiene el problema:

```json
{
  "success": false,
  "message": "Errores de validación",
  "errors": [
    {
      "campo": "email",
      "mensaje": "Debe ser un email válido"
    }
  ]
}
```

---

## 📖 Documentación Adicional

- [Documentación de Seguridad](./DOCUMENTACION_SEGURIDAD.md)
- [Guía de Desarrollo](./DESARROLLO.md)
- [API Reference](./API_REFERENCE.md)

---

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

---

## 📄 Licencia

Este proyecto es de uso educativo.

---

## 👨‍💻 Autor

**Tu Nombre**
- Email: tu.email@ejemplo.com
- GitHub: [@tu-usuario](https://github.com/tu-usuario)

---

## 🙏 Agradecimientos

- Node.js y Express.js por el framework
- Sequelize por el excelente ORM
- Comunidad de desarrollo por las librerías de seguridad

---

¿Tienes preguntas? ¡Abre un issue!