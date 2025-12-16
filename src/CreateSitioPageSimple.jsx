import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPlace } from './services/placesApi';

export default function CreateSitioPageSimple() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

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
      setError('Por favor ingresa las coordenadas (latitud y longitud)');
      return;
    }

    if (!images.portada || !images.clima_img || !images.caracteristicas_img || !images.flora_img || !images.infraestructura_img) {
      setError('Todas las imágenes son requeridas');
      return;
    }

    try {
      setLoading(true);

      // Crear FormData para enviar archivos
      const formDataToSend = new FormData();
      
      // Agregar textos
      Object.keys(formData).forEach(key => {
        formDataToSend.append(key, formData[key]);
      });

      // Agregar imágenes
      Object.keys(images).forEach(key => {
        if (images[key]) {
          formDataToSend.append(key, images[key]);
        }
      });

      await createPlace(formDataToSend);

      setSuccess(true);
      setTimeout(() => {
        navigate('/coleccion');
      }, 2000);
    } catch (err) {
      setError(err.message || 'Error creando sitio');
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
            <h1 className="text-4xl font-bold text-slate-900 mb-2">Crear Sitio Turístico</h1>
            <p className="text-slate-600">
              Completa todos los campos para agregar un nuevo sitio ecoturístico
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
                    Imagen de Portada *
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageChange(e, 'portada')}
                    required
                    className="w-full rounded-lg border border-emerald-200 bg-white px-4 py-3 text-slate-900 focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 outline-none transition"
                  />
                  {imagePreviews.portada && (
                    <img src={imagePreviews.portada} alt="Preview" className="mt-2 h-32 w-auto rounded-lg object-cover" />
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

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Latitud * <span className="text-xs text-slate-500">(Ej: 4.8087)</span>
                    </label>
                    <input
                      type="number"
                      step="any"
                      name="lat"
                      value={formData.lat}
                      onChange={handleChange}
                      required
                      className="w-full rounded-lg border border-emerald-200 bg-white px-4 py-3 text-slate-900 focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 outline-none transition"
                      placeholder="4.8087"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Longitud * <span className="text-xs text-slate-500">(Ej: -75.6906)</span>
                    </label>
                    <input
                      type="number"
                      step="any"
                      name="lng"
                      value={formData.lng}
                      onChange={handleChange}
                      required
                      className="w-full rounded-lg border border-emerald-200 bg-white px-4 py-3 text-slate-900 focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 outline-none transition"
                      placeholder="-75.6906"
                    />
                  </div>
                </div>

                <p className="text-xs text-slate-500">
                  💡 Tip: Puedes buscar las coordenadas en <a href="https://www.google.com/maps" target="_blank" rel="noopener noreferrer" className="text-emerald-600 hover:underline">Google Maps</a> haciendo clic derecho en un lugar
                </p>
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
                    Imagen del Clima *
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageChange(e, 'clima_img')}
                    required
                    className="w-full rounded-lg border border-emerald-200 bg-white px-4 py-3 text-slate-900 focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 outline-none transition"
                  />
                  {imagePreviews.clima_img && (
                    <img src={imagePreviews.clima_img} alt="Preview" className="mt-2 h-32 w-auto rounded-lg object-cover" />
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
                    Imagen de Características *
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageChange(e, 'caracteristicas_img')}
                    required
                    className="w-full rounded-lg border border-emerald-200 bg-white px-4 py-3 text-slate-900 focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 outline-none transition"
                  />
                  {imagePreviews.caracteristicas_img && (
                    <img src={imagePreviews.caracteristicas_img} alt="Preview" className="mt-2 h-32 w-auto rounded-lg object-cover" />
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
                    Imagen de Flora/Fauna *
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageChange(e, 'flora_img')}
                    required
                    className="w-full rounded-lg border border-emerald-200 bg-white px-4 py-3 text-slate-900 focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 outline-none transition"
                  />
                  {imagePreviews.flora_img && (
                    <img src={imagePreviews.flora_img} alt="Preview" className="mt-2 h-32 w-auto rounded-lg object-cover" />
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
                    Imagen de Infraestructura *
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageChange(e, 'infraestructura_img')}
                    required
                    className="w-full rounded-lg border border-emerald-200 bg-white px-4 py-3 text-slate-900 focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 outline-none transition"
                  />
                  {imagePreviews.infraestructura_img && (
                    <img src={imagePreviews.infraestructura_img} alt="Preview" className="mt-2 h-32 w-auto rounded-lg object-cover" />
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
                    Creando...
                  </>
                ) : (
                  'Crear Sitio'
                )}
              </button>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
}
