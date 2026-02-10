import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { getPlaceById } from './services/placesApi';
import {
  api,
  createReview,
  updateReview,
  deleteReview,
  reactToReview,
  logPlaceVisit,
  restrictReviewAsOperator,
  unrestrictReviewAsOperator,
  markNotificationRead,
} from './services/api';
import { useAuth } from './context/AuthContext';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
import Alert from './components/Alert';
import ConfirmDialog from './components/ConfirmDialog';

const greenMarkerSvg = `data:image/svg+xml,${encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" width="25" height="41" viewBox="0 0 25 41">'
  + '<path d="M12.5 0C5.6 0 0 5.6 0 12.5c0 9.4 12.5 28.5 12.5 28.5S25 21.9 25 12.5C25 5.6 19.4 0 12.5 0z" fill="#16a34a" stroke="#0f6b2a" stroke-width="1"/>'
  + '<circle cx="12.5" cy="12.5" r="4.5" fill="#ffffff" fill-opacity="0.9"/>'
  + '</svg>'
)}`;

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: greenMarkerSvg,
  iconRetinaUrl: greenMarkerSvg,
  shadowUrl: markerShadow,
});

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
  const location = useLocation();
  const { user } = useAuth();
  const [sitio, setSitio] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [commentError, setCommentError] = useState(null);
  const [editError, setEditError] = useState(null);
  const [actionError, setActionError] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [filteredReviews, setFilteredReviews] = useState([]);
  const [filterType, setFilterType] = useState('recent');
  const [filterMenuOpen, setFilterMenuOpen] = useState(false);
  const [averageRating, setAverageRating] = useState(null);
  const [comment, setComment] = useState('');
  const [rating, setRating] = useState(5);
  const [submitting, setSubmitting] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editComment, setEditComment] = useState('');
  const [editRating, setEditRating] = useState(5);
  const [isFavorite, setIsFavorite] = useState(false);
  const [favoriteLoading, setFavoriteLoading] = useState(false);
  const [eventData, setEventData] = useState(null);
  const [confirmState, setConfirmState] = useState({ open: false });
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const eventSectionRef = useRef(null);
  // Para múltiples eventos: refs por id
  const eventRefs = useRef({});
  const filterMenuRef = useRef(null);
  const isTourist = user && user.role !== 'admin' && user.role !== 'operator';
  const isOperator = user?.role === 'operator';
  const isAdmin = user?.role === 'admin';
  const isOperatorOwner = isOperator && sitio?.user_id === user?.id;
  const eventEditBasePath = isAdmin ? '/admin' : '/operador';
  const isGuest = !user;
  const shortText = (value, max = 220) => {
    if (!value) return '';
    const text = value.toString().trim();
    return text.length > max ? `${text.slice(0, max - 3)}...` : text;
  };

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
    const handleClickOutside = (event) => {
      if (filterMenuRef.current && !filterMenuRef.current.contains(event.target)) {
        setFilterMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getPlaceById(id);
        setSitio(data.place || data);
        setReviews(data.reviews || []);
        setEventData(data.event || null);
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
    if (!user || !id) return;
    logPlaceVisit(id).catch(() => {});
  }, [id, user]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const notificationId = params.get('notification');
    if (!notificationId) return;
    markNotificationRead(notificationId).catch(() => {});
  }, [location.search]);

  // Scroll automático robusto a la sección de evento
  useEffect(() => {
    if (!location.hash.startsWith('#evento')) return;
    const match = location.hash.match(/^#evento(?:-(\d+))?$/);
    if (!match) return;
    const eventId = match[1];
    let attempts = 0;
    function tryScroll() {
      attempts++;
      if (eventId && eventRefs.current[eventId]) {
        eventRefs.current[eventId].scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else if (!eventId && eventSectionRef.current) {
        eventSectionRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else if (attempts < 10) {
        setTimeout(tryScroll, 200);
      }
    }
    tryScroll();
  }, [location.hash, eventData]);

  // Inicializar mapa cuando sitio esté cargado
  useEffect(() => {
    if (sitio && sitio.lat && sitio.lng && mapRef.current && !mapInstanceRef.current) {
      // Inicializar mapa
      mapInstanceRef.current = L.map(mapRef.current).setView([sitio.lat, sitio.lng], 13);

      // Agregar capa de tiles
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(mapInstanceRef.current);

      const labelNames = Array.isArray(sitio.label)
        ? sitio.label.map((label) => label?.name ?? label)
        : Array.isArray(sitio.labels)
          ? sitio.labels.map((label) => label?.name ?? label)
          : [];
      const labelsText = labelNames.filter(Boolean).slice(0, 3).join(' • ') || 'Sin etiqueta';
      const popupHtml = `
        <div style="display:flex;flex-direction:column;gap:6px;max-width:220px;">
          <strong style="font-size:14px;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;">${sitio.name || 'Sitio'}</strong>
          <span style="font-size:12px;color:#059669;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;">${labelsText}</span>
        </div>
      `;

      // Agregar marcador
      L.marker([sitio.lat, sitio.lng]).addTo(mapInstanceRef.current)
        .bindPopup(popupHtml)
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
  const approvalStatusLabels = {
    approved: 'Aprobado',
    pending: 'Pendiente',
    rejected: 'Rechazado',
  };
  const approvalStatusStyles = {
    approved: 'bg-emerald-500/90 text-white shadow-emerald-500/30 hover:bg-emerald-400',
    pending: 'bg-amber-400/90 text-white shadow-amber-400/30 hover:bg-amber-300',
    rejected: 'bg-rose-500/90 text-white shadow-rose-500/30 hover:bg-rose-400',
  };
  const filterLabels = {
    recent: 'Mas recientes',
    highest: 'Mejor calificacion',
    lowest: 'Peor calificacion',
  };
  const filterOptions = [
    { value: 'recent', label: 'Mas recientes' },
    { value: 'highest', label: 'Mejor calificacion' },
    { value: 'lowest', label: 'Peor calificacion' },
  ];
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

  const handleRestrictReview = async (reviewId) => {
    if (!isOperatorOwner) return;
    setConfirmState({
      open: true,
      title: 'Restringir comentario',
      message: '¿Ocultar este comentario por incumplir las normas?',
      confirmLabel: 'Restringir',
      tone: 'warning',
      onConfirm: async () => {
        try {
          setActionError(null);
          await restrictReviewAsOperator(reviewId);
          setReviews((prev) => prev.map((r) => (r.id === reviewId
            ? { ...r, is_restricted: true, restricted_by_role: 'operator', restriction_reason: null }
            : r
          )));
        } catch (err) {
          setActionError(err?.message || 'Error restringiendo reseña');
        } finally {
          setConfirmState({ open: false });
        }
      },
    });
  };

  const handleUnrestrictReview = async (reviewId) => {
    if (!isOperatorOwner) return;
    setConfirmState({
      open: true,
      title: 'Restaurar comentario',
      message: '¿Mostrar nuevamente este comentario?',
      confirmLabel: 'Restaurar',
      tone: 'info',
      onConfirm: async () => {
        try {
          setActionError(null);
          await unrestrictReviewAsOperator(reviewId);
          setReviews((prev) => prev.map((r) => (r.id === reviewId
            ? { ...r, is_restricted: false, restricted_by_role: null, restriction_reason: null }
            : r
          )));
        } catch (err) {
          setActionError(err?.message || 'Error desrestringiendo reseña');
        } finally {
          setConfirmState({ open: false });
        }
      },
    });
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
    setConfirmState({
      open: true,
      title: 'Eliminar comentario',
      message: '¿Eliminar este comentario?',
      confirmLabel: 'Eliminar',
      tone: 'danger',
      onConfirm: async () => {
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
          setConfirmState({ open: false });
        }
      },
    });
  };

  const handleReaction = async (reviewId, type) => {
    if (!user) {
      setActionError('Debes iniciar sesion para reaccionar');
      return;
    }
    
    try {
      setActionError(null);
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
      setActionError(err.message || 'Error al reaccionar');
    }
  };

  const formatEventDate = (value) => {
    if (!value) return '';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return '';
    const day = date.toLocaleDateString('es-CO', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
    const time = date.toLocaleTimeString('es-CO', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });
    return `${day} ${time}`;
  };

  const scrollToEvent = () => {
    if (!eventSectionRef.current) return;
    eventSectionRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
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
          <div className="rounded-2xl border border-green-200 bg-green-50/80 p-6 flex items-center gap-4 mb-8">
            <div className="flex-shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="#bbf7d0" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01" />
              </svg>
            </div>
            <div>
              <div className="font-semibold text-green-800 text-lg mb-1">El sitio no está disponible en este momento.</div>
              <div className="text-green-700 text-sm">Es posible que haya sido eliminado o ya no sea visible.</div>
              <button
                onClick={() => navigate('/coleccion')}
                className="mt-3 inline-flex items-center gap-2 rounded-full bg-green-600 px-4 py-1.5 text-sm font-semibold text-white shadow-sm transition hover:bg-green-700"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
                Explorar colección
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
  if (!sitio) {
    return null;
  }

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-white text-slate-900">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(76,175,80,0.08),transparent_35%)]" />

      <main>
        {/* Hero Section */}
        <section
          className="relative min-h-[70vh] bg-cover bg-center flex items-center"
          style={{ backgroundImage: `url('${storageUrl(sitio.cover)}')` }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-black/30 to-transparent"></div>
          {(isOperatorOwner || isAdmin) && (
            <button
              type="button"
              onClick={() => navigate(`${isAdmin ? `/admin/sitio/${id}/editar` : `/operador/sitio/${id}/editar`}`)}
              className="absolute top-5 right-5 z-20 inline-flex items-center gap-2 rounded-full bg-white/90 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-emerald-700 shadow-lg shadow-emerald-500/10 transition hover:bg-white"
            >
              Editar
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 20h9" />
                <path d="M16.5 3.5a2.121 2.121 0 113 3L7 19l-4 1 1-4 12.5-12.5z" />
              </svg>
            </button>
          )}
          {(isOperatorOwner || isAdmin) && !eventData && (
            <span
              className={`absolute bottom-5 right-5 z-20 inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-wide shadow-lg transition ${
                approvalStatusStyles[sitio.approval_status || 'pending']
                || 'bg-slate-500/90 text-white shadow-slate-500/30 hover:bg-slate-400'
              }`}
            >
              {approvalStatusLabels[sitio.approval_status || 'pending'] || 'Pendiente'}
            </span>
          )}
          {eventData && (
            <div className="absolute bottom-5 right-5 z-20 flex flex-col items-end gap-2">
              {(isOperatorOwner || isAdmin) && (
                <span
                  className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-wide shadow-lg transition ${
                    approvalStatusStyles[sitio.approval_status || 'pending']
                    || 'bg-slate-500/90 text-white shadow-slate-500/30 hover:bg-slate-400'
                  }`}
                >
                  {approvalStatusLabels[sitio.approval_status || 'pending'] || 'Pendiente'}
                </span>
              )}
              <button
                type="button"
                onClick={scrollToEvent}
                className="inline-flex items-center gap-2 rounded-full bg-emerald-500/90 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-white shadow-lg shadow-emerald-500/30 transition hover:bg-emerald-400"
              >
                Nuevo evento disponible
                <span aria-hidden>↓</span>
              </button>
            </div>
          )}
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
                <h1 className="mt-4 text-[clamp(2rem,4vw,3.5rem)] font-bold leading-tight text-white break-words">{sitio.name}</h1>
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
              {isGuest ? shortText(sitio.description || sitio.slogan) : sitio.description}
            </p>
          </div>
        </section>

        {isGuest && (
          <section className="py-10 px-6 bg-emerald-50/40">
            <div className="max-w-3xl mx-auto rounded-2xl border border-emerald-100 bg-white p-6 text-center shadow-sm shadow-emerald-100/40">
              <h2 className="text-2xl font-semibold text-emerald-700 mb-2">Registrate para ver el sitio completo</h2>
              <p className="text-sm text-slate-600 mb-4">
                Desbloquea ubicacion, clima, caracteristicas, flora, recomendaciones y comentarios.
              </p>
              <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
                <button
                  onClick={() => onNavigateRegister?.()}
                  className="rounded-full bg-emerald-600 px-6 py-2 text-white font-semibold hover:bg-emerald-700"
                >
                  Crear cuenta
                </button>
                <button
                  onClick={() => onNavigateLogin?.()}
                  className="rounded-full border border-emerald-200 px-6 py-2 text-emerald-700 font-semibold hover:bg-emerald-50"
                >
                  Iniciar sesion
                </button>
              </div>
            </div>
          </section>
        )}

        {!isGuest && (
          <>
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

        {!eventData && (
          <section className="bg-white px-6 pb-16">
            <div className="mx-auto max-w-4xl text-center">
              <div className="rounded-3xl border border-emerald-100 bg-emerald-50/40 p-8 shadow-sm">
                <p className="text-sm text-slate-700">
                  Actualmente no hay eventos disponibles, mantente al tanto.
                </p>
                {(isOperatorOwner || isAdmin) && (
                  <div className="mt-6 flex justify-center">
                    <button
                      type="button"
                      onClick={() => navigate(`${eventEditBasePath}/sitio/${id}/evento/crear`)}
                      className="inline-flex items-center gap-2 rounded-full bg-emerald-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-500/20 transition hover:bg-emerald-700"
                    >
                      Crear evento
                    </button>
                  </div>
                )}
              </div>
            </div>
          </section>
        )}

        {eventData && (
          <section
            id={`evento-${eventData.id}`}
            ref={el => {
              eventSectionRef.current = el;
              if (eventData.id) eventRefs.current[eventData.id] = el;
            }}
            className="bg-white px-6 pb-16"
          >
            <div className="mx-auto max-w-5xl">
              <div className="rounded-3xl border border-emerald-100 bg-emerald-50/40 p-8 shadow-sm">
                <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-[0.3em] text-emerald-700">Evento disponible</p>
                    {(isOperatorOwner || isAdmin) && (
                      <div className="mt-3 flex flex-wrap items-center gap-2">
                        <span
                          className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-wide shadow-lg transition ${
                            approvalStatusStyles[eventData.approval_status || 'pending']
                            || 'bg-slate-500/90 text-white shadow-slate-500/30 hover:bg-slate-400'
                          }`}
                        >
                          {approvalStatusLabels[eventData.approval_status || 'pending'] || 'Pendiente'}
                        </span>
                        <button
                          type="button"
                          onClick={() => navigate(`${eventEditBasePath}/evento/${eventData.id}/editar`)}
                          className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-wide text-emerald-700 transition hover:bg-emerald-50"
                        >
                          Editar evento
                        </button>
                      </div>
                    )}
                    <h2 className="mt-2 text-2xl font-bold text-slate-900">{eventData.title || 'Evento ecoturistico'}</h2>
                    <p className="mt-2 text-sm text-slate-600">{formatEventDate(eventData.starts_at)}</p>
                  </div>
                  {eventData.image && (
                    <img
                      src={storageUrl(eventData.image)}
                      alt={eventData.title || 'Evento'}
                      className="h-40 w-full max-w-sm rounded-2xl object-cover shadow-md"
                    />
                  )}
                </div>
                {eventData.description && (
                  <p className="mt-5 text-sm text-slate-700 leading-relaxed">{eventData.description}</p>
                )}
              </div>
            </div>
          </section>
        )}

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
                <div className="relative" ref={filterMenuRef}>
                  <button
                    type="button"
                    onClick={() => setFilterMenuOpen((prev) => !prev)}
                    className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm text-slate-700 ring-1 ring-emerald-200 transition hover:bg-emerald-50"
                  >
                    <span>{filterLabels[filterType] || 'Mas recientes'}</span>
                    <svg
                      className={`h-4 w-4 transition-transform duration-200 ${filterMenuOpen ? 'rotate-180' : ''}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {filterMenuOpen && (
                    <div className="absolute right-0 mt-2 w-56 max-h-none rounded-xl overflow-visible bg-white/90 text-slate-800 shadow-lg ring-1 ring-slate-200/60 backdrop-blur dropdown-open z-20">
                      {filterOptions.map((option) => (
                        <button
                          key={option.value}
                          type="button"
                          onClick={() => {
                            setFilterType(option.value);
                            setFilterMenuOpen(false);
                          }}
                          className="w-full px-4 py-2 text-left text-sm transition-colors hover:bg-slate-100 hover:text-emerald-500"
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
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
                  <Alert type="error" className="mb-2">
                    {commentError}
                  </Alert>
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

            {actionError && (
              <Alert type="error" className="mb-4">
                {actionError}
              </Alert>
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
                        <div className="flex-shrink-0 relative">
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
                          {isOwner && (
                            <span className="absolute -top-1 -right-1 grid h-4 w-4 place-items-center rounded-full bg-emerald-500 text-white shadow">
                              <svg className="h-2.5 w-2.5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                                <path d="M12 2l2.9 6.3 6.9.6-5.2 4.5 1.6 6.6L12 16.6 5.8 20l1.6-6.6-5.2-4.5 6.9-.6L12 2z" />
                              </svg>
                            </span>
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
                              <Alert type="error" className="mb-2">
                                {editError}
                              </Alert>
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
                          <div className="mt-3 rounded-xl border border-amber-200 bg-amber-50/80 px-4 py-3 shadow-sm ring-1 ring-amber-100">
                            <div className="flex items-start gap-3">
                              <div className="mt-0.5 flex h-9 w-9 items-center justify-center rounded-full bg-amber-100 text-amber-700">
                                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3m0 3h.01M10.29 3.86l-7.4 12.82A1.5 1.5 0 004.2 19h15.6a1.5 1.5 0 001.31-2.32l-7.4-12.82a1.5 1.5 0 00-2.6 0z" />
                                </svg>
                              </div>
                              <div>
                                <p className="text-[11px] font-semibold uppercase tracking-wide text-amber-600">Contenido restringido</p>
                                <p className="text-sm text-amber-900/90">
                                  Este comentario ha sido restringido por violar nuestras politicas de bienestar comunitario.
                                </p>
                              </div>
                            </div>
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
          </>
        )}
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

      <ConfirmDialog
        open={confirmState.open}
        title={confirmState.title}
        message={confirmState.message}
        confirmLabel={confirmState.confirmLabel}
        tone={confirmState.tone}
        onClose={() => setConfirmState({ open: false })}
        onConfirm={confirmState.onConfirm}
      />
    </div>
  );
}
