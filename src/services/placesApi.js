import { api } from './api';

// Usar la instancia existente en lugar de crear una nueva
export async function createPlace(formData) {
  try {
    const { data } = await api.post('/api/places', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      }
    });
    return data;
  } catch (error) {
    console.error('Error response:', error.response?.data);
    
    let message = error.response?.data?.message || error.message || 'Error creando sitio';
    const errors = error.response?.data?.errors;
    
    if (errors && typeof errors === 'object') {
      // Combinar todos los errores de validación
      const allErrors = [];
      Object.keys(errors).forEach(field => {
        if (Array.isArray(errors[field])) {
          allErrors.push(...errors[field]);
        }
      });
      if (allErrors.length > 0) {
        message = allErrors.join(' | ');
      }
    }
    
    throw new Error(message);
  }
}

export async function getAllPlaces(search) {
  try {
    const config = search && search.trim() !== '' ? { params: { search: search.trim() } } : undefined;
    const { data } = await api.get('/api/places', config);
    return data;
  } catch (error) {
    const message = error.response?.data?.message || error.message || 'Error obteniendo sitios';
    throw new Error(message);
  }
}

export async function getPlaceById(id) {
  try {
    const { data } = await api.get(`/api/places/${id}`);
    return data;
  } catch (error) {
    const message = error.response?.data?.message || error.message || 'Error obteniendo sitio';
    throw new Error(message);
  }
}

export async function getUserPlaces() {
  try {
    const { data } = await api.get('/api/user-places');
    return data;
  } catch (error) {
    const message = error.response?.data?.message || error.message || 'Error obteniendo tus sitios';
    throw new Error(message);
  }
}

export async function deletePlace(id) {
  try {
    const { data } = await api.delete(`/api/places/${id}`);
    return data;
  } catch (error) {
    const message = error.response?.data?.message || error.message || 'Error eliminando sitio';
    throw new Error(message);
  }
}
