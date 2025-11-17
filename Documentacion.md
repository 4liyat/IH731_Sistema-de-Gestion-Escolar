# DOCUMENTACIÓN DE LA CAPA DE SEGURIDAD
## Sistema de Gestión Escolar - API REST

---

## 1. INTRODUCCIÓN

Este documento explica en detalle la **capa de seguridad implementada** en el Sistema de Gestión Escolar. La seguridad es un componente crítico que protege la información sensible de estudiantes, cursos y calificaciones contra accesos no autorizados, ataques maliciosos y pérdida de datos.

### 1.1 Objetivos de la Capa de Seguridad

- **Autenticación**: Verificar la identidad de los usuarios
- **Autorización**: Controlar qué pueden hacer los usuarios según su rol
- **Confidencialidad**: Proteger la información sensible mediante encriptación
- **Integridad**: Asegurar que los datos no sean manipulados
- **Disponibilidad**: Prevenir ataques que puedan afectar el servicio
- **Trazabilidad**: Registrar acciones para auditoría

---

## 2. COMPONENTES DE SEGURIDAD IMPLEMENTADOS

### 2.1 Autenticación JWT (JSON Web Tokens)

#### ¿Qué es JWT?
JWT es un estándar abierto (RFC 7519) que define una forma compacta y autónoma de transmitir información entre partes como un objeto JSON de forma segura.

#### Implementación en el Proyecto

**Archivo**: `src/middlewares/auth.js`

**Características**:
- ✅ Tokens firmados digitalmente con clave secreta
- ✅ Tiempo de expiración configurable (24 horas por defecto)
- ✅ Información del usuario embebida en el token
- ✅ Verificación automática en cada petición protegida

**Flujo de Autenticación**:

```
1. Usuario se registra o inicia sesión
   ↓
2. Servidor valida credenciales
   ↓
3. Servidor genera token JWT con información del usuario
   ↓
4. Cliente recibe el token y lo guarda
   ↓
5. Cliente incluye token en header Authorization de cada petición
   ↓
6. Servidor verifica token antes de procesar la petición
```

**Estructura del Token**:
```javascript
{
  "id_usuario": 1,
  "username": "juan_admin",
  "rol": "admin",
  "iat": 1699564800,  // Fecha de emisión
  "exp": 1699651200   // Fecha de expiración
}
```

**Ejemplo de uso**:
```javascript
// Generar token al hacer login
const token = jwt.sign(
  { id_usuario, username, rol },
  process.env.JWT_SECRET,
  { expiresIn: '24h' }
);

// Verificar token en peticiones
const decoded = jwt.verify(token, process.env.JWT_SECRET);
```

**Ventajas**:
- ✅ Stateless (no requiere almacenar sesiones en servidor)
- ✅ Escalable horizontalmente
- ✅ Funciona bien con arquitecturas de microservicios
- ✅ Compatible con aplicaciones móviles y SPAs

---

### 2.2 Encriptación de Contraseñas con Bcrypt

#### ¿Qué es Bcrypt?
Bcrypt es una función de hashing diseñada específicamente para contraseñas. Incorpora sal (salt) automáticamente y es computacionalmente costosa para prevenir ataques de fuerza bruta.

#### Implementación en el Proyecto

**Archivo**: `src/models/Usuario.js`

**Características**:
- ✅ Hash unidireccional (no se puede revertir)
- ✅ Salt automático único para cada contraseña
- ✅ Factor de trabajo configurable (10 rounds por defecto)
- ✅ Protección contra rainbow tables

**Proceso de encriptación**:

```javascript
// Hook de Sequelize - se ejecuta automáticamente antes de crear usuario
beforeCreate: async (usuario) => {
  if (usuario.password) {
    const salt = await bcrypt.genSalt(10);  // Genera salt
    usuario.password = await bcrypt.hash(usuario.password, salt);  // Hashea
  }
}

// Validación de contraseña
Usuario.prototype.validarPassword = async function(password) {
  return await bcrypt.compare(password, this.password);
};
```

**Ejemplo de transformación**:
```
Contraseña original:  "MiPassword123!"
Salt generado:        "$2a$10$N9qo8uLOickgx2ZMRZoMye"
Hash almacenado:      "$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy"
```

**Ventajas**:
- ✅ Imposible obtener la contraseña original del hash
- ✅ Cada contraseña tiene un hash único (gracias al salt)
- ✅ Lento por diseño para prevenir fuerza bruta
- ✅ Estándar de la industria

---

### 2.3 Control de Acceso Basado en Roles (RBAC)

#### ¿Qué es RBAC?
Role-Based Access Control es un modelo de seguridad que restringe el acceso al sistema basándose en los roles de los usuarios.

#### Implementación en el Proyecto

**Archivo**: `src/middlewares/auth.js`

**Roles Definidos**:
1. **admin**: Control total del sistema
2. **profesor**: Gestión de cursos y calificaciones
3. **estudiante**: Solo consulta de información propia

**Matriz de Permisos**:

| Acción | Admin | Profesor | Estudiante |
|--------|-------|----------|------------|
| Ver estudiantes | ✅ | ✅ | ✅ |
| Crear estudiantes | ✅ | ✅ | ❌ |
| Editar estudiantes | ✅ | ✅ | ❌ |
| Eliminar estudiantes | ✅ | ❌ | ❌ |
| Ver cursos | ✅ | ✅ | ✅ |
| Crear cursos | ✅ | ✅ | ❌ |
| Eliminar cursos | ✅ | ❌ | ❌ |
| Registrar calificaciones | ✅ | ✅ | ❌ |
| Eliminar calificaciones | ✅ | ❌ | ❌ |

**Implementación del middleware**:
```javascript
const verificarRol = (...rolesPermitidos) => {
  return (req, res, next) => {
    if (!rolesPermitidos.includes(req.usuario.rol)) {
      return res.status(403).json({
        success: false,
        message: 'No tienes permisos para realizar esta acción.'
      });
    }
    next();
  };
};

// Uso en rutas
router.delete('/:id', 
  verificarToken,           // Primero verifica que esté autenticado
  verificarRol('admin'),    // Luego verifica que sea admin
  eliminarEstudiante
);
```

---

### 2.4 Validación y Sanitización de Datos

#### ¿Por qué es importante?
La validación previene inyección SQL, XSS (Cross-Site Scripting) y otros ataques que explotan entradas maliciosas.

#### Implementación en el Proyecto

**Archivo**: `src/middlewares/validator.js`

**Técnicas Implementadas**:

1. **Validación de tipos de datos**:
```javascript
body('email')
  .isEmail().withMessage('Debe ser un email válido')
  .normalizeEmail()
```

2. **Validación de longitud**:
```javascript
body('nombre')
  .isLength({ min: 2, max: 100 })
  .withMessage('El nombre debe tener entre 2 y 100 caracteres')
```

3. **Validación de formato**:
```javascript
body('matricula')
  .matches(/^[a-zA-Z0-9-]+$/)
  .withMessage('Solo letras, números y guiones permitidos')
```

4. **Validación de rangos**:
```javascript
body('calificacion')
  .isFloat({ min: 0, max: 100 })
  .withMessage('La calificación debe estar entre 0 y 100')
```

5. **Sanitización de entrada** (Archivo: `src/middlewares/security.js`):
```javascript
const sanitizarDatos = (req, res, next) => {
  if (req.body) {
    Object.keys(req.body).forEach(key => {
      if (typeof req.body[key] === 'string') {
        req.body[key] = req.body[key]
          .replace(/<script>/gi, '')      // Remover scripts
          .replace(/<\/script>/gi, '')
          .replace(/javascript:/gi, '')   // Remover javascript:
          .replace(/on\w+=/gi, '');       // Remover eventos onclick, etc.
      }
    });
  }
  next();
};
```

**Ejemplo de validación completa**:
```javascript
const validarEstudiante = [
  body('nombre')
    .trim()
    .notEmpty().withMessage('El nombre es requerido')
    .isLength({ min: 2, max: 100 })
    .matches(/^[a-záéíóúñA-ZÁÉÍÓÚÑ\s]+$/)
    .withMessage('Solo letras permitidas'),
  
  body('email')
    .trim()
    .isEmail().withMessage('Email inválido')
    .normalizeEmail(),
  
  body('fecha_nacimiento')
    .isDate()
    .custom((value) => {
      const edad = calcularEdad(value);
      if (edad < 5 || edad > 100) {
        throw new Error('Edad inválida');
      }
      return true;
    }),
  
  manejarErroresValidacion
];
```

---

### 2.5 CORS (Cross-Origin Resource Sharing)

#### ¿Qué es CORS?
CORS es un mecanismo de seguridad que controla qué dominios externos pueden acceder a los recursos de la API.

#### Implementación en el Proyecto

**Archivo**: `src/middlewares/security.js`

**Configuración**:
```javascript
const configurarCORS = () => {
  const origenes = process.env.ALLOWED_ORIGINS 
    ? process.env.ALLOWED_ORIGINS.split(',') 
    : ['http://localhost:3000'];

  return cors({
    origin: function (origin, callback) {
      if (origenes.indexOf(origin) !== -1 || !origin) {
        callback(null, true);
      } else {
        callback(new Error('No permitido por CORS'));
      }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
  });
};
```

**Configuración en .env**:
```
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:4200,https://miapp.com
```

**Protección contra**:
- ✅ Peticiones desde dominios no autorizados
- ✅ Acceso no autorizado desde otros sitios web
- ✅ Ataques CSRF desde dominios maliciosos

---

### 2.6 Rate Limiting (Limitación de Peticiones)

#### ¿Qué es Rate Limiting?
Es una técnica que limita el número de peticiones que un cliente puede hacer en un período de tiempo, protegiendo contra ataques de fuerza bruta y DDoS.

#### Implementación en el Proyecto

**Archivo**: `src/middlewares/security.js`

**Dos niveles de limitación**:

1. **Limitador General** (para toda la API):
```javascript
const limitadorGeneral = rateLimit({
  windowMs: 15 * 60 * 1000,  // 15 minutos
  max: 100,                   // 100 peticiones máximo
  message: 'Demasiadas peticiones, intenta más tarde'
});
```

2. **Limitador de Autenticación** (más estricto):
```javascript
const limitadorAuth = rateLimit({
  windowMs: 15 * 60 * 1000,  // 15 minutos
  max: 5,                     // Solo 5 intentos de login
  skipSuccessfulRequests: true
});
```

**Ejemplo de protección**:
```
Intento 1: ✅ Permitido
Intento 2: ✅ Permitido
Intento 3: ✅ Permitido
Intento 4: ✅ Permitido
Intento 5: ✅ Permitido
Intento 6: ❌ BLOQUEADO - "Demasiados intentos, espera 15 minutos"
```

**Protección contra**:
- ✅ Ataques de fuerza bruta en login
- ✅ Ataques DDoS (Distributed Denial of Service)
- ✅ Scraping abusivo de datos
- ✅ Consumo excesivo de recursos

---

### 2.7 Helmet.js - Headers de Seguridad HTTP

#### ¿Qué es Helmet?
Helmet es un middleware que configura automáticamente headers HTTP para proteger contra vulnerabilidades web comunes.

#### Implementación en el Proyecto

**Archivo**: `src/middlewares/security.js`

**Headers Configurados**:

1. **Content Security Policy (CSP)**:
```javascript
contentSecurityPolicy: {
  directives: {
    defaultSrc: ["'self'"],           // Solo recursos del mismo origen
    styleSrc: ["'self'", "'unsafe-inline'"],
    scriptSrc: ["'self'"],
    imgSrc: ["'self'", 'data:', 'https:']
  }
}
```
**Protege contra**: XSS, inyección de código malicioso

2. **HSTS (HTTP Strict Transport Security)**:
```javascript
hsts: {
  maxAge: 31536000,        // 1 año
  includeSubDomains: true,
  preload: true
}
```
**Protege contra**: Ataques man-in-the-middle, downgrade a HTTP

3. **X-Frame-Options**:
```javascript
frameguard: {
  action: 'deny'  // No permitir que la página se muestre en iframe
}
```
**Protege contra**: Clickjacking

4. **X-Content-Type-Options**:
```javascript
noSniff: true  // Prevenir MIME sniffing
```
**Protege contra**: Ejecución de archivos maliciosos

5. **X-XSS-Protection**:
```javascript
xssFilter: true  // Activar protección XSS del navegador
```
**Protege contra**: Cross-Site Scripting

6. **Referrer-Policy**:
```javascript
referrerPolicy: {
  policy: 'no-referrer'  // No enviar información del referrer
}
```
**Protege contra**: Filtración de información sensible en URLs

---

### 2.8 Variables de Entorno

#### ¿Por qué usar variables de entorno?
Las variables de entorno permiten almacenar información sensible fuera del código, haciendo imposible que las credenciales se suban a repositorios públicos.

#### Implementación en el Proyecto

**Archivo**: `.env`

**Variables Críticas**:
```bash
# Seguridad JWT
JWT_SECRET=clave_super_secreta_cambiar_en_produccion_min_32_caracteres

# Base de Datos
DB_PASSWORD=password_seguro_base_datos

# CORS
ALLOWED_ORIGINS=http://localhost:3000,https://miapp.com
```

**Buenas Prácticas**:
- ✅ Nunca subir el archivo `.env` a Git (incluido en `.gitignore`)
- ✅ Usar claves diferentes para desarrollo y producción
- ✅ JWT_SECRET debe tener mínimo 32 caracteres
- ✅ Rotar credenciales periódicamente

**Archivo `.gitignore`**:
```
.env
.env.local
.env.production
node_modules/
```

---

### 2.9 Logging y Auditoría

#### ¿Por qué es importante?
El logging permite detectar intentos de ataque, rastrear accesos no autorizados y cumplir con requisitos de auditoría.

#### Implementación en el Proyecto

**Archivo**: `src/middlewares/security.js`

**Información registrada**:
```javascript
const logSeguridad = (req, res, next) => {
  const timestamp = new Date().toISOString();
  const ip = req.ip || req.connection.remoteAddress;
  const metodo = req.method;
  const ruta = req.path;
  
  console.log(`[${timestamp}] ${metodo} ${ruta} - IP: ${ip}`);
  next();
};
```

**Ejemplo de log**:
```
[2025-11-06T10:30:45.123Z] POST /api/auth/login - IP: 192.168.1.100
[2025-11-06T10:31:12.456Z] GET /api/estudiantes - IP: 192.168.1.100
[2025-11-06T10:31:45.789Z] POST /api/calificaciones - IP: 192.168.1.100
```

**Información útil para**:
- ✅ Detectar patrones de ataque
- ✅ Identificar IPs sospechosas
- ✅ Auditorías de seguridad
- ✅ Análisis de uso de la API

---

## 3. FLUJO COMPLETO DE SEGURIDAD

### 3.1 Registro de Usuario

```
1. Cliente envía datos de registro
   ↓
2. [Sanitización] Limpia datos de entrada
   ↓
3. [Validación] Verifica formato y reglas de negocio
   ↓
4. [Verificación] Comprueba que username/email no existan
   ↓
5. [Encriptación] Hashea la contraseña con bcrypt
   ↓
6. [Base de Datos] Guarda usuario con contraseña hasheada
   ↓
7. [Token JWT] Genera token de autenticación
   ↓
8. [Respuesta] Devuelve usuario (sin password) y token
```

### 3.2 Inicio de Sesión

```
1. Cliente envía username y password
   ↓
2. [Rate Limiting] Verifica que no exceda 5 intentos
   ↓
3. [Validación] Verifica que campos no estén vacíos
   ↓
4. [Base de Datos] Busca usuario por username o email
   ↓
5. [Verificación] Usuario existe y está activo?
   ↓
6. [Bcrypt] Compara password con hash almacenado
   ↓
7. [Token JWT] Genera nuevo token
   ↓
8. [Respuesta] Devuelve usuario y token
```

### 3.3 Petición Protegida

```
1. Cliente envía petición con token en header
   ↓
2. [CORS] Verifica que el origen esté permitido
   ↓
3. [Rate Limiting] Verifica límite de peticiones
   ↓
4. [Helmet] Añade headers de seguridad
   ↓
5. [Sanitización] Limpia datos de entrada
   ↓
6. [JWT] Verifica y decodifica token
   ↓
7. [Base de Datos] Verifica que usuario siga activo
   ↓
8. [RBAC] Verifica permisos del rol
   ↓
9. [Validación] Valida datos específicos del endpoint
   ↓
10. [Procesamiento] Ejecuta lógica de negocio
    ↓
11. [Respuesta] Devuelve resultado
```

---

## 4. VULNERABILIDADES PREVENIDAS

### 4.1 Inyección SQL
**Cómo se previene**:
- ✅ Uso de ORM (Sequelize) con consultas parametrizadas
- ✅ Validación de tipos de datos
- ✅ Sanitización de entradas

**Ejemplo de prevención**:
```javascript
// ❌ VULNERABLE (SQL directo)
const query = `SELECT * FROM estudiantes WHERE id = ${req.params.id}`;

// ✅ SEGURO (Sequelize)
const estudiante = await Estudiante.findByPk(req.params.id);
```

### 4.2 Cross-Site Scripting (XSS)
**Cómo se previene**:
- ✅ Sanitización de entradas HTML
- ✅ Content Security Policy (CSP) con Helmet
- ✅ Escape automático de Sequelize

### 4.3 Cross-Site Request Forgery (CSRF)
**Cómo se previene**:
- ✅ Tokens JWT en lugar de cookies de sesión
- ✅ CORS configurado para limitar orígenes
- ✅ Verificación de origen en peticiones

### 4.4 Fuerza Bruta
**Cómo se previene**:
- ✅ Rate limiting (máximo 5 intentos de login)
- ✅ Contraseñas hasheadas con bcrypt (lento por diseño)
- ✅ Bloqueo temporal después de intentos fallidos

### 4.5 Exposición de Datos Sensibles
**Cómo se previene**:
- ✅ Contraseñas nunca se devuelven en respuestas (toJSON)
- ✅ Variables de entorno para credenciales
- ✅ HTTPS recomendado (HSTS)
- ✅ JWT con tiempo de expiración

### 4.6 Man-in-the-Middle
**Cómo se previene**:
- ✅ HSTS obliga uso de HTTPS
- ✅ Tokens JWT firmados digitalmente
- ✅ Verificación de integridad del token

### 4.7 Clickjacking
**Cómo se previene**:
- ✅ X-Frame-Options: DENY (no permitir iframes)
- ✅ Content Security Policy

### 4.8 Acceso No Autorizado
**Cómo se previene**:
- ✅ Autenticación obligatoria (JWT)
- ✅ Control de acceso basado en roles (RBAC)
- ✅ Verificación de permisos en cada endpoint

---

## 5. MEJORES PRÁCTICAS IMPLEMENTADAS

### 5.1 Principio de Mínimo Privilegio
Cada rol tiene solo los permisos necesarios para sus funciones.

### 5.2 Defensa en Profundidad
Múltiples capas de seguridad (validación, autenticación, autorización, sanitización).

### 5.3 Seguridad por Diseño
La seguridad se implementó desde el inicio del proyecto, no como agregado posterior.

### 5.4 Principio de Fallo Seguro
Si ocurre un error, el sistema niega el acceso por defecto.

### 5.5 Separación de Responsabilidades
Cada middleware tiene una función específica de seguridad.

---

## 6. CONFIGURACIÓN DE SEGURIDAD

### 6.1 Variables de Entorno Recomendadas

```bash
# Producción
JWT_SECRET=clave_aleatoria_minimo_32_caracteres_cambiar_cada_6_meses
JWT_EXPIRES_IN=8h  # Tokens más cortos en producción

NODE_ENV=production

# Rate Limiting más estricto
RATE_LIMIT_WINDOW_MS=600000  # 10 minutos
RATE_LIMIT_MAX_REQUESTS=50   # 50 peticiones

# CORS específico
ALLOWED_ORIGINS=https://miapp-produccion.com
```

### 6.2 Recomendaciones Adicionales

1. **Usar HTTPS en producción** (no HTTP)
2. **Implementar logs en archivos** para auditoría
3. **Monitorear intentos de acceso fallidos**
4. **Actualizar dependencias regularmente** (`npm audit`)
5. **Implementar backup de base de datos**
6. **Usar certificados SSL válidos**
7. **Configurar firewall del servidor**

---

## 7. TESTING DE SEGURIDAD

### 7.1 Pruebas Recomendadas

1. **Intentar acceder sin token**:
```bash
GET /api/estudiantes
Esperado: 401 Unauthorized
```

2. **Intentar acceder con token inválido**:
```bash
GET /api/estudiantes
Authorization: Bearer token_falso
Esperado: 403 Forbidden
```

3. **Intentar acceder con rol insuficiente**:
```bash
DELETE /api/estudiantes/1
(con token de estudiante)
Esperado: 403 Forbidden
```

4. **Intentar inyección SQL**:
```bash
POST /api/estudiantes
{ "nombre": "'; DROP TABLE estudiantes; --" }
Esperado: Datos sanitizados, petición rechazada
```

5. **Intentar múltiples logins**:
```bash
POST /api/auth/login (x6 veces)
Esperado: 6to intento bloqueado
```

---

## 8. CONCLUSIÓN

La capa de seguridad implementada en el Sistema de Gestión Escolar proporciona **protección integral** contra las amenazas más comunes en aplicaciones web. Mediante la combinación de:

- ✅ **Autenticación JWT** para verificar identidad
- ✅ **Encriptación Bcrypt** para proteger contraseñas
- ✅ **RBAC** para control granular de permisos
- ✅ **Validación y sanitización** para prevenir inyecciones
- ✅ **CORS** para control de acceso cross-origin
- ✅ **Rate Limiting** para prevenir abusos
- ✅ **Helmet** para headers de seguridad
- ✅ **Logging** para auditoría

El sistema cumple con los estándares de la industria y mejores prácticas de seguridad web, proporcionando una base sólida para proteger la información académica sensible.

### Niveles de Seguridad Alcanzados

| Aspecto | Nivel | Implementado |
|---------|-------|--------------|
| Autenticación | ⭐⭐⭐⭐⭐ | JWT + Bcrypt |
| Autorización | ⭐⭐⭐⭐⭐ | RBAC |
| Validación | ⭐⭐⭐⭐⭐ | express-validator + sanitización |
| Protección API | ⭐⭐⭐⭐⭐ | Rate limiting + CORS + Helmet |
| Logging | ⭐⭐⭐⭐ | Morgan + logging personalizado |
| Manejo de Errores | ⭐⭐⭐⭐⭐ | Middleware global |

---

**Elaborado por**: [Tu Nombre]  
**Fecha**: 16 de noviembre de 2025  
**Versión**: 1.0