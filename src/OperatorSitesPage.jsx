import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchUserPlaces, api } from './services/api';

export default function OperatorSitesPage() {
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const loadPlaces = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await fetchUserPlaces();
      setPlaces(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err?.message || 'Error cargando sitios');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPlaces();
  }, []);

  const goEdit = (id) => navigate(`/operador/sitio/${id}/editar`);
  const goDetail = (id) => navigate(`/operador/sitio/${id}`);

  const deletePlaceById = async (id) => {
    if (!confirm('¿Eliminar este sitio?')) return;
    try {
      await api.delete(`/api/places/${id}`);
      loadPlaces();
    } catch (err) {
      alert(err?.message || 'Error eliminando sitio');
    }
  };

  return (
    <div className="min-h-screen bg-white text-slate-900">
      <div className="mx-auto max-w-7xl px-4 md:px-6 py-10">
        <div className="mb-6">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 text-emerald-600 hover:text-emerald-700 transition mb-4"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Volver
          </button>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Mis Sitios</h1>
              <p className="text-sm text-slate-600">Administra, edita y elimina los sitios que has creado</p>
            </div>
            <button
              onClick={() => navigate('/crear-sitio')}
              className="inline-flex items-center gap-2 rounded-full bg-emerald-500 px-4 py-2 font-semibold text-white shadow-sm hover:bg-emerald-600"
            >
              Crear sitio
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</div>
        )}

        {loading ? (
          <div className="text-sm text-slate-600">Cargando sitios…</div>
        ) : (
          <div className="overflow-x-auto bg-white">
            <table className="min-w-full text-sm">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-6 py-3 text-left text-slate-700 uppercase tracking-wider text-xs">Nombre</th>
                  <th className="px-6 py-3 text-left text-slate-700 uppercase tracking-wider text-xs">Slogan</th>
                  <th className="px-6 py-3 text-left text-slate-700 uppercase tracking-wider text-xs">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {places.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50">
                    <td className="px-6 py-4">
                      <div className="flex flex-col items-start gap-2">
                        {p.cover ? (
                          <img
                            src={`http://localhost:8000/api/files/${p.cover}`}
                            alt={p.nombre || p.name}
                            className="w-32 h-20 rounded-md object-cover border border-slate-200 shadow-sm"
                          />
                        ) : (
                          <div className="w-32 h-20 rounded-md bg-slate-100 flex items-center justify-center border border-slate-200">
                            <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                          </div>
                        )}
                        <button
                          className="text-emerald-600 hover:text-emerald-700 font-medium underline underline-offset-4"
                          onClick={() => goDetail(p.id)}
                        >
                          {p.nombre || p.name || '—'}
                        </button>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-slate-700">{p.slogan || '—'}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1">
                        <button
                          className="p-1.5 rounded text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 transition-colors"
                          title="Editar sitio"
                          onClick={() => goEdit(p.id)}
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button
                          className="p-1.5 rounded text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                          title="Eliminar sitio"
                          onClick={() => deletePlaceById(p.id)}
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {places.length === 0 && (
                  <tr>
                    <td colSpan={3} className="px-6 py-6 text-center text-slate-600">Aún no has creado sitios</td>
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
