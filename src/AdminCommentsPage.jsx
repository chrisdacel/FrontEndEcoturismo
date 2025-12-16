import React, { useEffect, useState } from 'react';
import { getAdminReviews } from './services/adminApi';
import { deleteReview } from './services/api';
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

  const handleDelete = async (id) => {
    if (!confirm('¿Eliminar esta reseña?')) return;
    try {
      await deleteReview(id);
      setReviews((prev) => prev.filter((r) => r.id !== id));
    } catch (err) {
      alert(err?.message || 'Error eliminando reseña');
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
            <p className="text-sm text-slate-600">Revisa y elimina reseñas de todos los sitios</p>
          </div>
        </div>

        {error && (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</div>
        )}

        {loading ? (
          <div className="text-sm text-slate-600">Cargando reseñas…</div>
        ) : (
          <div className="overflow-x-auto bg-white border border-slate-200 rounded-lg shadow-sm">
            <table className="min-w-full text-sm">
              <thead className="bg-slate-50">
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
                    <td className="px-4 py-3 text-slate-700 max-w-xs break-words">{r.comment}</td>
                    <td className="px-4 py-3 text-slate-600 text-xs">{r.created_at ? new Date(r.created_at).toLocaleString() : '—'}</td>
                    <td className="px-4 py-3">
                      <button
                        className="inline-flex items-center rounded-full bg-red-500 px-3 py-1.5 text-white text-xs shadow-sm hover:bg-red-600"
                        onClick={() => handleDelete(r.id)}
                      >
                        Eliminar
                      </button>
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
