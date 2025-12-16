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
    const message = error.response?.data?.message || error.message || 'Error creando sitio';
    throw new Error(message);
  }
}

export async function getAllPlaces() {
  try {
    const { data } = await api.get('/api/places');
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
