import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getPlaceById } from './services/placesApi';
import { createReview, updateReview, deleteReview } from './services/api';
import { useAuth } from './context/AuthContext';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

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
  const [reviews, setReviews] = useState([]);
  const [averageRating, setAverageRating] = useState(null);
  const [comment, setComment] = useState('');
  const [rating, setRating] = useState(5);
  const [submitting, setSubmitting] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editComment, setEditComment] = useState('');
  const [editRating, setEditRating] = useState(5);
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);

  const calcAverage = (list) => {
    if (!list || list.length === 0) return null;
    const sum = list.reduce((acc, item) => acc + (item.rating || 0), 0);
    return Math.round((sum / list.length) * 10) / 10;
  };

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

  const storageUrl = (path) => (path ? `http://localhost:8000/storage/${path}` : '');

  const handleCreateReview = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
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
      setError(err.message || 'Error enviando reseña');
    } finally {
      setSubmitting(false);
    }
  };

  const startEdit = (review) => {
    setEditingId(review.id);
    setEditComment(review.comment);
    setEditRating(review.rating);
  };

  const handleUpdateReview = async (reviewId) => {
    setSubmitting(true);
    setError(null);
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
      setError(err.message || 'Error actualizando reseña');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteReview = async (reviewId) => {
    if (!confirm('¿Eliminar este comentario?')) return;
    setSubmitting(true);
    setError(null);
    try {
      await deleteReview(reviewId);
      setReviews((prev) => {
        const next = prev.filter((r) => r.id !== reviewId);
        setAverageRating(calcAverage(next));
        return next;
      });
    } catch (err) {
      setError(err.message || 'Error eliminando reseña');
    } finally {
      setSubmitting(false);
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
          <div className="relative z-10 w-full">
            <div className="mx-auto max-w-7xl px-6 py-16">
              <div className="max-w-2xl">
                <span className="inline-flex items-center gap-3 rounded-full bg-emerald-50/20 px-4 py-2 text-sm text-emerald-100 ring-1 ring-white/20">
                  Ecoturismo
                </span>
                <h1 className="mt-4 text-4xl md:text-5xl font-bold leading-tight text-white">{sitio.name}</h1>
                <p className="mt-3 text-lg md:text-xl text-emerald-100/90 max-w-xl">
                  {sitio.slogan}
                </p>
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
            <p className="text-lg text-slate-600 leading-relaxed">
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
                <p className="text-slate-600 leading-relaxed">
                  {sitio.localization}
                </p>
              </div>
              <div className="order-1 md:order-2">
                {sitio.lat && sitio.lng ? (
                  <div 
                    ref={mapRef}
                    className="w-full h-80 rounded-lg border border-emerald-100 shadow-sm shadow-emerald-100/50 overflow-hidden"
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
                <p className="text-slate-600 leading-relaxed">
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
                <p className="text-slate-600 leading-relaxed">
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
                <p className="text-slate-600 leading-relaxed">
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
                <p className="text-slate-600 leading-relaxed">
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

        {/* Comentarios Section */}
        <section className="py-16 px-6 bg-emerald-50/40">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-3xl font-semibold text-emerald-700">Comentarios</h2>
              <span className="text-sm text-slate-600">{reviews.length} comentario(s)</span>
            </div>

            <div className="mb-6 flex items-center gap-3 rounded-lg border border-emerald-100 bg-white px-4 py-3 shadow-sm">
              <div className="text-3xl font-bold text-emerald-700">
                {averageRating !== null ? averageRating.toFixed(1) : '—'}
              </div>
              <div className="text-sm text-slate-600">
                {averageRating !== null ? `Promedio de calificación basado en ${reviews.length} reseña(s)` : 'Sin calificaciones aún'}
              </div>
            </div>

            {error && (
              <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</div>
            )}

            {user && ['user','operator','admin'].includes(user.role) ? (
              <form onSubmit={handleCreateReview} className="mb-8 space-y-3 bg-white rounded-lg border border-emerald-100 p-4 shadow-sm">
                <div className="flex gap-4 items-center">
                  <label className="text-sm font-semibold text-slate-700">Calificación</label>
                  <select
                    value={rating}
                    onChange={(e) => setRating(Number(e.target.value))}
                    className="rounded-lg border border-emerald-200 px-3 py-2 text-slate-800 focus:ring-2 focus:ring-emerald-300"
                  >
                    {[5,4,3,2,1].map((r) => (
                      <option key={r} value={r}>{r} / 5</option>
                    ))}
                  </select>
                </div>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  required
                  minLength={10}
                  maxLength={1000}
                  placeholder="Comparte tu experiencia..."
                  className="w-full rounded-lg border border-emerald-200 px-3 py-2 text-slate-800 focus:ring-2 focus:ring-emerald-300"
                  rows={3}
                />
                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="inline-flex items-center gap-2 rounded-full bg-emerald-600 px-5 py-2 text-white font-semibold hover:bg-emerald-700 disabled:opacity-60"
                  >
                    {submitting ? 'Enviando...' : 'Publicar comentario'}
                  </button>
                </div>
              </form>
            ) : (
              <p className="mb-8 text-sm text-slate-600">Inicia sesión para comentar.</p>
            )}

            <div className="space-y-4">
              {reviews.map((rev) => {
                const isOwner = user && rev.user && user.id === rev.user.id;
                return (
                  <div key={rev.id} className="bg-white rounded-lg border border-emerald-100 p-4 shadow-sm">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-sm font-semibold text-slate-900">{rev.user?.name || 'Usuario'}</p>
                        <p className="text-xs text-slate-500">{rev.created_at ? new Date(rev.created_at).toLocaleString() : ''}</p>
                        {editingId === rev.id ? (
                          <div className="mt-3 space-y-2">
                            <div className="flex gap-2 items-center">
                              <label className="text-xs font-semibold text-slate-700">Calificación</label>
                              <select
                                value={editRating}
                                onChange={(e) => setEditRating(Number(e.target.value))}
                                className="rounded-lg border border-emerald-200 px-2 py-1 text-sm"
                              >
                                {[5,4,3,2,1].map((r) => (
                                  <option key={r} value={r}>{r}</option>
                                ))}
                              </select>
                            </div>
                            <textarea
                              value={editComment}
                              onChange={(e) => setEditComment(e.target.value)}
                              className="w-full rounded-lg border border-emerald-200 px-3 py-2 text-sm"
                              rows={3}
                            />
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleUpdateReview(rev.id)}
                                disabled={submitting}
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
                        ) : (
                          <p className="mt-3 text-slate-700 leading-relaxed">{rev.comment}</p>
                        )}
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-semibold text-emerald-700">{rev.rating} / 5</div>
                        {isOwner && (
                          <div className="mt-2 flex gap-2 justify-end">
                            <button
                              className="text-xs rounded-full border border-emerald-200 px-3 py-1 text-emerald-700 hover:bg-emerald-50"
                              onClick={() => startEdit(rev)}
                            >
                              Editar
                            </button>
                            <button
                              className="text-xs rounded-full bg-red-500 px-3 py-1 text-white hover:bg-red-600"
                              onClick={() => handleDeleteReview(rev.id)}
                            >
                              Eliminar
                            </button>
                          </div>
                        )}
                      </div>
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
