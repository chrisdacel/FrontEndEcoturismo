import { useEffect, useState } from 'react';
import { useAuth } from './context/AuthContext';
import { fetchOperatorStats } from './services/api';
import Alert from './components/Alert';
import Pagination from './components/Pagination';

function OperatorStatsPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const recentComments = stats.recent_comments || [];
  const formatDate = (value) => {
    if (!value) return '';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return '';
    return date.toLocaleDateString('es-CO', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  useEffect(() => {
    let active = true;
    const loadStats = async () => {
      if (!user || user.role !== 'operator') {
        if (active) {
          setStats({});
          setLoading(false);
        }
        return;
      }

      try {
        setLoading(true);
        const data = await fetchOperatorStats();
        if (active) {
          setStats(data || {});
          setError('');
        }
      } catch (err) {
        if (active) {
          setError(err?.message || 'Error cargando estadisticas');
          setStats({});
        }
      } finally {
        if (active) setLoading(false);
      }
    };

    loadStats();

    return () => {
      active = false;
    };
  }, [user]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-emerald-400/30 border-t-emerald-400"></div>
          <p className="text-sm text-slate-600">Cargando estadisticas...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white px-4">
        <div className="w-full max-w-md">
          <Alert type="error" className="mb-4">
            {error}
          </Alert>
          <button
            onClick={() => window.location.reload()}
            className="rounded-full bg-emerald-500 px-6 py-2 text-white hover:bg-emerald-600"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-slate-900 overflow-x-hidden">
      <section className="relative pt-24 pb-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl font-bold text-slate-900 mb-2">
                Estadisticas del operador
              </h1>
              <p className="text-sm text-slate-600">
                Resumen de interacciones de tus sitios registrados.
              </p>
            </div>
            <div className="flex items-center gap-2" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-lg p-4 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <div className="rounded-full bg-emerald-100 p-3">
                  <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0h6" />
                  </svg>
                </div>
                <span className="text-3xl font-bold text-slate-900">{stats.visits ?? 0}</span>
              </div>
              <h3 className="text-sm font-medium text-slate-600">Visitas</h3>
            </div>

            <div className="bg-white rounded-lg p-4 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <div className="rounded-full bg-pink-100 p-3">
                  <svg className="w-6 h-6 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
                <span className="text-3xl font-bold text-slate-900">{stats.favorites ?? 0}</span>
              </div>
              <h3 className="text-sm font-medium text-slate-600">Favoritos</h3>
            </div>

            <div className="bg-white rounded-lg p-4 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <div className="rounded-full bg-yellow-100 p-3">
                  <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.52 4.674a1 1 0 00.95.69h4.912c.969 0 1.371 1.24.588 1.81l-3.975 2.888a1 1 0 00-.364 1.118l1.52 4.674c.3.921-.755 1.688-1.54 1.118l-3.975-2.888a1 1 0 00-1.176 0l-3.975 2.888c-.784.57-1.838-.197-1.539-1.118l1.52-4.674a1 1 0 00-.364-1.118L2.98 10.101c-.783-.57-.38-1.81.588-1.81h4.912a1 1 0 00.95-.69l1.52-4.674z" />
                  </svg>
                </div>
                <span className="text-3xl font-bold text-slate-900">{stats.avg_rating ?? '0.0'}</span>
              </div>
              <h3 className="text-sm font-medium text-slate-600">Promedio de calificacion</h3>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-slate-900">Comentarios recientes</h3>
              <span className="text-xs text-slate-400">Ultimos {recentComments.length}</span>
            </div>

            {(() => {
              const ITEMS_PER_PAGE = 20;
              const totalPages = Math.ceil(recentComments.length / ITEMS_PER_PAGE);
              const currentComments = recentComments.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

              return (
                <>
                  <div className="space-y-3 text-sm text-slate-700">
                    {recentComments.length > 0 ? (
                      currentComments.map((comment, index) => (
                        <div key={`comment-${index}`} className="rounded-lg bg-slate-50 p-3">
                          <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">
                            {comment.place_name || 'Sitio'}
                          </p>
                          <div className="mt-1 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
                            <span className="font-semibold text-slate-700">{comment.user_name || 'Usuario'}</span>
                            <span>{formatDate(comment.created_at)}</span>
                          </div>
                          <p className="mt-2 text-sm text-slate-700">{comment.comment || ''}</p>
                        </div>
                      ))
                    ) : (
                      <p className="text-slate-500">Sin comentarios recientes.</p>
                    )}
                  </div>
                  {recentComments.length > 0 && (
                    <div className="mt-4">
                      <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={setCurrentPage}
                      />
                    </div>
                  )}
                </>
              );
            })()}
          </div>
        </div>
      </section>
    </div>
  );
}

export default OperatorStatsPage;
