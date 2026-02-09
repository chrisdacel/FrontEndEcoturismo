import { useEffect, useState } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import Alert from './components/Alert';
import { fetchPublicEvent, markNotificationRead } from './services/api';

export default function EventDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [eventData, setEventData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    const loadEvent = async () => {
      try {
        setLoading(true);
        const data = await fetchPublicEvent(id);
        if (active) {
          setEventData(data);
          setError('');
        }
      } catch (err) {
        if (active) {
          setError(err?.message || 'No se pudo cargar el evento');
        }
      } finally {
        if (active) setLoading(false);
      }
    };

    loadEvent();

    return () => {
      active = false;
    };
  }, [id]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const notificationId = params.get('notification');
    if (!notificationId) return;
    markNotificationRead(notificationId).catch(() => {});
  }, [location.search]);

  const formatDate = (value) => {
    if (!value) return '';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return '';
    return date.toLocaleString('es-CO', {
      dateStyle: 'medium',
      timeStyle: 'short',
    });
  };

  const storageUrl = (path) => (path ? `http://localhost:8000/api/files/${path}` : '');
  const event = eventData?.event;
  const place = eventData?.place;

  return (
    <div className="min-h-screen bg-white text-slate-900 overflow-x-hidden">
      <div className="mx-auto max-w-4xl px-4 md:px-6 py-10">
        <button
          onClick={() => navigate('/turista/notificaciones')}
          className="inline-flex items-center gap-2 text-emerald-600 hover:text-emerald-700 transition mb-6"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Volver a notificaciones
        </button>

        {error && (
          <Alert type="error" className="mb-4">
            {error}
          </Alert>
        )}

        {loading ? (
          <div className="text-sm text-slate-600">Cargando evento...</div>
        ) : !event ? (
          <div className="rounded-2xl border border-emerald-100 bg-emerald-50/40 p-6 text-sm text-slate-700">
            Evento no disponible.
          </div>
        ) : (
          <div className="rounded-3xl border border-emerald-100 bg-white p-6 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wide text-emerald-600">Evento</p>
            <h1 className="mt-2 text-2xl font-bold text-slate-900">{event.title}</h1>
            {event.starts_at && (
              <p className="mt-1 text-sm text-slate-600">{formatDate(event.starts_at)}</p>
            )}
            {event.image && (
              <img
                src={storageUrl(event.image)}
                alt={event.title}
                className="mt-4 h-64 w-full rounded-2xl object-cover"
              />
            )}
            {event.description && (
              <p className="mt-4 text-sm text-slate-700 leading-relaxed">{event.description}</p>
            )}
            {place && (
              <div className="mt-6 rounded-2xl border border-emerald-100 bg-emerald-50/40 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-emerald-600">Sitio</p>
                <p className="mt-1 text-sm font-semibold text-slate-900">{place.name}</p>
                <button
                  type="button"
                  onClick={() => navigate(`/turista/sitio/${place.id}`)}
                  className="mt-3 inline-flex items-center rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700"
                >
                  Ver sitio
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
