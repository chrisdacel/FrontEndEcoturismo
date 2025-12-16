import axios from 'axios';

// Usar la misma instancia de axios con configuración CSRF
const api = axios.create({
  baseURL: 'http://localhost:8000',
  withCredentials: true,
  xsrfCookieName: 'XSRF-TOKEN',
  xsrfHeaderName: 'X-XSRF-TOKEN',
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  }
});

// Interceptor para CSRF
api.interceptors.request.use((config) => {
  const match = document.cookie.match(/XSRF-TOKEN=([^;]+)/);
  if (match) {
    try {
      config.headers['X-XSRF-TOKEN'] = decodeURIComponent(match[1]);
    } catch (e) {
      config.headers['X-XSRF-TOKEN'] = match[1];
    }
  }
  return config;
});

// ============ ADMIN DASHBOARD ============
export async function getAdminDashboard() {
  try {
    const { data } = await api.get('/api/admin/dashboard');
    return data;
  } catch (error) {
    throw error.response?.data || { message: 'Error obteniendo estadísticas' };
  }
}

// ============ USERS MANAGEMENT ============
export async function getAllUsers(filters = {}) {
  try {
    const { data } = await api.get('/api/admin/users', { params: filters });
    return data;
  } catch (error) {
    throw error.response?.data || { message: 'Error obteniendo usuarios' };
  }
}

export async function getUser(id) {
  try {
    const { data } = await api.get(`/api/admin/users/${id}`);
    return data;
  } catch (error) {
    throw error.response?.data || { message: 'Error obteniendo usuario' };
  }
}

export async function createUser(userData) {
  try {
    const { data } = await api.post('/api/admin/users', userData);
    return data;
  } catch (error) {
    throw error.response?.data || { message: 'Error creando usuario' };
  }
}

export async function updateUser(id, userData) {
  try {
    const { data } = await api.put(`/api/admin/users/${id}`, userData);
    return data;
  } catch (error) {
    throw error.response?.data || { message: 'Error actualizando usuario' };
  }
}

export async function deleteUser(id) {
  try {
    const { data } = await api.delete(`/api/admin/users/${id}`);
    return data;
  } catch (error) {
    throw error.response?.data || { message: 'Error eliminando usuario' };
  }
}

// ============ OPERATORS MANAGEMENT ============
export async function getPendingOperators() {
  try {
    const { data } = await api.get('/api/admin/operators/pending');
    return data;
  } catch (error) {
    throw error.response?.data || { message: 'Error obteniendo operadores pendientes' };
  }
}

export async function approveOperator(id) {
  try {
    const { data } = await api.post(`/api/admin/operators/${id}/approve`);
    return data;
  } catch (error) {
    throw error.response?.data || { message: 'Error aprobando operador' };
  }
}

export async function rejectOperator(id) {
  try {
    const { data } = await api.post(`/api/admin/operators/${id}/reject`);
    return data;
  } catch (error) {
    throw error.response?.data || { message: 'Error rechazando operador' };
  }
}

// ============ PLACES MANAGEMENT ============
export async function getAdminPlaces() {
  try {
    const { data } = await api.get('/api/admin/places');
    return data;
  } catch (error) {
    throw error.response?.data || { message: 'Error obteniendo sitios' };
  }
}

export async function deletePlace(id) {
  try {
    const { data } = await api.delete(`/api/admin/places/${id}`);
    return data;
  } catch (error) {
    throw error.response?.data || { message: 'Error eliminando sitio' };
  }
}

// ============ REVIEWS MANAGEMENT ============
export async function getAdminReviews() {
  try {
    const { data } = await api.get('/api/admin/reviews');
    return data;
  } catch (error) {
    throw error.response?.data || { message: 'Error obteniendo reseñas' };
  }
}
