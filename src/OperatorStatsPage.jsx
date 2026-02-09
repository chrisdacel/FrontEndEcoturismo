import { useAuth } from './context/AuthContext';

export default function OperatorStatsPage() {
  const { user } = useAuth();
  const stats = user?.operator_stats || {};
  const recentComments = stats.recent_comments || [];

  return (
    <div className="min-h-screen bg-white text-slate-900">
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
              <span className="text-xs text-slate-400">Ultimos 3</span>
            </div>
            <div className="space-y-3 text-sm text-slate-700">
              {recentComments.length > 0 ? (
                recentComments.slice(0, 3).map((comment, index) => (
                  <div key={`comment-${index}`} className="rounded-lg bg-slate-50 p-3">
                    {comment}
                  </div>
                ))
              ) : (
                <p className="text-slate-500">Sin comentarios recientes.</p>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
