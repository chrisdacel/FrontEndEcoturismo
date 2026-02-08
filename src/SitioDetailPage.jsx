import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getPlaceById } from './services/placesApi';
import { api, createReview, updateReview, deleteReview, reactToReview, logPlaceVisit } from './services/api';
import { useAuth } from './context/AuthContext';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Star Rating Component
function StarRating({ rating, onRatingChange, size = 'medium', interactive = true }) {
  const [hoverRating, setHoverRating] = useState(0);
  const sizeClasses = {
    small: 'w-4 h-4',
    medium: 'w-6 h-6',
    large: 'w-8 h-8'
  };

  if (!interactive) {
    // Versión estática sin interacción
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <div key={star}>
            <svg
              className={`${sizeClasses[size]}`}
              fill={rating >= star ? '#f59e0b' : 'none'}
              stroke={rating >= star ? '#f59e0b' : '#cbd5e1'}
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onRatingChange(star)}
          onMouseEnter={() => setHoverRating(star)}
          onMouseLeave={() => setHoverRating(0)}
          className="transition-transform hover:scale-110"
        >
          <svg
            className={`${sizeClasses[size]} transition-colors`}
            fill={(hoverRating || rating) >= star ? '#f59e0b' : 'none'}
            stroke={(hoverRating || rating) >= star ? '#f59e0b' : '#cbd5e1'}
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
        </button>
      ))}
    </div>
  );
}

export default function SitioDetailPage({
  onNavigateHome,
  onNavigateLogin,
  onNavigateRegister,
  onNavigateSobreNosotros,
  onNavigatePrivacidad,
}) {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [sitio, setSitio] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [commentError, setCommentError] = useState(null);
  const [editError, setEditError] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [filteredReviews, setFilteredReviews] = useState([]);
  const [filterType, setFilterType] = useState('recent');
  const [averageRating, setAverageRating] = useState(null);
  const [comment, setComment] = useState('');
  const [rating, setRating] = useState(5);
  const [submitting, setSubmitting] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editComment, setEditComment] = useState('');
  const [editRating, setEditRating] = useState(5);
  const [isFavorite, setIsFavorite] = useState(false);
  const [favoriteLoading, setFavoriteLoading] = useState(false);
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const isTourist = user && user.role !== 'admin' && user.role !== 'operator';

  const calcAverage = (list) => {
    if (!list || list.length === 0) return null;
    const sum = list.reduce((acc, item) => acc + (item.rating || 0), 0);
    return Math.round((sum / list.length) * 10) / 10;
  };

  const handleCommentChange = (e) => {
    setComment(e.target.value);
    setCommentError(null);
  };

  // Aplicar filtros a las reseñas
  useEffect(() => {
    let sorted = [...reviews];
    
    switch (filterType) {
      case 'recent':
        sorted.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        break;
      case 'highest':
        sorted.sort((a, b) => b.rating - a.rating);
        break;
      case 'lowest':
        sorted.sort((a, b) => a.rating - b.rating);
        break;
      default:
        break;
    }
    
    setFilteredReviews(sorted);
  }, [reviews, filterType]);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getPlaceById(id);
        setSitio(data.place || data);
        setReviews(data.reviews || []);
        const avgFromApi = data.average_rating ?? null;
        setAverageRating(avgFromApi !== null ? Number(avgFromApi) : calcAverage(data.reviews || []));
      } catch (err) {
        setError(err.message || 'Error cargando el sitio');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  useEffect(() => {
    if (!isTourist || !user || !id) return;
    logPlaceVisit(id).catch(() => {});
  }, [id, isTourist, user]);

  // Inicializar mapa cuando sitio esté cargado
  useEffect(() => {
    if (sitio && sitio.lat && sitio.lng && mapRef.current && !mapInstanceRef.current) {
      // Inicializar mapa
      mapInstanceRef.current = L.map(mapRef.current).setView([sitio.lat, sitio.lng], 13);

      // Agregar capa de tiles
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(mapInstanceRef.current);

      // Agregar marcador
      L.marker([sitio.lat, sitio.lng]).addTo(mapInstanceRef.current)
        .bindPopup(`<b>${sitio.name}</b><br>${sitio.localization.substring(0, 50)}...`)
        .openPopup();
    }

    // Cleanup
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [sitio]);

  const storageUrl = (path) => (path ? `http://localhost:8000/api/files/${path}` : '');
  const labelList = Array.isArray(sitio?.label)
    ? sitio.label
    : Array.isArray(sitio?.labels)
      ? sitio.labels
      : [];
  const labelBadges = labelList.length > 0 ? labelList : [{ name: 'Sin etiqueta' }];
  const getLabelStyle = (label) => {
    const rawColor = label?.color;
    if (!rawColor) return null;
    const color = rawColor.startsWith('#') ? rawColor : `#${rawColor}`;
    return {
      backgroundColor: `${color}26`,
      borderColor: `${color}66`,
      color,
    };
  };
  const openingStatusLabels = {
    open: 'Abierto',
    closed_temporarily: 'Cerrado temporalmente',
    open_with_restrictions: 'Abierto con restricciones',
  };
  const openingStatusStyles = {
    open: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    closed_temporarily: 'bg-rose-50 text-rose-700 border-rose-200',
    open_with_restrictions: 'bg-amber-50 text-amber-700 border-amber-200',
  };
  const daysOfWeek = [
    { key: 'lunes', label: 'Lunes' },
    { key: 'martes', label: 'Martes' },
    { key: 'miercoles', label: 'Miercoles' },
    { key: 'jueves', label: 'Jueves' },
    { key: 'viernes', label: 'Viernes' },
    { key: 'sabado', label: 'Sabado' },
    { key: 'domingo', label: 'Domingo' },
  ];
  const openDaysMap = (sitio && typeof sitio.open_days === 'object' && sitio.open_days !== null)
    ? sitio.open_days
    : {};
  const openDaysList = daysOfWeek.filter((day) => Boolean(openDaysMap[day.key])).map((day) => day.label);

  useEffect(() => {
    let active = true;
    if (!isTourist) {
      setIsFavorite(false);
      return undefined;
    }

    api.get('/api/favorites')
      .then((response) => {
        if (!active) return;
        const ids = new Set((response.data || []).map((fav) => fav.id));
        setIsFavorite(ids.has(Number(id)) || ids.has(id));
      })
      .catch(() => {
        if (active) setIsFavorite(false);
      });

    return () => {
      active = false;
    };
  }, [id, isTourist]);

  const handleToggleFavorite = async () => {
    if (!user) {
      onNavigateLogin?.();
      return;
    }
    if (!isTourist || favoriteLoading) return;

    try {
      setFavoriteLoading(true);
      if (isFavorite) {
        await api.delete(`/api/places/${id}/favorite`);
        setIsFavorite(false);
      } else {
        await api.post(`/api/places/${id}/favorite`);
        setIsFavorite(true);
      }
    } catch (_) {
      // Silenciar para evitar ruidos en UI
    } finally {
      setFavoriteLoading(false);
    }
  };

  const handleCreateReview = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setCommentError(null);
    try {
      const res = await createReview(id, rating, comment);
      const newReview = res.review || res;
      setReviews((prev) => {
        const updated = [newReview, ...prev];
        setAverageRating(calcAverage(updated));
        return updated;
      });
      setComment('');
      setRating(5);
    } catch (err) {
      setCommentError(err.message || 'Error enviando reseña');
    } finally {
      setSubmitting(false);
    }
  };

  const startEdit = (review) => {
    setEditingId(review.id);
    setEditComment(review.comment);
    setEditRating(review.rating);
    setEditError(null);
  };

  const handleUpdateReview = async (reviewId) => {
    setSubmitting(true);
    setEditError(null);
    try {
      const res = await updateReview(reviewId, editRating, editComment);
      const updated = res.review || res;
      setReviews((prev) => {
        const next = prev.map((r) => (r.id === reviewId ? updated : r));
        setAverageRating(calcAverage(next));
        return next;
      });
      setEditingId(null);
      setEditComment('');
      setEditRating(5);
    } catch (err) {
      setEditError(err.message || 'Error actualizando reseña');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteReview = async (reviewId) => {
    if (!confirm('¿Eliminar este comentario?')) return;
    setSubmitting(true);
    setCommentError(null);
    try {
      await deleteReview(reviewId);
      setReviews((prev) => {
        const next = prev.filter((r) => r.id !== reviewId);
        setAverageRating(calcAverage(next));
        return next;
      });
    } catch (err) {
      setCommentError(err.message || 'Error eliminando reseña');
    } finally {
      setSubmitting(false);
    }
  };

  const handleReaction = async (reviewId, type) => {
    if (!user) {
      alert('Debes iniciar sesión para reaccionar');
      return;
    }
    
    try {
      await reactToReview(reviewId, type);
      
      // Actualizar el estado local
      setReviews((prev) => prev.map((r) => {
        if (r.id === reviewId) {
          const currentReaction = r.user_reaction;
          let newLikesCount = r.likes_count || 0;
          let newDislikesCount = r.dislikes_count || 0;
          
          // Si ya tenía esta reacción, quitarla (toggle)
          if (currentReaction === type) {
            if (type === 'like') newLikesCount--;
            else newDislikesCount--;
            return { ...r, user_reaction: null, likes_count: newLikesCount, dislikes_count: newDislikesCount };
          }
          
          // Si tenía otra reacción, cambiarla
          if (currentReaction) {
            if (currentReaction === 'like') newLikesCount--;
            else newDislikesCount--;
          }
          
          // Agregar la nueva reacción
          if (type === 'like') newLikesCount++;
          else newDislikesCount++;
          
          return { ...r, user_reaction: type, likes_count: newLikesCount, dislikes_count: newDislikesCount };
        }
        return r;
      }));
    } catch (err) {
      alert(err.message || 'Error al reaccionar');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white grid place-items-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-emerald-400/30 border-t-emerald-500" />
      </div>
    );
  }
  if (error) {
    return (
      <div className="min-h-screen bg-white grid place-items-center p-6">
        <div className="max-w-md text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-2">No se pudo cargar el sitio</h2>
          <p className="text-slate-600 mb-4">{error}</p>
          <button onClick={() => navigate('/coleccion')} className="rounded-full bg-emerald-600 px-6 py-3 text-white">Volver a Colección</button>
        </div>
      </div>
    );
  }
  if (!sitio) {
    return null;
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-white text-slate-900">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(76,175,80,0.08),transparent_35%)]" />

      <main>
        {/* Hero Section */}
        <section
          className="relative min-h-[70vh] bg-cover bg-center flex items-center"
          style={{ backgroundImage: `url('${storageUrl(sitio.cover)}')` }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-black/30 to-transparent"></div>
          {isTourist && (
            <button
              type="button"
              onClick={handleToggleFavorite}
              disabled={favoriteLoading}
              className={`absolute right-5 top-5 z-20 inline-flex h-12 w-12 items-center justify-center rounded-full ring-1 backdrop-blur transition ${
                isFavorite
                  ? 'bg-emerald-600 text-white ring-emerald-200'
                  : 'bg-white/85 text-emerald-700 ring-white/60 hover:bg-white'
              } ${favoriteLoading ? 'opacity-70' : ''}`}
              aria-label="Guardar en favoritos"
              title="Guardar en favoritos"
            >
              <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z" />
              </svg>
            </button>
          )}
          <div className="relative z-10 w-full">
            <div className="mx-auto max-w-7xl px-6 py-16">
              <div className="max-w-2xl">
                <h1 className="mt-4 text-4xl md:text-5xl font-bold leading-tight text-white">{sitio.name}</h1>
                <p className="mt-3 text-lg md:text-xl text-emerald-100/90 max-w-xl">
                  {sitio.slogan}
                </p>
                <div className="mt-5 flex flex-wrap gap-2">
                  {labelBadges.map((label) => {
                    const labelText = label?.name || label;
                    const labelStyle = getLabelStyle(label);
                    return (
                      <span
                        key={labelText}
                        style={labelStyle || undefined}
                        className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold backdrop-blur ${
                          labelStyle
                            ? 'border'
                            : 'bg-emerald-50/20 text-emerald-100 ring-1 ring-white/20'
                        }`}
                      >
                        {labelText}
                      </span>
                    );
                  })}
                </div>
                <div className="mt-6">
                  <button 
                    className="rounded-full bg-emerald-600 px-6 py-3 font-semibold text-white shadow-lg shadow-emerald-500/20 transition hover:-translate-y-0.5 hover:bg-emerald-700"
                    onClick={() => navigate('/coleccion')}
                  >
                    Volver a Colección
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Description Section */}
        <section className="py-16 px-6 bg-white">
          <div className="max-w-4xl mx-auto text-center">
            <p className="text-lg text-slate-600 leading-relaxed break-words">
              {sitio.description}
            </p>
          </div>
        </section>

        {/* Localización Section */}
        <section className="py-16 px-6 bg-emerald-50/30">
          <div className="max-w-7xl mx-auto">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div className="order-2 md:order-1">
                <h2 className="text-3xl font-semibold text-emerald-700 mb-4">Localización</h2>
                <p className="text-slate-600 leading-relaxed break-words">
                  {sitio.localization}
                </p>
              </div>
              <div className="order-1 md:order-2 relative z-0">
                {sitio.lat && sitio.lng ? (
                  <div 
                    ref={mapRef}
                    className="w-full h-80 rounded-lg border border-emerald-100 shadow-sm shadow-emerald-100/50 overflow-hidden z-0"
                  ></div>
                ) : (
                  <div className="w-full h-80 grid place-items-center rounded-lg border border-emerald-100 bg-emerald-50/50 text-slate-500">
                    Mapa no disponible
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Clima Section */}
        <section className="py-16 px-6 bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div className="order-1">
                <img
                  src={storageUrl(sitio.Weather_img)}
                  alt="Vegetación y clima"
                  className="w-full h-80 object-cover rounded-lg border border-emerald-100 shadow-sm shadow-emerald-100/50"
                />
              </div>
              <div className="order-2">
                <h2 className="text-3xl font-semibold text-emerald-700 mb-4">Clima</h2>
                <p className="text-slate-600 leading-relaxed break-words">
                  {sitio.Weather}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Características Section */}
        <section className="py-16 px-6 bg-emerald-50/30">
          <div className="max-w-7xl mx-auto">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div className="order-2 md:order-1">
                <h2 className="text-3xl font-semibold text-emerald-700 mb-4">Características</h2>
                <p className="text-slate-600 leading-relaxed break-words">
                  {sitio.features}
                </p>
              </div>
              <div className="order-1 md:order-2">
                <img
                  src={storageUrl(sitio.features_img)}
                  alt="Vista de montaña y reserva natural"
                  className="w-full h-80 object-cover rounded-lg border border-emerald-100 shadow-sm shadow-emerald-100/50"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Flora y Fauna Section */}
        <section className="py-16 px-6 bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div className="order-1">
                <img
                  src={storageUrl(sitio.flora_img)}
                  alt="Flora y fauna del parque"
                  className="w-full h-80 object-cover rounded-lg border border-emerald-100 shadow-sm shadow-emerald-100/50"
                />
              </div>
              <div className="order-2">
                <h2 className="text-3xl font-semibold text-emerald-700 mb-4">Flora y Fauna</h2>
                <p className="text-slate-600 leading-relaxed break-words">
                  {sitio.flora}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Infraestructura Section */}
        <section className="py-16 px-6 bg-emerald-50/30">
          <div className="max-w-7xl mx-auto">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div className="order-2 md:order-1">
                <h2 className="text-3xl font-semibold text-emerald-700 mb-4">Infraestructura</h2>
                <p className="text-slate-600 leading-relaxed break-words">
                  {sitio.estructure}
                </p>
              </div>
              <div className="order-1 md:order-2">
                <img
                  src={storageUrl(sitio.estructure_img)}
                  alt="Infraestructura del parque"
                  className="w-full h-80 object-cover rounded-lg border border-emerald-100 shadow-sm shadow-emerald-100/50"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Recomendaciones Section */}
        <section className="py-16 px-6 bg-white">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-semibold text-emerald-700 mb-6">Recomendaciones</h2>
            <p className="text-slate-600 leading-relaxed">
              {sitio.tips}
            </p>
          </div>
        </section>

        <section className="py-16 px-6 bg-emerald-50/30">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl font-semibold text-emerald-700 mb-6 text-center">Contacto y disponibilidad</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="rounded-2xl border border-emerald-100 bg-white p-6 shadow-sm shadow-emerald-100/40">
                <h3 className="text-lg font-semibold text-slate-900 mb-3">Contacto</h3>
                <p className="text-slate-600 whitespace-pre-line break-words">
                  {sitio.contact_info || 'No disponible.'}
                </p>
              </div>
              <div className="rounded-2xl border border-emerald-100 bg-white p-6 shadow-sm shadow-emerald-100/40">
                <h3 className="text-lg font-semibold text-slate-900 mb-3">Estado del sitio</h3>
                <div className={`inline-flex items-center rounded-full border px-3 py-1 text-sm font-semibold ${openingStatusStyles[sitio.opening_status] || 'bg-slate-50 text-slate-700 border-slate-200'}`}>
                  {openingStatusLabels[sitio.opening_status] || 'Estado no disponible'}
                </div>
                <div className="mt-4">
                  <h4 className="text-sm font-semibold text-slate-700 mb-2">Dias abiertos</h4>
                  {openDaysList.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {openDaysList.map((day) => (
                        <span key={day} className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                          {day}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-slate-500">No disponible.</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Comentarios Section */}
        <section className="py-16 px-6 bg-emerald-50/40">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-3xl font-semibold text-emerald-700">Comentarios</h2>
                <span className="text-sm text-slate-600">{reviews.length} comentario(s)</span>
              </div>
              
              {/* Filtro de comentarios */}
              <div className="flex items-center gap-2">
                <label className="text-sm font-semibold text-slate-700">Ordenar por:</label>
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="rounded-lg border border-emerald-200 px-3 py-2 text-sm text-slate-800 focus:ring-2 focus:ring-emerald-300"
                >
                  <option value="recent">Más recientes</option>
                  <option value="highest">Mejor calificación</option>
                  <option value="lowest">Peor calificación</option>
                </select>
              </div>
            </div>

            <div className="mb-6 flex items-center gap-3 rounded-lg border border-emerald-100 bg-white px-4 py-3 shadow-sm">
              <div className="flex flex-col items-center gap-1">
                <div className="text-3xl font-bold text-emerald-700">
                  {averageRating !== null ? averageRating.toFixed(1) : '—'}
                </div>
                {averageRating !== null && (
                  <StarRating rating={Math.round(averageRating)} onRatingChange={() => {}} size="small" interactive={false} />
                )}
              </div>
              <div className="text-sm text-slate-600">
                {averageRating !== null ? `Promedio de calificación basado en ${reviews.length} reseña(s)` : 'Sin calificaciones aún'}
              </div>
            </div>

            {user && ['user','operator','admin'].includes(user.role) ? (
              <form onSubmit={handleCreateReview} className="mb-8 space-y-3 bg-white rounded-lg border border-emerald-100 p-4 shadow-sm">
                <div className="flex gap-4 items-center">
                  <label className="text-sm font-semibold text-slate-700">Calificación</label>
                  <StarRating rating={rating} onRatingChange={setRating} size="medium" />
                  <span className="text-sm text-slate-600">({rating}/5)</span>
                </div>
                <div className="space-y-1">
                  <textarea
                    value={comment}
                    onChange={handleCommentChange}
                    required
                    minLength={10}
                    maxLength={1000}
                    placeholder="Comparte tu experiencia..."
                    className="w-full rounded-lg border border-emerald-200 px-3 py-2 text-slate-800 focus:ring-2 focus:ring-emerald-300"
                    rows={3}
                  />
                  <div className={`text-xs font-medium ${
                    comment.length > 1000 ? 'text-red-600' : comment.length > 900 ? 'text-amber-600' : 'text-slate-500'
                  }`}>
                    {comment.length}/1000 caracteres máximo (mínimo 10)
                  </div>
                </div>
                {commentError && (
                  <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{commentError}</div>
                )}
                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={submitting || !rating || comment.length < 10 || comment.length > 1000}
                    className="inline-flex items-center gap-2 rounded-full bg-emerald-600 px-5 py-2 text-white font-semibold hover:bg-emerald-700 disabled:opacity-60"
                  >
                    {submitting ? 'Enviando...' : 'Publicar comentario'}
                  </button>
                </div>
              </form>
            ) : (
              <p className="mb-8 text-sm text-slate-600">Inicia sesión para comentar.</p>
            )}

            <div className="space-y-4 max-w-4xl mx-auto">
              {filteredReviews.map((rev) => {
                const hasUser = Boolean(rev.user && rev.user.id);
                const isOwner = user && hasUser && user.id === rev.user.id;
                const displayName = hasUser ? (rev.user?.name || 'Usuario') : '[usuario no encontrado]';
                const avatarInitial = hasUser && rev.user?.name ? rev.user.name.charAt(0).toUpperCase() : 'U';
                return (
                  <div key={rev.id} className="group bg-white rounded-lg border border-emerald-100 p-4 shadow-sm overflow-hidden">
                    <div className={editingId === rev.id ? "flex flex-col gap-3" : "flex items-start justify-between gap-3"}>
                      <div className="flex items-start gap-3 flex-1 min-w-0">
                        {/* Avatar del usuario */}
                        <div className="flex-shrink-0">
                          {hasUser && rev.user?.image ? (
                            <img 
                              src={`http://localhost:8000/api/files/${rev.user.image}`}
                              alt={displayName}
                              className="w-10 h-10 rounded-full object-cover border border-emerald-200"
                            />
                          ) : (
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm ${hasUser ? 'bg-emerald-600 text-white' : 'bg-slate-300 text-slate-700'}`}>
                              {avatarInitial}
                            </div>
                          )}
                        </div>
                        
                        {/* Nombre y fecha */}
                        <div className="flex-1 min-w-0">
                          <p className={`text-sm font-semibold truncate ${isOwner ? 'text-emerald-700' : 'text-slate-900'}`}>{displayName}</p>
                          <p className="text-xs text-slate-500">{rev.created_at ? new Date(rev.created_at).toLocaleString() : ''}</p>
                        
                        {/* Contenido del comentario */}
                        {editingId === rev.id ? (
                          <div className="w-full mt-3 space-y-2">
                            <div className="flex gap-2 items-center">
                              <label className="text-xs font-semibold text-slate-700">Calificación</label>
                              <StarRating rating={editRating} onRatingChange={setEditRating} size="small" />
                              <span className="text-xs text-slate-600">({editRating}/5)</span>
                            </div>
                            <div className="space-y-1">
                              <textarea
                                value={editComment}
                                onChange={(e) => setEditComment(e.target.value)}
                                maxLength={1000}
                                className="w-full rounded-lg border border-emerald-200 px-3 py-2 text-slate-800 focus:ring-2 focus:ring-emerald-300"
                                rows={3}
                              />
                              <div className={`text-xs font-medium ${
                                editComment.length > 1000 ? 'text-red-600' : editComment.length > 900 ? 'text-amber-600' : 'text-slate-500'
                              }`}>
                                {editComment.length}/1000 caracteres máximo (mínimo 10)
                              </div>
                            </div>
                            {editError && (
                              <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{editError}</div>
                            )}
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleUpdateReview(rev.id)}
                                disabled={submitting || editComment.length === 0 || editComment.length > 1000}
                                className="rounded-full bg-emerald-600 px-4 py-2 text-white text-sm hover:bg-emerald-700 disabled:opacity-60"
                              >
                                Guardar
                              </button>
                              <button
                                onClick={() => setEditingId(null)}
                                className="rounded-full border border-slate-300 px-4 py-2 text-sm text-slate-700"
                              >
                                Cancelar
                              </button>
                            </div>
                          </div>
                        ) : rev.is_restricted ? (
                          <div className="mt-3 bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                            <p className="text-sm text-yellow-800 flex items-start gap-2">
                              <span className="text-lg">⚠️</span>
                              <span><strong>Contenido restringido:</strong> Este comentario ha sido restringido por violar nuestras políticas de bienestar comunitario.</span>
                            </p>
                          </div>
                        ) : (
                          <>
                            <p className="mt-3 text-slate-700 leading-relaxed break-words overflow-hidden w-full">{rev.comment}</p>
                            
                            {/* Botones de Like/Dislike */}
                            <div className="mt-3 flex items-center gap-4">
                              <button
                                onClick={() => handleReaction(rev.id, 'like')}
                                className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm transition ${
                                  rev.user_reaction === 'like'
                                    ? 'bg-emerald-100 text-emerald-700 font-semibold'
                                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                }`}
                              >
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                  <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
                                </svg>
                                <span>{rev.likes_count || 0}</span>
                              </button>
                              
                              <button
                                onClick={() => handleReaction(rev.id, 'dislike')}
                                className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm transition ${
                                  rev.user_reaction === 'dislike'
                                    ? 'bg-red-100 text-red-700 font-semibold'
                                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                }`}
                              >
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                  <path d="M18 9.5a1.5 1.5 0 11-3 0v-6a1.5 1.5 0 013 0v6zM14 9.667v-5.43a2 2 0 00-1.105-1.79l-.05-.025A4 4 0 0011.055 2H5.64a2 2 0 00-1.962 1.608l-1.2 6A2 2 0 004.44 12H8v4a2 2 0 002 2 1 1 0 001-1v-.667a4 4 0 01.8-2.4l1.4-1.866a4 4 0 00.8-2.4z" />
                                </svg>
                                <span>{rev.dislikes_count || 0}</span>
                              </button>
                            </div>
                          </>
                        )}
                        </div>
                      </div>
                      {!editingId || editingId !== rev.id ? (
                        <div className="text-right">
                        <div className="flex flex-col items-end gap-1">
                          <StarRating rating={rev.rating} onRatingChange={() => {}} size="small" interactive={false} />
                          <span className="text-xs text-slate-600">({rev.rating}/5)</span>
                        </div>
                        {isOwner && (
                          <div className="mt-2 flex gap-1 justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              className="p-1 rounded text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 transition-colors"
                              title="Editar comentario"
                              onClick={() => startEdit(rev)}
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                            </button>
                            <button
                              className="p-1 rounded text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                              title="Eliminar comentario"
                              onClick={() => handleDeleteReview(rev.id)}
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </div>
                        )}
                      </div>
                      ) : null}
                    </div>
                  </div>
                );
              })}

              {reviews.length === 0 && (
                <div className="text-sm text-slate-600">Sé el primero en comentar este sitio.</div>
              )}
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-emerald-100 bg-emerald-50/50 py-12 px-6 text-slate-700">
        <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-8">
          {/* Column 1 */}
          <div>
            <h2 className="text-2xl font-bold mb-2 text-slate-900">Conexion</h2>
            <p className="text-slate-700 mb-4">EcoRisaralda</p>
            <div className="flex gap-4 mb-4 text-emerald-600">
              <a href="#" className="hover:text-emerald-800 transition">
                <i className="fab fa-facebook text-xl"></i>
              </a>
              <a href="#" className="hover:text-emerald-800 transition">
                <i className="fab fa-linkedin text-xl"></i>
              </a>
              <a href="#" className="hover:text-emerald-800 transition">
                <i className="fab fa-youtube text-xl"></i>
              </a>
              <a href="#" className="hover:text-emerald-800 transition">
                <i className="fab fa-instagram text-xl"></i>
              </a>
            </div>
            <div className="flex items-center gap-2">
              <span>🌐</span>
              <select className="bg-white text-slate-700 px-2 py-1 rounded border border-emerald-200">
                <option>Español</option>
                <option>English</option>
              </select>
            </div>
          </div>

          {/* Column 2 */}
          <div>
            <h4 className="text-lg font-bold mb-4 text-slate-900">Información</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="text-slate-700 hover:text-slate-900">Conexión EcoRisaralda</a></li>
              <li><a href="#" className="text-slate-700 hover:text-slate-900">Descripción</a></li>
              <li><a href="#" className="text-slate-700 hover:text-slate-900">Lema</a></li>
            </ul>
          </div>

          {/* Column 3 */}
          <div>
            <h4 className="text-lg font-bold mb-4 text-slate-900">Navegación rápida</h4>
            <ul className="space-y-2 text-sm text-slate-700">
              <li><button onClick={onNavigateHome} className="text-left hover:text-slate-900">Inicio</button></li>
              <li><button onClick={onNavigateSobreNosotros} className="text-left hover:text-slate-900">Sobre nosotros</button></li>
              <li><button onClick={onNavigatePrivacidad} className="text-left hover:text-slate-900">Políticas</button></li>
            </ul>
          </div>

          {/* Column 4 */}
          <div>
            <h4 className="text-lg font-bold mb-4 text-slate-900">Contacto y soporte</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="mailto:ecorisaralda@contacto.com" className="text-slate-700 hover:text-slate-900">ecorisaralda@contacto.com</a></li>
              <li><a href="#" className="text-slate-700 hover:text-slate-900">300 445 80055</a></li>
              <li><a href="#" className="text-slate-700 hover:text-slate-900">Preguntas</a></li>
            </ul>
          </div>
        </div>

        {/* Footer bottom */}
        <div className="max-w-7xl mx-auto mt-12 border-t border-emerald-100 pt-6 text-center text-sm text-slate-600">
          <p className="mb-2"><em>Conectando viajeros con la naturaleza. Explora, guarda y comparte experiencias únicas.</em></p>
          <p>© 2025 Conexión EcoRisaralda – Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  );
}
