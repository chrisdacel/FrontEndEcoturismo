import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getPendingOperators, approveOperator, rejectOperator } from './services/adminApi';

export default function AdminOperatorsPage() {
  const navigate = useNavigate();
  const [operators, setOperators] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [busyId, setBusyId] = useState(null);

  useEffect(() => {
    loadPending();
  }, []);

  const loadPending = async () => {
    try {
      setLoading(true);
      const data = await getPendingOperators();
      setOperators(data);
      setError('');
    } catch (err) {
      setError(err.message || 'Error cargando operadores');
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (id, action) => {
    try {
      setBusyId(id);
      if (action === 'approve') {
        await approveOperator(id);
      } else {
        await rejectOperator(id);
      }
      setOperators((prev) => prev.filter((op) => op.id !== id));
    } catch (err) {
      alert(err.message || 'No se pudo actualizar');
    } finally {
      setBusyId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-emerald-400/30 border-t-emerald-400"></div>
          <p className="text-sm text-slate-600">Cargando operadores...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white px-4 pb-16">
      <div className="max-w-5xl mx-auto pt-24">
        <div className="flex items-center justify-between mb-6">
          <div>
            <button
              onClick={() => navigate('/admin/dashboard')}
              className="inline-flex items-center gap-2 text-emerald-600 hover:text-emerald-700 transition mb-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Volver
            </button>
            <h1 className="text-3xl font-bold text-slate-900">Operadores pendientes</h1>
            <p className="text-slate-600">Aprueba o rechaza solicitudes</p>
          </div>
        </div>

        {error && (
          <div className="mb-4 rounded-xl bg-red-50 p-4 ring-1 ring-red-200 text-red-800">
            {error}
          </div>
        )}

        <div className="overflow-x-auto bg-white rounded-lg">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-white">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-700">Nombre</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-700">Email</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-700">Estado</th>
                <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-slate-700">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {operators.map((op) => (
                <tr key={op.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3 text-sm text-slate-900">{op.name} {op.last_name || ''}</td>
                  <td className="px-4 py-3 text-sm text-slate-600">{op.email}</td>
                  <td className="px-4 py-3 text-sm">
                    <span className="inline-flex rounded-full bg-slate-100 px-2 py-1 text-xs capitalize text-slate-700 ring-1 ring-slate-300">
                      {op.status || 'pending'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => handleAction(op.id, 'approve')}
                        disabled={busyId === op.id}
                        className="inline-flex items-center gap-1 rounded-full bg-emerald-500 px-3 py-1 text-xs font-semibold text-white hover:bg-emerald-600 disabled:opacity-60"
                      >
                        {busyId === op.id ? '...' : 'Aprobar'}
                      </button>
                      <button
                        onClick={() => handleAction(op.id, 'reject')}
                        disabled={busyId === op.id}
                        className="inline-flex items-center gap-1 rounded-full bg-red-500/80 px-3 py-1 text-xs font-semibold text-white hover:bg-red-600 disabled:opacity-60"
                      >
                        {busyId === op.id ? '...' : 'Rechazar'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {operators.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-4 py-6 text-center text-slate-600">No hay operadores pendientes</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
