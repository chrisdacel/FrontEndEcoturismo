import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { createPlace, getPlaceById } from './services/placesApi';
import { updatePlace } from './services/api';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix para los iconos de Leaflet en Vite/React
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
});

export default function CreateSitioPageLeaflet() {
  const navigate = useNavigate();
  const { id } = useParams();
  const mapRef = useRef(null);
  const markerRef = useRef(null);
  const mapContainerRef = useRef(null);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const isEdit = Boolean(id);

  const [formData, setFormData] = useState({
    nombre: '',
    slogan: '',
    descripcion: '',
    localizacion: '',
    lat: '',
    lng: '',
    clima: '',
    caracteristicas: '',
    flora: '',
    infraestructura: '',
    recomendacion: '',
  });

  const [images, setImages] = useState({
    portada: null,
    clima_img: null,
    caracteristicas_img: null,
    flora_img: null,
    infraestructura_img: null,
  });

  const [imagePreviews, setImagePreviews] = useState({
    portada: null,
    clima_img: null,
    caracteristicas_img: null,
    flora_img: null,
    infraestructura_img: null,
  });

  // Load existing place data in edit mode
  useEffect(() => {
    async function loadExisting() {
      if (!isEdit) return;
      try {
        const data = await getPlaceById(id);
        const p = data.place || data; // support both shapes
        setFormData({
          nombre: p.name || '',
          slogan: p.slogan || '',
          descripcion: p.description || '',
          localizacion: p.localization || '',
          lat: p.lat ? String(p.lat) : '',
          lng: p.lng ? String(p.lng) : '',
          clima: p.Weather || '',
          caracteristicas: p.features || '',
          flora: p.flora || '',
          infraestructura: p.estructure || '',
          recomendacion: p.tips || '',
        });
        // Existing image previews (constructed from storage paths)
        const base = 'http://localhost:8000/storage/';
        setImagePreviews({
          portada: p.cover ? base + p.cover : null,
          clima_img: p.Weather_img ? base + p.Weather_img : null,
          caracteristicas_img: p.features_img ? base + p.features_img : null,
          flora_img: p.flora_img ? base + p.flora_img : null,
          infraestructura_img: p.estructure_img ? base + p.estructure_img : null,
        });
        if (mapRef.current && markerRef.current && p.lat && p.lng) {
          markerRef.current.setLatLng([parseFloat(p.lat), parseFloat(p.lng)]);
          mapRef.current.setView([parseFloat(p.lat), parseFloat(p.lng)], 13);
        }
      } catch (e) {
        setError(e.message || 'No se pudo cargar el sitio');
      }
    }
    loadExisting();
  }, [isEdit, id]);

  // Inicializar mapa de Leaflet
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    // Crear mapa centrado en Risaralda
    const map = L.map(mapContainerRef.current).setView([4.8087, -75.6906], 10);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; OpenStreetMap',
    }).addTo(map);

    // Crear marcador inicial
    const marker = L.marker([4.8087, -75.6906]).addTo(map);
    markerRef.current = marker;

    // Evento de clic en el mapa
    map.on('click', function(e) {
      marker.setLatLng(e.latlng);
      setFormData(prev => ({
        ...prev,
        lat: e.latlng.lat.toFixed(8),
        lng: e.latlng.lng.toFixed(8),
      }));
    });

    mapRef.current = map;

    // Cleanup
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError('');
  };

  const handleImageChange = (e, fieldName) => {
    const file = e.target.files[0];
    if (file) {
      setImages({
        ...images,
        [fieldName]: file,
      });

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviews({
          ...imagePreviews,
          [fieldName]: reader.result,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validaciones
    if (!formData.lat || !formData.lng) {
      setError('Por favor selecciona una ubicación en el mapa');
      return;
    }

    if (!isEdit) {
      if (!images.portada || !images.clima_img || !images.caracteristicas_img || !images.flora_img || !images.infraestructura_img) {
        setError('Todas las imágenes son requeridas');
        return;
      }
    }

    try {
      setLoading(true);

      if (isEdit) {
        await updatePlace(id, { ...formData }, images.portada, images.clima_img, images.caracteristicas_img, images.flora_img, images.infraestructura_img);
      } else {
        const formDataToSend = new FormData();
        Object.keys(formData).forEach(key => {
          formDataToSend.append(key, formData[key]);
        });
        Object.keys(images).forEach(key => {
          if (images[key]) {
            formDataToSend.append(key, images[key]);
          }
        });
        
        // Debug: Mostrar datos que se envían
        console.log('=== Datos del formulario ===');
        for (let [key, value] of formDataToSend.entries()) {
          if (value instanceof File) {
            console.log(`${key}: [File] ${value.name} (${(value.size / 1024).toFixed(2)} KB)`);
          } else {
            console.log(`${key}: ${value}`);
          }
        }
        
        await createPlace(formDataToSend);
      }

      setSuccess(true);
      setTimeout(() => {
        navigate(isEdit ? `/admin/sitio/${id}` : '/coleccion');
      }, 1500);
    } catch (err) {
      console.error('Error completo:', err);
      setError(err.message || 'Error creando sitio');
      window.scrollTo({ top: 0, behavior: 'smooth' }); // Scroll hacia arriba para ver el error
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <section className="relative pt-24 pb-16 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <button
              onClick={() => navigate(-1)}
              className="inline-flex items-center gap-2 text-emerald-600 hover:text-emerald-700 transition mb-4"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Volver
            </button>
            <h1 className="text-4xl font-bold text-slate-900 mb-2">{isEdit ? 'Editar Sitio Turístico' : 'Crear Sitio Turístico'}</h1>
            <p className="text-slate-600">
              {isEdit ? 'Actualiza la información del sitio' : 'Completa todos los campos para agregar un nuevo sitio ecoturístico'}
            </p>
          </div>

          {/* Success Message */}
          {success && (
            <div className="mb-6 rounded-xl bg-green-50 p-4 ring-1 ring-green-200">
              <div className="flex items-center gap-3">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-green-800">Sitio creado exitosamente. Redirigiendo...</p>
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mb-6 rounded-xl bg-red-50 p-4 ring-1 ring-red-200">
              <p className="text-red-800">{error}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="bg-white rounded-lg border border-emerald-100 shadow-sm shadow-emerald-100/50 p-8 space-y-8">
            
            {/* Información Básica */}
            <div>
              <h2 className="text-2xl font-semibold text-slate-900 mb-4">Información Básica</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Nombre del Sitio *
                  </label>
                  <input
                    type="text"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleChange}
                    required
                    className="w-full rounded-lg border border-emerald-200 bg-white px-4 py-3 text-slate-900 focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 outline-none transition"
                    placeholder="Ej: Reserva natural parque la Nona"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Slogan *
                  </label>
                  <input
                    type="text"
                    name="slogan"
                    value={formData.slogan}
                    onChange={handleChange}
                    required
                    className="w-full rounded-lg border border-emerald-200 bg-white px-4 py-3 text-slate-900 focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 outline-none transition"
                    placeholder="Ej: ¡Conéctate con la naturaleza!"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Descripción *
                  </label>
                  <textarea
                    name="descripcion"
                    value={formData.descripcion}
                    onChange={handleChange}
                    required
                    rows={4}
                    className="w-full rounded-lg border border-emerald-200 bg-white px-4 py-3 text-slate-900 focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 outline-none transition"
                    placeholder="Describe el sitio turístico..."
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Imagen de Portada {isEdit ? '(opcional)' : '*'}
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageChange(e, 'portada')}
                    required={!isEdit}
                    className="w-full rounded-lg border border-emerald-200 bg-white px-4 py-3 text-slate-900 focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 outline-none transition"
                  />
                  {imagePreviews.portada && (
                    <img src={imagePreviews.portada} alt="Preview" className="mt-2 h-32 w-auto rounded-lg object-cover" />
                  )}
                  {isEdit && !imagePreviews.portada && (
                    <p className="mt-2 text-xs text-slate-500">Se mantendrá la imagen actual si no seleccionas una nueva.</p>
                  )}
                </div>
              </div>
            </div>

            {/* Localización */}
            <div>
              <h2 className="text-2xl font-semibold text-slate-900 mb-4">Localización</h2>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Descripción de la Ubicación *
                  </label>
                  <textarea
                    name="localizacion"
                    value={formData.localizacion}
                    onChange={handleChange}
                    required
                    rows={3}
                    className="w-full rounded-lg border border-emerald-200 bg-white px-4 py-3 text-slate-900 focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 outline-none transition"
                    placeholder="Ej: Se encuentra en el municipio de Marsella, a 7 km del casco urbano..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Selecciona la ubicación en el mapa * (Haz clic en el mapa)
                  </label>
                  {formData.lat && formData.lng && (
                    <p className="text-sm text-emerald-600 mb-2">
                      📍 Ubicación seleccionada: {formData.lat}, {formData.lng}
                    </p>
                  )}
                  <div 
                    ref={mapContainerRef} 
                    style={{ height: '400px', width: '100%' }}
                    className="rounded-lg border border-emerald-200"
                  ></div>
                  <p className="text-xs text-slate-500 mt-2">
                    Haz clic en el mapa para seleccionar la ubicación exacta del sitio
                  </p>
                </div>
              </div>
            </div>

            {/* Clima */}
            <div>
              <h2 className="text-2xl font-semibold text-slate-900 mb-4">Clima</h2>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Descripción del Clima *
                  </label>
                  <textarea
                    name="clima"
                    value={formData.clima}
                    onChange={handleChange}
                    required
                    rows={3}
                    className="w-full rounded-lg border border-emerald-200 bg-white px-4 py-3 text-slate-900 focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 outline-none transition"
                    placeholder="Ej: Clima templado y húmedo, con temperaturas entre 17°C y 26°C..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Imagen del Clima {isEdit ? '(opcional)' : '*'}
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageChange(e, 'clima_img')}
                    required={!isEdit}
                    className="w-full rounded-lg border border-emerald-200 bg-white px-4 py-3 text-slate-900 focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 outline-none transition"
                  />
                  {imagePreviews.clima_img && (
                    <img src={imagePreviews.clima_img} alt="Preview" className="mt-2 h-32 w-auto rounded-lg object-cover" />
                  )}
                  {isEdit && !imagePreviews.clima_img && (
                    <p className="mt-2 text-xs text-slate-500">Se mantendrá la imagen actual si no seleccionas una nueva.</p>
                  )}
                </div>
              </div>
            </div>

            {/* Características */}
            <div>
              <h2 className="text-2xl font-semibold text-slate-900 mb-4">Características</h2>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Características del Sitio *
                  </label>
                  <textarea
                    name="caracteristicas"
                    value={formData.caracteristicas}
                    onChange={handleChange}
                    required
                    rows={3}
                    className="w-full rounded-lg border border-emerald-200 bg-white px-4 py-3 text-slate-900 focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 outline-none transition"
                    placeholder="Ej: Senderos ecológicos, zonas de descanso, miradores..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Imagen de Características {isEdit ? '(opcional)' : '*'}
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageChange(e, 'caracteristicas_img')}
                    required={!isEdit}
                    className="w-full rounded-lg border border-emerald-200 bg-white px-4 py-3 text-slate-900 focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 outline-none transition"
                  />
                  {imagePreviews.caracteristicas_img && (
                    <img src={imagePreviews.caracteristicas_img} alt="Preview" className="mt-2 h-32 w-auto rounded-lg object-cover" />
                  )}
                  {isEdit && !imagePreviews.caracteristicas_img && (
                    <p className="mt-2 text-xs text-slate-500">Se mantendrá la imagen actual si no seleccionas una nueva.</p>
                  )}
                </div>
              </div>
            </div>

            {/* Flora */}
            <div>
              <h2 className="text-2xl font-semibold text-slate-900 mb-4">Flora y Fauna</h2>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Descripción de Flora y Fauna *
                  </label>
                  <textarea
                    name="flora"
                    value={formData.flora}
                    onChange={handleChange}
                    required
                    rows={3}
                    className="w-full rounded-lg border border-emerald-200 bg-white px-4 py-3 text-slate-900 focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 outline-none transition"
                    placeholder="Ej: Diversidad de especies nativas, aves endémicas..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Imagen de Flora/Fauna {isEdit ? '(opcional)' : '*'}
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageChange(e, 'flora_img')}
                    required={!isEdit}
                    className="w-full rounded-lg border border-emerald-200 bg-white px-4 py-3 text-slate-900 focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 outline-none transition"
                  />
                  {imagePreviews.flora_img && (
                    <img src={imagePreviews.flora_img} alt="Preview" className="mt-2 h-32 w-auto rounded-lg object-cover" />
                  )}
                  {isEdit && !imagePreviews.flora_img && (
                    <p className="mt-2 text-xs text-slate-500">Se mantendrá la imagen actual si no seleccionas una nueva.</p>
                  )}
                </div>
              </div>
            </div>

            {/* Infraestructura */}
            <div>
              <h2 className="text-2xl font-semibold text-slate-900 mb-4">Infraestructura</h2>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Descripción de la Infraestructura *
                  </label>
                  <textarea
                    name="infraestructura"
                    value={formData.infraestructura}
                    onChange={handleChange}
                    required
                    rows={3}
                    className="w-full rounded-lg border border-emerald-200 bg-white px-4 py-3 text-slate-900 focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 outline-none transition"
                    placeholder="Ej: Cabañas, zonas de camping, restaurante..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Imagen de Infraestructura {isEdit ? '(opcional)' : '*'}
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageChange(e, 'infraestructura_img')}
                    required={!isEdit}
                    className="w-full rounded-lg border border-emerald-200 bg-white px-4 py-3 text-slate-900 focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 outline-none transition"
                  />
                  {imagePreviews.infraestructura_img && (
                    <img src={imagePreviews.infraestructura_img} alt="Preview" className="mt-2 h-32 w-auto rounded-lg object-cover" />
                  )}
                  {isEdit && !imagePreviews.infraestructura_img && (
                    <p className="mt-2 text-xs text-slate-500">Se mantendrá la imagen actual si no seleccionas una nueva.</p>
                  )}
                </div>
              </div>
            </div>

            {/* Recomendaciones */}
            <div>
              <h2 className="text-2xl font-semibold text-slate-900 mb-4">Recomendaciones</h2>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Tips y Recomendaciones *
                </label>
                <textarea
                  name="recomendacion"
                  value={formData.recomendacion}
                  onChange={handleChange}
                  required
                  rows={3}
                  className="w-full rounded-lg border border-emerald-200 bg-white px-4 py-3 text-slate-900 focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 outline-none transition"
                  placeholder="Ej: Llevar ropa impermeable, calzado adecuado..."
                />
              </div>
            </div>

            {/* Botones */}
            <div className="flex items-center justify-end gap-4 pt-6 border-t border-slate-200">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="rounded-full px-6 py-3 text-slate-700 hover:bg-slate-100 border border-emerald-200 transition"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center gap-2 rounded-full bg-emerald-500 px-6 py-3 font-semibold text-white hover:bg-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                {loading ? (
                  <>
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white"></div>
                    Guardando...
                  </>
                ) : (
                  isEdit ? 'Actualizar Sitio' : 'Crear Sitio'
                )}
              </button>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
}
