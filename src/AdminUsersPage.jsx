import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllUsers, deleteUser, updateUser } from './services/adminApi';
import Alert from './components/Alert';
import ConfirmDialog from './components/ConfirmDialog';

export default function AdminUsersPage() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [busyId, setBusyId] = useState(null);
  const [roleChanges, setRoleChanges] = useState({});
  const [roleMenuOpen, setRoleMenuOpen] = useState(false);
  const [roleRowMenuOpen, setRoleRowMenuOpen] = useState(null);
  const [statusMenuOpen, setStatusMenuOpen] = useState(false);
  const roleMenuRef = useRef(null);
  const statusMenuRef = useRef(null);
  const [confirmState, setConfirmState] = useState({ open: false });

  useEffect(() => {
    loadUsers();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (roleMenuRef.current && !roleMenuRef.current.contains(event.target)) {
        setRoleMenuOpen(false);
      }
      if (statusMenuRef.current && !statusMenuRef.current.contains(event.target)) {
        setStatusMenuOpen(false);
      }
      if (roleRowMenuOpen !== null) {
        const rowMenu = document.querySelector(`[data-role-menu-id="${roleRowMenuOpen}"]`);
        if (rowMenu && !rowMenu.contains(event.target)) {
          setRoleRowMenuOpen(null);
        }
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [roleRowMenuOpen]);

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
    setConfirmState({
      open: true,
      title: 'Eliminar usuario',
      message: '¿Eliminar este usuario? Esta accion no se puede deshacer.',
      confirmLabel: 'Eliminar',
      tone: 'danger',
      onConfirm: async () => {
        try {
          setBusyId(id);
          await deleteUser(id);
          setUsers((prev) => prev.filter((u) => u.id !== id));
          setError('');
        } catch (err) {
          setError(err.message || 'No se pudo eliminar');
        } finally {
          setBusyId(null);
          setConfirmState({ open: false });
        }
      },
    });
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
      setError('');
    } catch (err) {
      setError(err.message || 'No se pudo actualizar el rol');
    } finally {
      setBusyId(null);
    }
  };

  const roleLabels = {
    '': 'Todos los roles',
    admin: 'Admin',
    operator: 'Operador',
    user: 'Turista',
  };

  const statusLabels = {
    '': 'Todos los estados',
    active: 'Activo',
    pending: 'Pendiente',
    approved: 'Aprobado',
    rejected: 'Rechazado',
  };

  const roleOptions = [
    { value: '', label: 'Todos los roles' },
    { value: 'admin', label: 'Admin' },
    { value: 'operator', label: 'Operador' },
    { value: 'user', label: 'Turista' },
  ];

  const statusOptions = [
    { value: '', label: 'Todos los estados' },
    { value: 'active', label: 'Activo' },
    { value: 'pending', label: 'Pendiente' },
    { value: 'approved', label: 'Aprobado' },
    { value: 'rejected', label: 'Rechazado' },
  ];

  const filteredUsers = users.filter((u) => {
    const name = `${u.name || ''} ${u.last_name || ''}`.trim();
    const email = u.email || '';
    const searchValue = `${name} ${email}`.toLowerCase();
    const matchesSearch = searchValue.includes(searchTerm.trim().toLowerCase());
    return matchesSearch;
  });

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
    <div className="min-h-screen bg-white text-slate-900 px-4 pb-16 overflow-x-hidden">
      <div className="max-w-6xl mx-auto pt-24">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-6">
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
            <h1 className="text-3xl font-bold text-slate-900">Gestion de usuarios</h1>
            <p className="text-slate-600">Gestiona todos los usuarios del sistema</p>
          </div>
        </div>

        {error && (
          <Alert type="error" className="mb-4">
            {error}
          </Alert>
        )}

        <div className="bg-white rounded-lg p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="md:col-span-2">
              <div className="flex items-center gap-2 rounded-full border border-emerald-200 bg-white px-4 py-2">
                <svg className="h-4 w-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35m1.6-4.15a7.75 7.75 0 11-15.5 0 7.75 7.75 0 0115.5 0z" />
                </svg>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Buscar por nombre o email"
                  className="w-full bg-transparent text-sm text-slate-700 placeholder-slate-400 outline-none"
                />
              </div>
            </div>
            <div ref={roleMenuRef} className="relative">
              <button
                type="button"
                onClick={() => setRoleMenuOpen((prev) => !prev)}
                className="inline-flex w-full items-center justify-between gap-2 rounded-full bg-white px-4 py-2 text-sm text-slate-700 ring-1 ring-emerald-200 transition hover:bg-emerald-50"
              >
                <span>{roleLabels[filterRole] || 'Todos los roles'}</span>
                <svg
                  className={`h-4 w-4 transition-transform duration-200 ${roleMenuOpen ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {roleMenuOpen && (
                <div className="absolute left-0 right-0 mt-2 rounded-xl overflow-hidden bg-white text-slate-800 shadow-lg ring-1 ring-slate-200/60 dropdown-open z-20">
                  {roleOptions.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => {
                        setFilterRole(option.value);
                        setRoleMenuOpen(false);
                      }}
                      className="w-full px-4 py-2 text-left text-sm transition-colors hover:bg-slate-100 hover:text-emerald-500"
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <div ref={statusMenuRef} className="relative">
              <button
                type="button"
                onClick={() => setStatusMenuOpen((prev) => !prev)}
                className="inline-flex w-full items-center justify-between gap-2 rounded-full bg-white px-4 py-2 text-sm text-slate-700 ring-1 ring-emerald-200 transition hover:bg-emerald-50"
              >
                <span>{statusLabels[filterStatus] || 'Todos los estados'}</span>
                <svg
                  className={`h-4 w-4 transition-transform duration-200 ${statusMenuOpen ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {statusMenuOpen && (
                <div className="absolute left-0 right-0 mt-2 rounded-xl overflow-hidden bg-white text-slate-800 shadow-lg ring-1 ring-slate-200/60 dropdown-open z-20">
                  {statusOptions.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => {
                        setFilterStatus(option.value);
                        setStatusMenuOpen(false);
                      }}
                      className="w-full px-4 py-2 text-left text-sm transition-colors hover:bg-slate-100 hover:text-emerald-500"
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <div className="flex items-end">
              <button
                onClick={handleFilter}
                className="inline-flex items-center rounded-full bg-emerald-500 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-emerald-600"
              >
                Filtrar
              </button>
            </div>
          </div>
        </div>

        <div className="md:hidden space-y-3 mb-4">
          {filteredUsers.map((u) => (
            <div key={u.id} className="rounded-xl border border-slate-200 bg-white p-4">
              <p className="text-sm font-semibold text-slate-900">{u.name} {u.last_name || ''}</p>
              <p className="mt-1 text-xs text-slate-600">{u.email}</p>
              <div className="mt-2 flex flex-wrap gap-2 text-xs text-slate-600">
                <span>Estado: {statusLabels[u.status] || 'Activo'}</span>
                <span>Rol: {roleLabels[roleChanges[u.id] ?? u.role ?? 'user'] || 'Turista'}</span>
              </div>
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <div className="relative" data-role-menu-id={u.id}>
                  <button
                    type="button"
                    onClick={() => setRoleRowMenuOpen((prev) => (prev === u.id ? null : u.id))}
                    className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1.5 text-xs text-slate-700 ring-1 ring-emerald-200 transition hover:bg-emerald-50"
                  >
                    <span>{roleLabels[roleChanges[u.id] ?? u.role ?? 'user'] || 'Turista'}</span>
                    <svg
                      className={`h-3.5 w-3.5 transition-transform duration-200 ${roleRowMenuOpen === u.id ? 'rotate-180' : ''}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {roleRowMenuOpen === u.id && (
                    <div className="absolute left-0 mt-2 w-40 rounded-xl overflow-hidden bg-white text-slate-800 shadow-lg ring-1 ring-slate-200/60 dropdown-open z-20">
                      {roleOptions
                        .filter((option) => option.value)
                        .map((option) => (
                          <button
                            key={option.value}
                            type="button"
                            onClick={() => {
                              handleRoleChange(u.id, option.value);
                              setRoleRowMenuOpen(null);
                            }}
                            className="w-full px-4 py-2 text-left text-sm transition-colors hover:bg-slate-100 hover:text-emerald-500"
                          >
                            {option.label}
                          </button>
                        ))}
                    </div>
                  )}
                </div>
                <button
                  onClick={() => saveRole(u.id)}
                  disabled={!roleChanges[u.id] || busyId === u.id}
                  className="rounded-full bg-emerald-500 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-600 disabled:opacity-60"
                >
                  Guardar
                </button>
                <button
                  onClick={() => handleDelete(u.id)}
                  className="rounded-full bg-rose-500 px-3 py-1.5 text-xs font-semibold text-white hover:bg-rose-600"
                >
                  Eliminar
                </button>
              </div>
            </div>
          ))}
          {filteredUsers.length === 0 && (
            <div className="rounded-xl border border-slate-200 bg-white p-4 text-center text-sm text-slate-600">
              No hay usuarios para mostrar
            </div>
          )}
        </div>

        <div className="hidden md:block overflow-x-auto bg-white border-b border-slate-200">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-white">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-700">Nombre</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-700">Email</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-700">Estado</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-700">Rol</th>
                <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-slate-700">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredUsers.map((u) => (
                <tr key={u.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3 text-sm text-slate-900">{u.name} {u.last_name || ''}</td>
                  <td className="px-4 py-3 text-sm text-slate-600">{u.email}</td>
                  <td className="px-4 py-3 text-sm text-slate-700">
                    {statusLabels[u.status] || 'Activo'}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <div className="flex items-center gap-2">
                      <div className="relative" data-role-menu-id={u.id}>
                        <button
                          type="button"
                          onClick={() =>
                            setRoleRowMenuOpen((prev) => (prev === u.id ? null : u.id))
                          }
                          className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-xs text-slate-700 ring-1 ring-emerald-200 transition hover:bg-emerald-50"
                        >
                          <span>{roleLabels[roleChanges[u.id] ?? u.role ?? 'user'] || 'Turista'}</span>
                          <svg
                            className={`h-3.5 w-3.5 transition-transform duration-200 ${
                              roleRowMenuOpen === u.id ? 'rotate-180' : ''
                            }`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </button>
                        {roleRowMenuOpen === u.id && (
                          <div className="absolute left-0 mt-2 w-40 rounded-xl overflow-hidden bg-white text-slate-800 shadow-lg ring-1 ring-slate-200/60 dropdown-open z-20">
                            {roleOptions
                              .filter((option) => option.value)
                              .map((option) => (
                                <button
                                  key={option.value}
                                  type="button"
                                  onClick={() => {
                                    handleRoleChange(u.id, option.value);
                                    setRoleRowMenuOpen(null);
                                  }}
                                  className="w-full px-4 py-2 text-left text-sm transition-colors hover:bg-slate-100 hover:text-emerald-500"
                                >
                                  {option.label}
                                </button>
                              ))}
                          </div>
                        )}
                      </div>
                      <button
                        onClick={() => saveRole(u.id)}
                        disabled={busyId === u.id || (roleChanges[u.id] ?? u.role) === u.role}
                        className="inline-flex items-center rounded-full bg-emerald-500 px-3 py-1 text-xs font-semibold text-white shadow-sm hover:bg-emerald-600 disabled:opacity-50"
                      >
                        Guardar
                      </button>
                    </div>
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
              {filteredUsers.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-6 text-center text-slate-600">Sin resultados</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      <ConfirmDialog
        open={confirmState.open}
        title={confirmState.title}
        message={confirmState.message}
        confirmLabel={confirmState.confirmLabel}
        tone={confirmState.tone}
        onClose={() => setConfirmState({ open: false })}
        onConfirm={confirmState.onConfirm}
      />
    </div>
  );
}
