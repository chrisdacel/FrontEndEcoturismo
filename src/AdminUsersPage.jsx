import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllUsers, deleteUser, updateUser } from './services/adminApi';

export default function AdminUsersPage() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filterRole, setFilterRole] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [busyId, setBusyId] = useState(null);
  const [roleChanges, setRoleChanges] = useState({});

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

  const handleRoleChange = (id, role) => {
    setRoleChanges((prev) => ({ ...prev, [id]: role }));
  };

  const saveRole = async (id) => {
    const newRole = roleChanges[id];
    if (!newRole) return;
    try {
      setBusyId(id);
      const { user } = await updateUser(id, { role: newRole });
      setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, role: user?.role || newRole } : u)));
    } catch (err) {
      alert(err.message || 'No se pudo actualizar el rol');
    } finally {
      setBusyId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-emerald-400/30 border-t-emerald-400"></div>
          <p className="text-sm text-slate-600">Cargando usuarios...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-slate-900 px-4 pb-16">
      <div className="max-w-6xl mx-auto pt-24">
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
            <h1 className="text-3xl font-bold text-slate-900">Usuarios</h1>
            <p className="text-slate-600">Gestiona todos los usuarios del sistema</p>
          </div>
          <button
            onClick={() => navigate('/admin/create-operator')}
            className="inline-flex items-center gap-2 rounded-full bg-emerald-500 px-4 py-2 font-semibold text-white shadow-sm hover:bg-emerald-600"
          >
            Crear usuario
          </button>
        </div>

        {error && (
          <div className="mb-4 rounded-lg bg-red-50 p-4 ring-1 ring-red-200 text-red-700">
            {error}
          </div>
        )}

        <div className="bg-white rounded-lg p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs text-slate-600 mb-1">Rol</label>
              <select
                value={filterRole}
                onChange={(e) => setFilterRole(e.target.value)}
                className="w-full rounded-lg bg-white px-3 py-2 text-slate-900 ring-1 ring-slate-300 focus:ring-2 focus:ring-emerald-400 outline-none [&>option]:text-slate-900 [&>option]:bg-white"
              >
                <option value="">Todos</option>
                <option value="admin">Admin</option>
                <option value="operator">Operador</option>
                <option value="user">Turista</option>
              </select>
            </div>
            <div>
              <label className="block text-xs text-slate-600 mb-1">Estado</label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full rounded-lg bg-white px-3 py-2 text-slate-900 ring-1 ring-slate-300 focus:ring-2 focus:ring-emerald-400 outline-none [&>option]:text-slate-900 [&>option]:bg-white"
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
                className="inline-flex items-center rounded-full border border-emerald-200 px-4 py-2 text-sm font-semibold text-slate-900 transition hover:border-emerald-400 hover:bg-emerald-50"
              >
                Limpiar
              </button>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto bg-white rounded-lg">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-white">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-700">Nombre</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-700">Email</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-700">Rol</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-700">Estado</th>
                <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-slate-700">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3 text-sm text-slate-900">{u.name} {u.last_name || ''}</td>
                  <td className="px-4 py-3 text-sm text-slate-600">{u.email}</td>
                  <td className="px-4 py-3 text-sm">
                    <div className="flex items-center gap-2">
                      <span className="inline-flex rounded-full bg-slate-100 px-2 py-1 text-xs capitalize text-slate-700 ring-1 ring-slate-300">
                        {u.role || 'user'}
                      </span>
                      <select
                        value={roleChanges[u.id] ?? u.role ?? 'user'}
                        onChange={(e) => handleRoleChange(u.id, e.target.value)}
                        className="rounded-full bg-white px-2 py-1 text-xs text-slate-900 ring-1 ring-slate-300 focus:ring-2 focus:ring-emerald-400 outline-none"
                      >
                        <option value="user">User</option>
                        <option value="operator">Operator</option>
                        <option value="admin">Admin</option>
                      </select>
                      <button
                        onClick={() => saveRole(u.id)}
                        disabled={busyId === u.id || (roleChanges[u.id] ?? u.role) === u.role}
                        className="inline-flex items-center rounded-full bg-emerald-500 px-3 py-1 text-xs font-semibold text-white shadow-sm hover:bg-emerald-600 disabled:opacity-50"
                      >
                        Guardar
                      </button>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <span className="inline-flex rounded-full bg-slate-100 px-2 py-1 text-xs capitalize text-slate-700 ring-1 ring-slate-300">
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
                  <td colSpan={5} className="px-4 py-6 text-center text-slate-600">Sin resultados</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
