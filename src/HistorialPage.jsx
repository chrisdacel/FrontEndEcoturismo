import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchUserHistory, fetchUserReviews } from './services/api';

export default function HistorialPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [history, setHistory] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError('');
        const [historyData, reviewData] = await Promise.all([
          fetchUserHistory(8),
          fetchUserReviews(8),
        ]);
        setHistory(Array.isArray(historyData) ? historyData : []);
        setReviews(Array.isArray(reviewData) ? reviewData : []);
      } catch (err) {
        setError(err?.message || 'No se pudo cargar el historial');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <div className="min-h-screen bg-white text-slate-900">
      <div className="mx-auto max-w-6xl px-4 md:px-6 py-10">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-emerald-600 hover:text-emerald-700 transition mb-4"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Volver
        </button>

        <div className="mb-6">
          <h1 className="text-3xl font-bold">Historial</h1>
          <p className="text-sm text-slate-600">Consulta tus sitios visitados y comentarios recientes</p>
        </div>

        {error && (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </div>
        )}

        {loading ? (
          <div className="text-sm text-slate-600">Cargando historial...</div>
        ) : (
          <>
            <div className="mb-10">
              <h2 className="text-xl font-semibold text-slate-900 mb-3">Sitios visitados recientemente</h2>
              <div className="overflow-x-auto bg-white border-b border-slate-200">
                <table className="min-w-full text-sm">
                  <thead className="bg-white">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-600">Sitio</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-600">Ubicacion</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-600">Ultima visita</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {history.map((item) => {
                      const placeName = item.place?.name || item.place_name || '—';
                      const placeLocalization = item.place?.localization || item.place_localization || '—';
                      const key = item.id || `${item.place_id || placeName}-${item.visited_at || ''}`;

                      return (
                        <tr key={key} className="hover:bg-slate-50">
                          <td className="px-4 py-3 text-slate-800">
                            {placeName}
                          </td>
                          <td className="px-4 py-3 text-slate-600">
                            {placeLocalization}
                          </td>
                          <td className="px-4 py-3 text-slate-600 text-xs">
                            {item.visited_at ? new Date(item.visited_at).toLocaleString() : '—'}
                          </td>
                        </tr>
                      );
                    })}
                    {history.length === 0 && (
                      <tr>
                        <td colSpan="3" className="px-4 py-6 text-center text-slate-600">No hay visitas recientes</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-slate-900 mb-3">Comentarios realizados</h2>
              <div className="overflow-x-auto bg-white border-b border-slate-200">
                <table className="min-w-full text-sm">
                  <thead className="bg-white">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-600">Sitio</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-600">Calificacion</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-600">Comentario</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-600">Fecha</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {reviews.map((rev) => (
                      <tr key={rev.id} className="hover:bg-slate-50">
                        <td className="px-4 py-3 text-slate-800">{rev.place?.name || '—'}</td>
                        <td className="px-4 py-3 text-slate-700">{rev.rating} / 5</td>
                        <td className="px-4 py-3 text-slate-700 max-w-xs break-words">
                          {rev.is_restricted ? '[ Contenido restringido ]' : rev.comment}
                        </td>
                        <td className="px-4 py-3 text-slate-600 text-xs">
                          {rev.created_at ? new Date(rev.created_at).toLocaleString() : '—'}
                        </td>
                      </tr>
                    ))}
                    {reviews.length === 0 && (
                      <tr>
                        <td colSpan="4" className="px-4 py-6 text-center text-slate-600">No hay comentarios recientes</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
