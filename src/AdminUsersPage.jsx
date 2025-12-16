import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllUsers, deleteUser } from './services/adminApi';

export default function AdminUsersPage() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filterRole, setFilterRole] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [busyId, setBusyId] = useState(null);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async (filters = {}) => {
    try {
      setLoading(true);
      const data = await getAllUsers(filters);
      setUsers(data);
      setError('');
    } catch (err) {
      setError(err.message || 'Error cargando usuarios');
    } finally {
      setLoading(false);
    }
  };

  const handleFilter = () => {
    const params = {};
    if (filterRole) params.role = filterRole;
    if (filterStatus) params.status = filterStatus;
    loadUsers(params);
  };

  const handleDelete = async (id) => {
    const confirm = window.confirm('¿Eliminar este usuario?');
    if (!confirm) return;
    try {
      setBusyId(id);
      await deleteUser(id);
      setUsers((prev) => prev.filter((u) => u.id !== id));
    } catch (err) {
      alert(err.message || 'No se pudo eliminar');
    } finally {
      setBusyId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-[#0b2f2a] via-[#0f3f38] to-[#0b2f2a]">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-emerald-400/30 border-t-emerald-400"></div>
          <p className="text-sm text-emerald-100/70">Cargando usuarios...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0b2f2a] via-[#0f3f38] to-[#0b2f2a] text-white px-4 pb-16">
      <div className="max-w-6xl mx-auto pt-24">
        <div className="flex items-center justify-between mb-6">
          <div>
            <button
              onClick={() => navigate('/admin/dashboard')}
              className="inline-flex items-center gap-2 text-emerald-300 hover:text-emerald-200 transition mb-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Volver
            </button>
            <h1 className="text-3xl font-bold">Usuarios</h1>
            <p className="text-emerald-100/70">Gestiona todos los usuarios del sistema</p>
          </div>
          <button
            onClick={() => navigate('/admin/create-operator')}
            className="inline-flex items-center gap-2 rounded-full bg-emerald-500 px-4 py-2 font-semibold text-white shadow-sm hover:bg-emerald-600"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Crear usuario
          </button>
        </div>

        {error && (
          <div className="mb-4 rounded-xl bg-red-500/20 p-4 ring-1 ring-red-500/30 text-red-100">
            {error}
          </div>
        )}

        <div className="bg-white/5 backdrop-blur rounded-2xl p-4 ring-1 ring-white/10 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs text-emerald-100/70 mb-1">Rol</label>
              <select
                value={filterRole}
                onChange={(e) => setFilterRole(e.target.value)}
                className="w-full rounded-lg bg-white/10 px-3 py-2 text-white ring-1 ring-white/20 focus:ring-2 focus:ring-emerald-400 outline-none"
              >
                <option value="">Todos</option>
                <option value="admin">Admin</option>
                <option value="operator">Operador</option>
                <option value="user">Turista</option>
              </select>
            </div>
            <div>
              <label className="block text-xs text-emerald-100/70 mb-1">Estado</label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full rounded-lg bg-white/10 px-3 py-2 text-white ring-1 ring-white/20 focus:ring-2 focus:ring-emerald-400 outline-none"
              >
                <option value="">Todos</option>
                <option value="active">Activo</option>
                <option value="pending">Pendiente</option>
                <option value="approved">Aprobado</option>
                <option value="rejected">Rechazado</option>
              </select>
            </div>
            <div className="flex items-end">
              <button
                onClick={handleFilter}
                className="inline-flex items-center rounded-full bg-emerald-500 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-emerald-600"
              >
                Filtrar
              </button>
            </div>
            <div className="flex items-end">
              <button
                onClick={() => { setFilterRole(''); setFilterStatus(''); loadUsers(); }}
                className="inline-flex items-center rounded-full px-4 py-2 text-sm font-semibold text-emerald-100 hover:bg-white/10"
              >
                Limpiar
              </button>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto bg-white/5 backdrop-blur rounded-2xl ring-1 ring-white/10">
          <table className="min-w-full divide-y divide-white/10">
            <thead className="bg-white/5">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-emerald-100/70">Nombre</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-emerald-100/70">Email</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-emerald-100/70">Rol</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-emerald-100/70">Estado</th>
                <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-emerald-100/70">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-white/5">
                  <td className="px-4 py-3 text-sm text-white">{u.name} {u.last_name || ''}</td>
                  <td className="px-4 py-3 text-sm text-emerald-100/80">{u.email}</td>
                  <td className="px-4 py-3 text-sm">
                    <span className="inline-flex rounded-full bg-white/10 px-2 py-1 text-xs capitalize text-emerald-100/80 ring-1 ring-white/10">
                      {u.role || 'user'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <span className="inline-flex rounded-full bg-white/10 px-2 py-1 text-xs capitalize text-emerald-100/80 ring-1 ring-white/10">
                      {u.status || 'active'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-right">
                    <button
                      onClick={() => handleDelete(u.id)}
                      disabled={busyId === u.id}
                      className="inline-flex items-center gap-1 rounded-full bg-red-500/80 px-3 py-1 text-xs font-semibold text-white hover:bg-red-600 disabled:opacity-60"
                    >
                      {busyId === u.id ? 'Eliminando...' : 'Eliminar'}
                    </button>
                  </td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-6 text-center text-emerald-100/70">Sin resultados</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
