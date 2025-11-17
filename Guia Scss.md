# Guía Completa de SCSS

## 1️⃣ Variables

Las variables te permiten almacenar valores y reutilizarlos en todo tu código.

### SCSS:
```scss
// Definir variables con $
$color-primary: #3498db;
$color-secondary: #2ecc71;
$font-size-base: 16px;
$spacing-unit: 8px;

body {
    color: $color-primary;
    font-size: $font-size-base;
    padding: $spacing-unit * 2; // 16px
}

button {
    background-color: $color-secondary;
    padding: $spacing-unit $spacing-unit * 2;
}
```

### CSS compilado:
```css
body {
    color: #3498db;
    font-size: 16px;
    padding: 16px;
}

button {
    background-color: #2ecc71;
    padding: 8px 16px;
}
```

---

## 2️⃣ Anidación (Nesting)

Organiza tu código siguiendo la estructura HTML.

### SCSS:
```scss
.navigation {
    background: #333;
    padding: 20px;

    ul {
        list-style: none;
        margin: 0;

        li {
            display: inline-block;
            margin-right: 15px;

            a {
                color: white;
                text-decoration: none;

                &:hover {  // & = selector padre (.navigation ul li a)
                    color: #ffba00;
                }

                &.active {  // .navigation ul li a.active
                    font-weight: bold;
                }
            }
        }
    }
}
```

### CSS compilado:
```css
.navigation {
    background: #333;
    padding: 20px;
}

.navigation ul {
    list-style: none;
    margin: 0;
}

.navigation ul li {
    display: inline-block;
    margin-right: 15px;
}

.navigation ul li a {
    color: white;
    text-decoration: none;
}

.navigation ul li a:hover {
    color: #ffba00;
}

.navigation ul li a.active {
    font-weight: bold;
}
```

---

## 3️⃣ Mixins

Los mixins son como funciones que generan CSS. Perfectos para reutilizar código.

### SCSS:
```scss
// Mixin sin argumentos
@mixin reset-list {
    list-style: none;
    margin: 0;
    padding: 0;
}

// Mixin con argumentos
@mixin button-style($bg-color, $text-color: white) {
    background-color: $bg-color;
    color: $text-color;
    padding: 10px 20px;
    border: none;
    border-radius: 5px;
    cursor: pointer;

    &:hover {
        opacity: 0.8;
    }
}

// Mixin con argumentos por defecto
@mixin box-shadow($x: 0, $y: 2px, $blur: 4px, $color: rgba(0,0,0,0.1)) {
    box-shadow: $x $y $blur $color;
}

// Usar los mixins con @include
nav ul {
    @include reset-list;
}

.btn-primary {
    @include button-style(#3498db);
    @include box-shadow;
}

.btn-danger {
    @include button-style(#e74c3c, white);
    @include box-shadow(0, 4px, 8px, rgba(0,0,0,0.2));
}
```

### CSS compilado:
```css
nav ul {
    list-style: none;
    margin: 0;
    padding: 0;
}

.btn-primary {
    background-color: #3498db;
    color: white;
    padding: 10px 20px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.btn-primary:hover {
    opacity: 0.8;
}

.btn-danger {
    background-color: #e74c3c;
    color: white;
    padding: 10px 20px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.btn-danger:hover {
    opacity: 0.8;
}
```

---

## 4️⃣ Operaciones Matemáticas

SCSS puede hacer cálculos directamente.

### SCSS:
```scss
$base-size: 16px;
$container-width: 1200px;

.container {
    width: $container-width;
    padding: $base-size * 2;  // 32px
}

.sidebar {
    width: $container-width / 3;  // 400px
}

.content {
    width: ($container-width * 2) / 3;  // 800px
}

.small-text {
    font-size: $base-size - 2px;  // 14px
}

.large-text {
    font-size: $base-size + 8px;  // 24px
}
```

---

## 5️⃣ Imports y Partials

Divide tu código en múltiples archivos para mejor organización.

### Estructura de archivos:
```
scss/
├── _variables.scss
├── _mixins.scss
├── _buttons.scss
├── _navigation.scss
└── main.scss
```

### _variables.scss:
```scss
// Los archivos que empiezan con _ son "partials"
$color-primary: #3498db;
$color-secondary: #2ecc71;
$spacing: 8px;
```

### _mixins.scss:
```scss
@mixin flex-center {
    display: flex;
    justify-content: center;
    align-items: center;
}
```

### main.scss:
```scss
// Importar todos los partials (sin el _ y sin .scss)
@import 'variables';
@import 'mixins';
@import 'buttons';
@import 'navigation';

body {
    color: $color-primary;
}
```

---

## 6️⃣ Extend/Herencia

Comparte estilos entre selectores.

### SCSS:
```scss
.message {
    padding: 15px;
    border: 1px solid #ccc;
    border-radius: 5px;
}

.success {
    @extend .message;
    background-color: #d4edda;
    border-color: #c3e6cb;
}

.error {
    @extend .message;
    background-color: #f8d7da;
    border-color: #f5c6cb;
}
```

### CSS compilado:
```css
.message, .success, .error {
    padding: 15px;
    border: 1px solid #ccc;
    border-radius: 5px;
}

.success {
    background-color: #d4edda;
    border-color: #c3e6cb;
}

.error {
    background-color: #f8d7da;
    border-color: #f5c6cb;
}
```

---

## 7️⃣ Funciones Built-in

SCSS tiene funciones útiles para colores, strings, etc.

### SCSS:
```scss
$base-color: #3498db;

.box {
    background-color: $base-color;
    border-color: darken($base-color, 10%);  // Color más oscuro
}

.box-light {
    background-color: lighten($base-color, 20%);  // Color más claro
}

.box-transparent {
    background-color: rgba($base-color, 0.5);  // Agregar transparencia
}

// Otras funciones útiles:
// saturate($color, 20%)  - Más saturado
// desaturate($color, 20%)  - Menos saturado
// adjust-hue($color, 30deg)  - Cambiar tono
// complement($color)  - Color complementario
```

---

## 8️⃣ Condicionales e Iteraciones

### If/Else:
```scss
$theme: dark;

body {
    @if $theme == dark {
        background-color: #333;
        color: white;
    } @else {
        background-color: white;
        color: #333;
    }
}
```

### Loops:
```scss
// For loop
@for $i from 1 through 4 {
    .column-#{$i} {
        width: 25% * $i;
    }
}

// Each loop
$colors: red, blue, green, yellow;

@each $color in $colors {
    .text-#{$color} {
        color: $color;
    }
}
```

---

## 🎯 Ejemplo Completo del Mixin de tu proyecto

```scss
// Variables
$offwhite: #EEE8D6;
$darkblue: #022933;
$yellow: #FFBA00;

// Mixin con múltiples argumentos y valores por defecto
@mixin banner-style($image-url, $banner-height: 40vh, $position: center) {
    background-image: url($image-url);
    background-repeat: no-repeat;
    background-position: $position;
    background-size: cover;
    height: $banner-height;
    display: flex;
    align-items: flex-end;
    color: white;
    
    // Anidación con & (selector padre)
    &:first-of-type { 
        background-blend-mode: multiply;
        background-color: rgba(0, 0, 0, 0.4);
    }
}

// Usar el mixin con diferentes argumentos
.banner-top {
    @include banner-style('image1.jpg', 40vh, center);
}

.banner-bottom {
    @include banner-style('image2.jpg', 50vh, top);
}
```

---

## 📌 Comandos Útiles del Compilador

```bash
# Compilar un archivo una vez
sass input.scss output.css

# Watch mode (recompila automáticamente al guardar)
sass --watch input.scss:output.css

# Watch una carpeta completa
sass --watch scss:css

# Compilar comprimido (producción)
sass --style=compressed input.scss output.css

# Ver ayuda
sass --help
```

---

## ✅ Mejores Prácticas

1. **Usa variables** para colores, tamaños y valores repetidos
2. **Organiza con partials**: separa variables, mixins, componentes
3. **Anida máximo 3-4 niveles**: más profundo = difícil de mantener
4. **Mixins para código repetido**: DRY (Don't Repeat Yourself)
5. **Nombra variables claramente**: `$color-primary` mejor que `$blue`
6. **Comentarios**: Explica mixins complejos

## 🚀 Siguiente Nivel

Una vez domines lo básico, explora:
- **Sass Maps**: Estructuras de datos más complejas
- **Functions personalizadas**: Crear tus propias funciones
- **BEM con SCSS**: Metodología de nombrado con anidación
- **CSS Grid/Flexbox mixins**: Layouts reutilizables