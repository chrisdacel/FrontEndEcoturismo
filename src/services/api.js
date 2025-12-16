import axios from 'axios';

// Variable para controlar reintentos
let isRefreshing = false;

// Crear instancia de axios con configuración base
const api = axios.create({
  baseURL: 'http://localhost:8000',
  withCredentials: true, // Importante: enviar cookies con cada request
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
  }
});

// Interceptor de request para agregar CSRF token
api.interceptors.request.use((config) => {
  // Obtener el token XSRF de las cookies
  const token = document.cookie
    .split('; ')
    .find(row => row.startsWith('XSRF-TOKEN='))
    ?.split('=')[1];
  
  if (token) {
    config.headers['X-XSRF-TOKEN'] = decodeURIComponent(token);
  }
  
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Interceptor para manejar error 419 (CSRF token mismatch)
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Si es error 419 (CSRF token mismatch) y no hemos reintentado ya
    if (error.response?.status === 419 && !originalRequest._retry && !isRefreshing) {
      originalRequest._retry = true;
      isRefreshing = true;

      try {
        console.log('CSRF token expirado, obteniendo nuevo token...');
        // Refrescar el CSRF token
        await axios.get('http://localhost:8000/sanctum/csrf-cookie', {
          withCredentials: true
        });
        
        console.log('Token refrescado, reintentando petición original...');
        isRefreshing = false;
        
        // Reintentar la petición original
        return api(originalRequest);
      } catch (refreshError) {
        isRefreshing = false;
        console.error('Error al refrescar token:', refreshError);
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// ============ INICIALIZACIÓN ============
/**
 * Obtener CSRF token para SPA (ejecutar una sola vez al inicio)
 */
export async function initializeCsrfToken() {
  try {
    await axios.get('http://localhost:8000/sanctum/csrf-cookie', {
      withCredentials: true
    });
  } catch (error) {
    console.error('Error getting CSRF token:', error);
  }
}

// ============ AUTENTICACIÓN ============
/**
 * Registrar nuevo usuario
 * @param {string} name - Nombre
 * @param {string} email - Email
 * @param {string} password - Contraseña (mín 8 caracteres)
 * @param {string} role - 'turist' o 'operator'
 * @param {string} lastName - Apellido (opcional)
 */
export async function register(name, email, password, role = 'turist', lastName = null, country = null, birthDate = null) {
  try {
    const payload = { name, last_name: lastName, email, password, role };
    if (country) payload.country = country;
    if (birthDate) payload.birth_date = birthDate; // formato YYYY-MM-DD

    const { data } = await api.post('/api/register', payload);
    return data.user;
  } catch (error) {
    throw error.response?.data || { message: 'Error en registro' };
  }
}

/**
 * Iniciar sesión
 * @param {string} email - Email
 * @param {string} password - Contraseña
 */
export async function login(email, password) {
  try {
    const { data } = await api.post('/api/login', { email, password });
    return data.user;
  } catch (error) {
    throw error.response?.data || { message: 'Credenciales inválidas' };
  }
}

// Solicitar enlace de recuperación de contraseña
export async function requestPasswordReset(email) {
  try {
    const { data } = await api.post('/api/forgot-password', { email });
    return data.message || 'Revisa tu correo para el enlace de recuperación';
  } catch (error) {
    throw error.response?.data || { message: 'No se pudo enviar el enlace' };
  }
}

// Restablecer contraseña con token
export async function resetPassword(token, email, password, passwordConfirmation) {
  try {
    const { data } = await api.post('/api/reset-password', {
      token,
      email,
      password,
      password_confirmation: passwordConfirmation,
    });
    return data.message || 'Contraseña restablecida';
  } catch (error) {
    throw error.response?.data || { message: 'No se pudo restablecer la contraseña' };
  }
}

/**
 * Cerrar sesión
 */
export async function logout() {
  try {
    await api.post('/api/logout');
  } catch (error) {
    throw error.response?.data || { message: 'Error al cerrar sesión' };
  }
}

// Perfil: obtener datos
export async function fetchProfile() {
  try {
    const { data } = await api.get('/api/profile');
    return data;
  } catch (error) {
    throw error.response?.data || { message: 'Error obteniendo perfil' };
  }
}

// Perfil: actualizar nombre/email
export async function updateProfile(payload) {
  try {
    await initializeCsrfToken(); // Refrescar token antes de actualizar
    const { data } = await api.put('/api/profile', payload);
    return data.user;
  } catch (error) {
    throw error.response?.data || { message: 'Error actualizando perfil' };
  }
}

// Perfil: cambiar contraseña
export async function changePassword(current_password, password, password_confirmation) {
  try {
    await initializeCsrfToken(); // Refrescar token antes de actualizar
    const { data } = await api.post('/api/profile/password', {
      current_password,
      password,
      password_confirmation,
    });
    return data.message;
  } catch (error) {
    throw error.response?.data || { message: 'Error actualizando contraseña' };
  }
}

// Perfil: subir avatar
export async function uploadAvatar(file) {
  const formData = new FormData();
  formData.append('avatar', file);

  try {
    await initializeCsrfToken(); // Refrescar token antes de subir
    const { data } = await api.post('/api/profile/avatar', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data; // Retorna { avatar_url, user, message }
  } catch (error) {
    throw error.response?.data || { message: 'Error subiendo foto' };
  }
}

// Reenviar correo de verificación
export async function resendVerificationEmail() {
  try {
    const { data } = await api.post('/api/email/verification-notification');
    return data.message || 'Correo de verificación enviado';
  } catch (error) {
    throw error.response?.data || { message: 'No se pudo reenviar el correo' };
  }
}

/**
 * Obtener usuario actual (requiere estar autenticado)
 */
export async function getCurrentUser() {
  try {
    const { data } = await api.get('/api/user');
    return data;
  } catch (error) {
    return null; // No autenticado
  }
}

// ============ PREFERENCIAS ============
/**
 * Obtener catálogo completo de preferencias
 */
export async function fetchPreferencesOptions() {
  try {
    const { data } = await api.get('/api/preferences');
    return data;
  } catch (error) {
    throw error.response?.data || { message: 'Error obteniendo preferencias' };
  }
}

/**
 * Obtener preferencias del usuario actual (requiere autenticación)
 */
export async function fetchUserPreferences() {
  try {
    const { data } = await api.get('/api/user/preferences');
    return data;
  } catch (error) {
    throw error.response?.data || { message: 'Error obteniendo preferencias del usuario' };
  }
}

/**
 * Actualizar preferencias del usuario (requiere autenticación)
 * @param {array} preferenceIds - Array de IDs de preferencias [1, 3, 5, ...]
 */
export async function updateUserPreferences(preferenceIds) {
  try {
    const { data } = await api.post('/api/user/preferences', {
      preferences: preferenceIds,
    });
    return data;
  } catch (error) {
    throw error.response?.data || { message: 'Error actualizando preferencias' };
  }
}

/**
 * Obtener si es primera vez que el usuario configura preferencias
 */
export async function checkFirstTimePreferences() {
  try {
    const { data } = await api.get('/api/user/first-time-preferences');
    return data.first_time;
  } catch (error) {
    return false;
  }
}

// ============ SITIOS TURÍSTICOS ============
/**
 * Obtener lista de todos los sitios turísticos (público)
 */
export async function fetchPlaces() {
  try {
    const { data } = await api.get('/api/places');
    return data;
  } catch (error) {
    throw error.response?.data || { message: 'Error obteniendo sitios' };
  }
}

/**
 * Obtener detalle de un sitio con sus reseñas (público)
 * @param {number} id - ID del sitio
 */
export async function fetchPlace(id) {
  try {
    const { data } = await api.get(`/api/places/${id}`);
    return data;
  } catch (error) {
    throw error.response?.data || { message: 'Error obteniendo sitio' };
  }
}

/**
 * Obtener mis sitios o todos los sitios si eres admin (requiere autenticación)
 */
export async function fetchUserPlaces() {
  try {
    const { data } = await api.get('/api/user-places');
    return data;
  } catch (error) {
    throw error.response?.data || { message: 'Error obteniendo tus sitios' };
  }
}

/**
 * Crear nuevo sitio turístico (solo operador/admin, requiere autenticación)
 * @param {object} placeData - Datos del sitio (nombre, slogan, descripción, etc.)
 * @param {File} coverImage - Imagen de portada
 * @param {File} climateImage - Imagen de clima
 * @param {File} featuresImage - Imagen de características
 * @param {File} floraImage - Imagen de flora
 * @param {File} infrastructureImage - Imagen de infraestructura
 */
export async function createPlace(placeData, coverImage, climateImage, featuresImage, floraImage, infrastructureImage) {
  try {
    const formData = new FormData();
    
    // Campos de texto
    formData.append('nombre', placeData.nombre);
    formData.append('slogan', placeData.slogan);
    formData.append('descripcion', placeData.descripcion);
    formData.append('localizacion', placeData.localizacion);
    formData.append('lat', placeData.lat);
    formData.append('lng', placeData.lng);
    formData.append('clima', placeData.clima);
    formData.append('caracteristicas', placeData.caracteristicas);
    formData.append('flora', placeData.flora);
    formData.append('infraestructura', placeData.infraestructura);
    formData.append('recomendacion', placeData.recomendacion);
    
    // Imágenes
    formData.append('portada', coverImage);
    formData.append('clima_img', climateImage);
    formData.append('caracteristicas_img', featuresImage);
    formData.append('flora_img', floraImage);
    formData.append('infraestructura_img', infrastructureImage);
    
    const { data } = await api.post('/api/places', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    
    return data;
  } catch (error) {
    throw error.response?.data || { message: 'Error creando sitio' };
  }
}

/**
 * Actualizar sitio turístico (solo propietario/admin, requiere autenticación)
 * @param {number} id - ID del sitio
 * @param {object} placeData - Datos a actualizar
 * @param {File} coverImage - Imagen de portada (opcional)
 * @param {File} climateImage - Imagen de clima (opcional)
 * @param {File} featuresImage - Imagen de características (opcional)
 * @param {File} floraImage - Imagen de flora (opcional)
 * @param {File} infrastructureImage - Imagen de infraestructura (opcional)
 */
export async function updatePlace(id, placeData, coverImage = null, climateImage = null, featuresImage = null, floraImage = null, infrastructureImage = null) {
  try {
    const formData = new FormData();
    
    // Campos de texto
    formData.append('nombre', placeData.nombre);
    formData.append('slogan', placeData.slogan);
    formData.append('descripcion', placeData.descripcion);
    formData.append('localizacion', placeData.localizacion);
    formData.append('lat', placeData.lat);
    formData.append('lng', placeData.lng);
    formData.append('clima', placeData.clima);
    formData.append('caracteristicas', placeData.caracteristicas);
    formData.append('flora', placeData.flora);
    formData.append('infraestructura', placeData.infraestructura);
    formData.append('recomendacion', placeData.recomendacion);
    
    // Imágenes (solo si se proporcionan)
    if (coverImage) formData.append('portada', coverImage);
    if (climateImage) formData.append('clima_img', climateImage);
    if (featuresImage) formData.append('caracteristicas_img', featuresImage);
    if (floraImage) formData.append('flora_img', floraImage);
    if (infrastructureImage) formData.append('infraestructura_img', infrastructureImage);
    
    const { data } = await api.put(`/api/places/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    
    return data;
  } catch (error) {
    throw error.response?.data || { message: 'Error actualizando sitio' };
  }
}

/**
 * Eliminar sitio turístico (solo propietario/admin, requiere autenticación)
 * @param {number} id - ID del sitio
 */
export async function deletePlace(id) {
  try {
    const { data } = await api.delete(`/api/places/${id}`);
    return data;
  } catch (error) {
    throw error.response?.data || { message: 'Error eliminando sitio' };
  }
}

// ============ RESEÑAS ============
/**
 * Crear reseña en un sitio (requiere autenticación)
 * @param {number} placeId - ID del sitio
 * @param {number} rating - Calificación (1-5)
 * @param {string} comment - Comentario
 */
export async function createReview(placeId, rating, comment) {
  try {
    const { data } = await api.post(`/api/places/${placeId}/reviews`, {
      rating,
      comment,
    });
    return data;
  } catch (error) {
    throw error.response?.data || { message: 'Error creando reseña' };
  }
}

/**
 * Eliminar reseña (solo propietario/admin, requiere autenticación)
 * @param {number} reviewId - ID de la reseña
 */
export async function deleteReview(reviewId) {
  try {
    const { data } = await api.delete(`/api/reviews/${reviewId}`);
    return data;
  } catch (error) {
    throw error.response?.data || { message: 'Error eliminando reseña' };
  }
}

// ============ EXPORTAR INSTANCIA DE AXIOS ============
export default api;
