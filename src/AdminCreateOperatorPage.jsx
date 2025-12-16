import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createUser } from './services/adminApi';

export default function AdminCreateOperatorPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    last_name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'operator',
    country: '',
    birth_date: '',
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validaciones
    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    if (formData.password.length < 8) {
      setError('La contraseña debe tener al menos 8 caracteres');
      return;
    }

    try {
      setLoading(true);
      await createUser({
        name: formData.name,
        last_name: formData.last_name,
        email: formData.email,
        password: formData.password,
        role: formData.role,
        country: formData.country || null,
        birth_date: formData.birth_date || null,
      });

      setSuccess(true);
      setTimeout(() => {
        navigate('/admin/users');
      }, 2000);
    } catch (err) {
      setError(err.message || 'Error creando usuario');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0b2f2a] via-[#0f3f38] to-[#0b2f2a] text-white">
      <section className="relative pt-24 pb-16 px-4">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <button
              onClick={() => navigate('/admin/dashboard')}
              className="inline-flex items-center gap-2 text-emerald-300 hover:text-emerald-200 transition mb-4"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Volver al dashboard
            </button>
            <h1 className="text-4xl font-bold text-white mb-2">Crear Usuario</h1>
            <p className="text-emerald-100/80">
              Crea credenciales para un nuevo operador o administrador
            </p>
          </div>

          {/* Success Message */}
          {success && (
            <div className="mb-6 rounded-xl bg-green-500/20 p-4 ring-1 ring-green-500/30">
              <div className="flex items-center gap-3">
                <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-green-100">Usuario creado exitosamente. Redirigiendo...</p>
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mb-6 rounded-xl bg-red-500/20 p-4 ring-1 ring-red-500/30">
              <p className="text-red-100">{error}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="bg-white/5 backdrop-blur rounded-2xl p-8 ring-1 ring-white/10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Nombre */}
              <div>
                <label className="block text-sm font-medium text-emerald-100/80 mb-2">
                  Nombre *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg bg-white/10 px-4 py-3 text-white ring-1 ring-white/20 focus:ring-2 focus:ring-emerald-400 outline-none transition"
                  placeholder="Juan"
                />
              </div>

              {/* Apellido */}
              <div>
                <label className="block text-sm font-medium text-emerald-100/80 mb-2">
                  Apellido
                </label>
                <input
                  type="text"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleChange}
                  className="w-full rounded-lg bg-white/10 px-4 py-3 text-white ring-1 ring-white/20 focus:ring-2 focus:ring-emerald-400 outline-none transition"
                  placeholder="Pérez"
                />
              </div>

              {/* Email */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-emerald-100/80 mb-2">
                  Correo Electrónico *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg bg-white/10 px-4 py-3 text-white ring-1 ring-white/20 focus:ring-2 focus:ring-emerald-400 outline-none transition"
                  placeholder="correo@ejemplo.com"
                />
              </div>

              {/* Rol */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-emerald-100/80 mb-2">
                  Rol *
                </label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg bg-white/10 px-4 py-3 text-white ring-1 ring-white/20 focus:ring-2 focus:ring-emerald-400 outline-none transition"
                >
                  <option value="operator">Operador</option>
                  <option value="admin">Administrador</option>
                  <option value="user">Usuario/Turista</option>
                </select>
              </div>

              {/* Contraseña */}
              <div>
                <label className="block text-sm font-medium text-emerald-100/80 mb-2">
                  Contraseña *
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  minLength={8}
                  className="w-full rounded-lg bg-white/10 px-4 py-3 text-white ring-1 ring-white/20 focus:ring-2 focus:ring-emerald-400 outline-none transition"
                  placeholder="Mínimo 8 caracteres"
                />
              </div>

              {/* Confirmar Contraseña */}
              <div>
                <label className="block text-sm font-medium text-emerald-100/80 mb-2">
                  Confirmar Contraseña *
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg bg-white/10 px-4 py-3 text-white ring-1 ring-white/20 focus:ring-2 focus:ring-emerald-400 outline-none transition"
                  placeholder="Repite la contraseña"
                />
              </div>

              {/* País */}
              <div>
                <label className="block text-sm font-medium text-emerald-100/80 mb-2">
                  País
                </label>
                <input
                  type="text"
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  className="w-full rounded-lg bg-white/10 px-4 py-3 text-white ring-1 ring-white/20 focus:ring-2 focus:ring-emerald-400 outline-none transition"
                  placeholder="Colombia"
                />
              </div>

              {/* Fecha de Nacimiento */}
              <div>
                <label className="block text-sm font-medium text-emerald-100/80 mb-2">
                  Fecha de Nacimiento
                </label>
                <input
                  type="date"
                  name="birth_date"
                  value={formData.birth_date}
                  onChange={handleChange}
                  className="w-full rounded-lg bg-white/10 px-4 py-3 text-white ring-1 ring-white/20 focus:ring-2 focus:ring-emerald-400 outline-none transition"
                />
              </div>
            </div>

            {/* Botones */}
            <div className="flex items-center justify-end gap-4 mt-8">
              <button
                type="button"
                onClick={() => navigate('/admin/dashboard')}
                className="rounded-full px-6 py-3 text-emerald-100 hover:bg-white/10 transition"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center gap-2 rounded-full bg-emerald-500 px-6 py-3 font-semibold text-white hover:bg-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                {loading ? (
                  <>
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white"></div>
                    Creando...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Crear Usuario
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
}
