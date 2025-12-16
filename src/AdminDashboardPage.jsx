import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { getAdminDashboard } from './services/adminApi';

export default function AdminDashboardPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      setLoading(true);
      const data = await getAdminDashboard();
      setStats(data);
    } catch (err) {
      setError(err.message || 'Error cargando dashboard');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-[#0b2f2a] via-[#0f3f38] to-[#0b2f2a]">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-emerald-400/30 border-t-emerald-400"></div>
          <p className="text-sm text-emerald-100/70">Cargando dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-[#0b2f2a] via-[#0f3f38] to-[#0b2f2a] px-4">
        <div className="text-center">
          <p className="text-red-400 mb-4">{error}</p>
          <button
            onClick={loadDashboard}
            className="rounded-full bg-emerald-500 px-6 py-2 text-white hover:bg-emerald-600"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0b2f2a] via-[#0f3f38] to-[#0b2f2a] text-white">
      {/* Hero Section */}
      <section className="relative pt-24 pb-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">
                Panel de Administración
              </h1>
              <p className="text-emerald-100/80">
                Bienvenido, {user?.name}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center rounded-full bg-emerald-500/20 px-3 py-1 text-sm font-medium text-emerald-300 ring-1 ring-emerald-500/30">
                <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
                Admin
              </span>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white/5 backdrop-blur rounded-2xl p-6 ring-1 ring-white/10 hover:ring-emerald-400/50 transition">
              <div className="flex items-center justify-between mb-4">
                <div className="rounded-full bg-blue-500/20 p-3">
                  <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
                <span className="text-3xl font-bold text-white">{stats?.total_users || 0}</span>
              </div>
              <h3 className="text-sm font-medium text-emerald-100/60">Total Usuarios</h3>
            </div>

            <div className="bg-white/5 backdrop-blur rounded-2xl p-6 ring-1 ring-white/10 hover:ring-emerald-400/50 transition">
              <div className="flex items-center justify-between mb-4">
                <div className="rounded-full bg-green-500/20 p-3">
                  <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <span className="text-3xl font-bold text-white">{stats?.total_turistas || 0}</span>
              </div>
              <h3 className="text-sm font-medium text-emerald-100/60">Turistas</h3>
            </div>

            <div className="bg-white/5 backdrop-blur rounded-2xl p-6 ring-1 ring-white/10 hover:ring-emerald-400/50 transition">
              <div className="flex items-center justify-between mb-4">
                <div className="rounded-full bg-purple-500/20 p-3">
                  <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <span className="text-3xl font-bold text-white">{stats?.total_operators || 0}</span>
              </div>
              <h3 className="text-sm font-medium text-emerald-100/60">Operadores</h3>
            </div>

            <div className="bg-white/5 backdrop-blur rounded-2xl p-6 ring-1 ring-white/10 hover:ring-emerald-400/50 transition">
              <div className="flex items-center justify-between mb-4">
                <div className="rounded-full bg-yellow-500/20 p-3">
                  <svg className="w-6 h-6 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <span className="text-3xl font-bold text-white">{stats?.pending_operators || 0}</span>
              </div>
              <h3 className="text-sm font-medium text-emerald-100/60">Pendientes</h3>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <button
              onClick={() => navigate('/admin/users')}
              className="group bg-white/5 backdrop-blur rounded-2xl p-6 ring-1 ring-white/10 hover:ring-emerald-400/50 transition text-left"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="rounded-full bg-emerald-500/20 p-3 group-hover:bg-emerald-500/30 transition">
                  <svg className="w-6 h-6 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
                <svg className="w-5 h-5 text-emerald-400 group-hover:translate-x-1 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Gestionar Usuarios</h3>
              <p className="text-sm text-emerald-100/60">Ver, editar y administrar todos los usuarios</p>
            </button>

            <button
              onClick={() => navigate('/admin/create-operator')}
              className="group bg-white/5 backdrop-blur rounded-2xl p-6 ring-1 ring-white/10 hover:ring-emerald-400/50 transition text-left"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="rounded-full bg-blue-500/20 p-3 group-hover:bg-blue-500/30 transition">
                  <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                  </svg>
                </div>
                <svg className="w-5 h-5 text-blue-400 group-hover:translate-x-1 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Crear Operador</h3>
              <p className="text-sm text-emerald-100/60">Crear credenciales para nuevo operador</p>
            </button>

            <button
              onClick={() => navigate('/admin/operators')}
              className="group bg-white/5 backdrop-blur rounded-2xl p-6 ring-1 ring-white/10 hover:ring-emerald-400/50 transition text-left"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="rounded-full bg-yellow-500/20 p-3 group-hover:bg-yellow-500/30 transition">
                  <svg className="w-6 h-6 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <svg className="w-5 h-5 text-yellow-400 group-hover:translate-x-1 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Aprobar Operadores</h3>
              <p className="text-sm text-emerald-100/60">Revisar solicitudes pendientes</p>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
