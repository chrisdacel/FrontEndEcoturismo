import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchUserPlaces, api } from './services/api';

export default function AdminSitesPage() {
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

  const goEdit = (id) => navigate(`/admin/sitio/${id}/editar`);

  const deletePlaceById = async (id) => {
    if (!confirm('¿Eliminar este sitio?')) return;
    try {
      await api.delete(`/api/places/${id}`);
      loadPlaces();
    } catch (err) {
      alert(err?.message || 'Error eliminando sitio');
    }
  };

  const goDetail = (id) => navigate(`/admin/sitio/${id}`);

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
              <h1 className="text-3xl font-bold text-slate-900">Gestión de Sitios</h1>
              <p className="text-sm text-slate-600">Administra, edita y elimina sitios turísticos</p>
            </div>
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
                  <th className="px-6 py-3 text-left text-slate-700 uppercase tracking-wider text-xs">Email</th>
                  <th className="px-6 py-3 text-left text-slate-700 uppercase tracking-wider text-xs">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {places.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50">
                    <td className="px-6 py-4">
                      (
                        <button className="text-emerald-600 hover:text-emerald-700 underline underline-offset-4" onClick={() => goDetail(p.id)}>
                          {p.nombre || p.name || '—'}
                        </button>
                      )
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-slate-700">{p.user?.email || p.creator_email || '—'}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <button className="inline-flex items-center rounded-full bg-red-500 px-4 py-1.5 text-white text-sm shadow-sm hover:bg-red-600" onClick={() => deletePlaceById(p.id)}>Eliminar</button>
                        <button className="inline-flex items-center rounded-full bg-white px-4 py-1.5 text-sm ring-1 ring-slate-300 text-slate-700 hover:bg-slate-50" onClick={() => goEdit(p.id)}>Editar</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
