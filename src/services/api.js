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
export { api }; // Exportar la instancia de axios para que otros servicios la usen

export async function initializeCsrfToken() {
  try {
    // Obtener CSRF cookie para sesión
    console.log('Initializing CSRF token...');
    await axios.get('http://localhost:8000/sanctum/csrf-cookie', {
      withCredentials: true
    });
    console.log('CSRF cookie obtained');
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
    return data;
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
    console.log('Attempting login with email:', email);
    const { data } = await api.post('/api/login', { email, password });    
    
    console.log('Login response:', data);
    console.log('Session-based auth established via cookies');
    
    return data.user;
  } catch (error) {
    console.error('Login error:', error.response?.data || error.message);
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
    console.log('Logging out...');
    await api.post('/api/logout');
    console.log('Logout successful');
  } catch (error) {
    console.error('Logout error:', error.response?.data || error.message);
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

// Notificaciones del turista
export async function fetchNotifications(limit = 8) {
  try {
    const { data } = await api.get('/api/user/notifications', {
      params: { limit },
    });
    return data;
  } catch (error) {
    throw error.response?.data || { message: 'No se pudieron cargar las notificaciones' };
  }
}

export async function markNotificationRead(notificationId) {
  try {
    const { data } = await api.post(`/api/user/notifications/${notificationId}/read`);
    return data;
  } catch (error) {
    throw error.response?.data || { message: 'No se pudo marcar la notificacion' };
  }
}

export async function archiveNotification(notificationId) {
  try {
    const { data } = await api.post(`/api/user/notifications/${notificationId}/archive`);
    return data;
  } catch (error) {
    throw error.response?.data || { message: 'No se pudo archivar la notificacion' };
  }
}

export async function archiveAllNotifications() {
  try {
    const { data } = await api.post('/api/user/notifications/archive-all');
    return data;
  } catch (error) {
    throw error.response?.data || { message: 'No se pudieron archivar las notificaciones' };
  }
}

// Evento publico (turista)
export async function fetchPublicEvent(eventId) {
  try {
    const { data } = await api.get(`/api/events/${eventId}`);
    return data;
  } catch (error) {
    throw error.response?.data || { message: 'No se pudo cargar el evento' };
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

// Perfil: eliminar avatar
export async function deleteAvatar() {
  try {
    await initializeCsrfToken();
    const { data } = await api.delete('/api/profile/avatar');
    return data; // Retorna { avatar_url: null, user, message }
  } catch (error) {
    throw error.response?.data || { message: 'Error eliminando foto' };
  }
}

// Perfil: eliminar cuenta
export async function deleteAccount(current_password) {
  try {
    await initializeCsrfToken();
    const { data } = await api.post('/api/profile/delete', { current_password });
    return data.message || 'Cuenta eliminada';
  } catch (error) {
    throw error.response?.data || { message: 'Error eliminando cuenta' };
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

export async function fetchOperatorStats() {
  try {
    const { data } = await api.get('/api/operator/stats');
    return data;
  } catch (error) {
    throw error.response?.data || { message: 'Error cargando estadisticas' };
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
 * Obtener recomendaciones basadas en preferencias del usuario
 */
export async function fetchRecommendations() {
  try {
    const { data } = await api.get('/api/recommendations');
    return data;
  } catch (error) {
    throw error.response?.data || { message: 'Error obteniendo recomendaciones' };
  }
}

export async function fetchNextEvent() {
  try {
    const { data } = await api.get('/api/events/next');
    return data?.event || null;
  } catch (error) {
    throw error.response?.data || { message: 'Error obteniendo evento' };
  }
}

export async function fetchUpcomingEvents(limit = 5) {
  try {
    const { data } = await api.get('/api/events/upcoming', { params: { limit } });
    return Array.isArray(data?.events) ? data.events : [];
  } catch (error) {
    throw error.response?.data || { message: 'Error obteniendo eventos' };
  }
}

// ============ HISTORIAL (TURISTA) ============
export async function logPlaceVisit(placeId) {
  try {
    const { data } = await api.post(`/api/places/${placeId}/visit`);
    return data;
  } catch (error) {
    throw error.response?.data || { message: 'Error registrando visita' };
  }
}

export async function fetchUserHistory(limit = 8) {
  try {
    const { data } = await api.get('/api/user/history', { params: { limit } });
    return data;
  } catch (error) {
    throw error.response?.data || { message: 'Error obteniendo historial' };
  }
}

export async function fetchUserReviews(limit = 8) {
  try {
    const { data } = await api.get('/api/user/reviews', { params: { limit } });
    return data;
  } catch (error) {
    throw error.response?.data || { message: 'Error obteniendo comentarios' };
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
    if (placeData.contacto !== undefined) {
      formData.append('contacto', placeData.contacto ?? '');
    }
    if (placeData.estado_apertura !== undefined) {
      formData.append('estado_apertura', placeData.estado_apertura ?? '');
    }
    if (placeData.dias_abiertos !== undefined) {
      const openDaysValue = typeof placeData.dias_abiertos === 'string'
        ? placeData.dias_abiertos
        : JSON.stringify(placeData.dias_abiertos);
      formData.append('dias_abiertos', openDaysValue);
    }
    if (Array.isArray(placeData.preferences)) {
      placeData.preferences.forEach((prefId) => {
        formData.append('preferences[]', prefId);
      });
    }
    const hasEventPayload = Boolean(placeData.event_title || placeData.event_description || placeData.event_datetime);
    if (hasEventPayload) {
      formData.append('event_title', placeData.event_title ?? '');
      formData.append('event_description', placeData.event_description ?? '');
      formData.append('event_datetime', placeData.event_datetime ?? '');
    }
    
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
    const errors = error.response?.data?.errors;
    if (errors && typeof errors === 'object') {
      const firstKey = Object.keys(errors)[0];
      if (firstKey && Array.isArray(errors[firstKey]) && errors[firstKey][0]) {
        throw new Error(errors[firstKey][0]);
      }
    }
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
export async function updatePlace(id, placeData, coverImage = null, climateImage = null, featuresImage = null, floraImage = null, infrastructureImage = null, eventImage = null) {
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
    if (placeData.contacto !== undefined) {
      formData.append('contacto', placeData.contacto ?? '');
    }
    if (placeData.estado_apertura !== undefined) {
      formData.append('estado_apertura', placeData.estado_apertura ?? '');
    }
    if (placeData.dias_abiertos !== undefined) {
      const openDaysValue = typeof placeData.dias_abiertos === 'string'
        ? placeData.dias_abiertos
        : JSON.stringify(placeData.dias_abiertos);
      formData.append('dias_abiertos', openDaysValue);
    }
    if (Array.isArray(placeData.preferences)) {
      placeData.preferences.forEach((prefId) => {
        formData.append('preferences[]', prefId);
      });
    }
    const hasEventPayload = Boolean(placeData.event_title || placeData.event_description || placeData.event_datetime);
    if (hasEventPayload) {
      formData.append('event_title', placeData.event_title ?? '');
      formData.append('event_description', placeData.event_description ?? '');
      formData.append('event_datetime', placeData.event_datetime ?? '');
    }
    if (eventImage) {
      formData.append('event_image', eventImage);
    }
    // Sobrescribir método para compatibilidad con subida de archivos en Laravel
    formData.append('_method', 'PUT');
    
    // Imágenes (solo si se proporcionan)
    if (coverImage) formData.append('portada', coverImage);
    if (climateImage) formData.append('clima_img', climateImage);
    if (featuresImage) formData.append('caracteristicas_img', featuresImage);
    if (floraImage) formData.append('flora_img', floraImage);
    if (infrastructureImage) formData.append('infraestructura_img', infrastructureImage);
    // Usar POST con _method=PUT para asegurar parsing correcto del multipart
    const { data } = await api.post(`/api/places/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    
    return data;
  } catch (error) {
    console.error('Error response:', error.response?.data);
    
    let message = error.response?.data?.message || error.message || 'Error actualizando sitio';
    const errors = error.response?.data?.errors;
    
    if (errors && typeof errors === 'object') {
      // Combinar todos los errores de validación con saltos de línea
      const allErrors = [];
      Object.keys(errors).forEach(field => {
        if (Array.isArray(errors[field])) {
          allErrors.push(...errors[field]);
        }
      });
      if (allErrors.length > 0) {
        message = allErrors.join('\n');
      }
    }
    
    throw new Error(message);
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

export async function updateReview(reviewId, rating, comment) {
  try {
    const { data } = await api.put(`/api/reviews/${reviewId}`, { rating, comment });
    return data;
  } catch (error) {
    throw error.response?.data || { message: 'Error actualizando reseña' };
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

/**
 * Reaccionar a una reseña (like/dislike)
 * @param {number} reviewId - ID de la reseña
 * @param {string} type - 'like' o 'dislike'
 */
export async function reactToReview(reviewId, type) {
  try {
    const { data } = await api.post(`/api/reviews/${reviewId}/react`, { type });
    return data;
  } catch (error) {
    throw error.response?.data || { message: 'Error agregando reacción' };
  }
}

export async function getOperatorReviews() {
  try {
    const { data } = await api.get('/api/operator/reviews');
    return data;
  } catch (error) {
    throw error.response?.data || { message: 'Error obteniendo reseñas' };
  }
}

export async function restrictReviewAsOperator(reviewId, reason = null) {
  try {
    const { data } = await api.post(`/api/operator/reviews/${reviewId}/restrict`, {});
    return data;
  } catch (error) {
    throw error.response?.data || { message: 'Error restringiendo reseña' };
  }
}

export async function unrestrictReviewAsOperator(reviewId) {
  try {
    const { data } = await api.post(`/api/operator/reviews/${reviewId}/unrestrict`);
    return data;
  } catch (error) {
    throw error.response?.data || { message: 'Error desrestringiendo reseña' };
  }
}

// ============ EXPORTAR INSTANCIA DE AXIOS ============
export default api;
