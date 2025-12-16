# 🌿 Guía de Implementación - Sistema de Creación de Sitios Ecoturísticos

## ✅ Lo que está completo

1. **Backend Laravel** - Ya configurado con:
   - ✅ Tabla `turistic_places` con todos los campos necesarios
   - ✅ API endpoint `POST /api/places` para crear sitios
   - ✅ Autenticación y autorización para admin/operador
   - ✅ Validación de imágenes y textos
   - ✅ Almacenamiento de imágenes en `storage/app/public`

2. **Frontend React** - Ya implementado:
   - ✅ Componente `CreateSitioPage.jsx` con formulario completo
   - ✅ API service `placesApi.js` para comunicarse con el backend
   - ✅ Ruta protegida `/crear-sitio` solo para admin/operador
   - ✅ `ColeccionPage.jsx` actualizada para mostrar sitios desde la API
   - ✅ Cards de sitios con imagen, nombre, slogan y ubicación

## 📋 Campos del Formulario

### Información Básica
- **Nombre del sitio** (text)
- **Slogan** (text)
- **Descripción** (textarea)
- **Imagen de Portada** (file upload)

### Localización
- **Descripción de ubicación** (textarea)
- **Selector de mapa** (Google Maps - requiere configuración)
- **Coordenadas** (lat/lng - auto-completadas al hacer clic en el mapa)

### Clima
- **Descripción del clima** (textarea)
- **Imagen del clima** (file upload)

### Características
- **Descripción de características** (textarea)
- **Imagen de características** (file upload)

### Flora y Fauna
- **Descripción de flora/fauna** (textarea)
- **Imagen de flora/fauna** (file upload)

### Infraestructura
- **Descripción de infraestructura** (textarea)
- **Imagen de infraestructura** (file upload)

### Recomendaciones
- **Tips y recomendaciones** (textarea)

## 🔧 Configuración Pendiente

### 1. Google Maps API Key

El mapa utiliza Google Maps API. Necesitas:

1. Obtener una API Key de Google Maps:
   - Ve a [Google Cloud Console](https://console.cloud.google.com/)
   - Crea un proyecto o usa uno existente
   - Habilita "Maps JavaScript API"
   - Crea credenciales (API Key)

2. Reemplaza en `CreateSitioPage.jsx` línea ~293:
```jsx
<LoadScript googleMapsApiKey="YOUR_GOOGLE_MAPS_API_KEY">
```
Por:
```jsx
<LoadScript googleMapsApiKey="TU_API_KEY_AQUI">
```

**ALTERNATIVA:** Si no quieres usar Google Maps (requiere tarjeta de crédito), puedes:
- Usar Leaflet (gratis, OpenStreetMap)
- O simplemente usar inputs manuales para lat/lng

### 2. Storage Symlink en Laravel

Para que las imágenes se vean correctamente:

```bash
cd BackEnd/Conexion-EcoRisaralda
php artisan storage:link
```

Esto crea un enlace simbólico de `storage/app/public` a `public/storage`.

### 3. CORS Configuration

Asegúrate de que el backend acepta peticiones del frontend:

En `config/cors.php`:
```php
'allowed_origins' => ['http://localhost:5173'],
'supports_credentials' => true,
```

### 4. Instalar Google Maps React

```bash
cd FrontEnd/FrontEndEcoturismo
npm install @react-google-maps/api
```

## 🎯 Cómo Usar

### Para Admin/Operador:

1. **Iniciar sesión** como admin u operador
2. **Ir a Colección** (`/coleccion`)
3. **Hacer clic en "Crear Sitio"** o "+ Crear Primer Sitio"
4. **Completar el formulario**:
   - Llenar todos los campos de texto
   - Subir todas las 5 imágenes requeridas
   - Hacer clic en el mapa para seleccionar ubicación
5. **Hacer clic en "Crear Sitio"**
6. El sitio aparecerá en la página de Colección

### Para Turistas:

- Solo pueden **ver** los sitios en la página de Colección
- NO tienen acceso al botón "Crear Sitio"
- La ruta `/crear-sitio` los redirige al home

## 🗺️ Estructura de Archivos Creados

```
FrontEnd/FrontEndEcoturismo/src/
├── CreateSitioPage.jsx          ← Formulario de creación
├── ColeccionPage.jsx             ← Actualizada para mostrar sitios
├── services/
│   └── placesApi.js              ← Funciones API
├── components/
│   └── AdminOperatorRoute.jsx    ← Ruta protegida admin/operador
└── App.jsx                       ← Ruta agregada
```

## 📸 Vista de los Sitios

Los sitios creados aparecen en `/coleccion` como **cards** con:
- ✅ Imagen de portada
- ✅ Nombre del sitio
- ✅ Slogan
- ✅ Ubicación (primeros 60 caracteres)
- ✅ Hover effect
- ✅ Click para ver detalle completo (ruta `/sitio/:id`)

## 🔐 Seguridad

- ✅ Solo **admin** y **operador** pueden crear sitios
- ✅ El backend valida el role del usuario
- ✅ Frontend oculta el botón "Crear Sitio" para turistas
- ✅ Ruta protegida con `AdminOperatorRoute`
- ✅ Imágenes validadas (jpg, jpeg, png, webp, máx 4MB)

## 🐛 Solución de Problemas

### "Imágenes no se ven"
```bash
cd BackEnd/Conexion-EcoRisaralda
php artisan storage:link
php artisan cache:clear
```

### "Error 403 al crear sitio"
- Verifica que estás logueado como admin u operador
- Revisa las credenciales del usuario en la base de datos

### "Error CORS"
- Verifica `config/cors.php` en el backend
- Asegúrate de que el frontend está en `http://localhost:5173`

### "Mapa no aparece"
- Verifica que instalaste `@react-google-maps/api`
- Agrega tu Google Maps API Key
- O usa la alternativa sin mapa (inputs manuales)

## 🚀 Próximos Pasos (Opcional)

1. **Ver detalle de sitio** - Página individual con toda la info
2. **Editar sitios** - Formulario para actualizar
3. **Eliminar sitios** - Botón para admin/operador
4. **Filtros y búsqueda** - En la página de colección
5. **Favoritos** - Que turistas guarden sitios favoritos
6. **Reviews** - Sistema de reseñas y calificaciones

## 📝 Notas Importantes

- Las imágenes se guardan en `storage/app/public/` en carpetas separadas
- Las coordenadas se guardan con 8 decimales (lat) y 11 decimales (lng)
- El backend valida que todos los campos de texto tengan mínimo 10 caracteres
- Las imágenes son obligatorias para crear un sitio
- El formulario tiene preview de las imágenes antes de subir

---

¡Todo listo! Ahora solo necesitas configurar Google Maps API Key y podrás crear sitios ecoturísticos completos. 🌳✨
