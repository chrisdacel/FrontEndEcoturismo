import React, { useEffect, useState } from 'react';
import { getAdminReviews, restrictReview, unrestrictReview } from './services/adminApi';
import { useNavigate } from 'react-router-dom';

export default function AdminCommentsPage() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const loadReviews = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await getAdminReviews();
      setReviews(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err?.message || 'Error cargando reseñas');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReviews();
  }, []);

  const handleRestrict = async (id) => {
    if (!confirm('¿Restringir esta reseña?')) return;
    try {
      await restrictReview(id);
      setReviews((prev) => prev.map((r) => r.id === id ? { ...r, is_restricted: true } : r));
    } catch (err) {
      alert(err?.message || 'Error restringiendo reseña');
    }
  };

  const handleUnrestrict = async (id) => {
    if (!confirm('¿Desrestringir esta reseña?')) return;
    try {
      await unrestrictReview(id);
      setReviews((prev) => prev.map((r) => r.id === id ? { ...r, is_restricted: false } : r));
    } catch (err) {
      alert(err?.message || 'Error desrestringiendo reseña');
    }
  };

  return (
    <div className="min-h-screen bg-white text-slate-900">
      <div className="mx-auto max-w-7xl px-4 md:px-6 py-10">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-emerald-600 hover:text-emerald-700 transition mb-4"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Volver
        </button>

        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold">Gestionar Comentarios</h1>
            <p className="text-sm text-slate-600">Revisa y restringe reseñas de todos los sitios</p>
          </div>
        </div>

        {error && (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</div>
        )}

        {loading ? (
          <div className="text-sm text-slate-600">Cargando reseñas…</div>
        ) : (
          <div className="overflow-x-auto bg-white border-b border-slate-200">
            <table className="min-w-full text-sm">
              <thead className="bg-white">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-600">Sitio</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-600">Usuario</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-600">Calificación</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-600">Comentario</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-600">Fecha</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-600">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {reviews.map((r) => (
                  <tr key={r.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3 text-slate-800">{r.place?.name || '—'}</td>
                    <td className="px-4 py-3 text-slate-800">{r.user?.name || '—'}</td>
                    <td className="px-4 py-3 text-slate-800">{r.rating} / 5</td>
                    <td className="px-4 py-3 text-slate-700 max-w-xs break-words">{r.is_restricted ? '[ Contenido restringido ]' : r.comment}</td>
                    <td className="px-4 py-3 text-slate-600 text-xs">{r.created_at ? new Date(r.created_at).toLocaleString() : '—'}</td>
                    <td className="px-4 py-3">
                      {r.is_restricted ? (
                        <div className="flex gap-2 items-center">
                          <span className="text-xs text-gray-500 font-semibold">Restringido</span>
                          <button
                            className="inline-flex items-center rounded-full bg-green-500 px-3 py-1.5 text-white text-xs shadow-sm hover:bg-green-600"
                            onClick={() => handleUnrestrict(r.id)}
                          >
                            Desrestringir
                          </button>
                        </div>
                      ) : (
                        <button
                          className="inline-flex items-center rounded-full bg-orange-500 px-3 py-1.5 text-white text-xs shadow-sm hover:bg-orange-600"
                          onClick={() => handleRestrict(r.id)}
                        >
                          Restringir
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
                {reviews.length === 0 && (
                  <tr>
                    <td colSpan="6" className="px-4 py-6 text-center text-slate-600">No hay reseñas registradas</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
