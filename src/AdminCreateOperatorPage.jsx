import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createUser } from './services/adminApi';

export default function AdminCreateOperatorPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});

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

  const calculateAge = (dateString) => {
    if (!dateString) return null;
    const birthDate = new Date(dateString);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const validatePassword = (pwd) => {
    if (!pwd) return '';
    if (pwd.length < 8 || pwd.length > 64) return 'La contraseña debe tener entre 8 y 64 caracteres';
    if (!/[A-Z]/.test(pwd)) return 'La contraseña debe incluir al menos una letra mayúscula';
    if (!/[a-z]/.test(pwd)) return 'La contraseña debe incluir al menos una letra minúscula';
    if (!/[0-9]/.test(pwd)) return 'La contraseña debe incluir al menos un dígito';
    if (!/^[A-Za-z0-9@?#$%()_=*\\:;'.\/\+<>¿,\[\]]+$/.test(pwd)) return 'La contraseña contiene caracteres no permitidos';
    return '';
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setError('');
    setFieldErrors((prev) => ({ ...prev, [name]: '' }));

    // Validaciones en tiempo real
    if (name === 'password') {
      setFieldErrors((prev) => ({ ...prev, password: validatePassword(value) }));
    }
    if (name === 'confirmPassword') {
      setFieldErrors((prev) => ({ ...prev, confirmPassword: value !== formData.password ? 'Las contraseñas no coinciden' : '' }));
    }
    if (name === 'birth_date') {
      const age = calculateAge(value);
      setFieldErrors((prev) => ({ ...prev, birth_date: age !== null && age < 16 ? 'Debes ser mayor de 16 años para registrarte' : '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');


    // Validaciones completas
    const newFieldErrors = {};
    if (!formData.name.trim()) newFieldErrors.name = 'El nombre es obligatorio';
    if (!formData.email.trim()) newFieldErrors.email = 'El correo es obligatorio';
    if (!formData.password) newFieldErrors.password = 'La contraseña es obligatoria';
    else {
      const pwdErr = validatePassword(formData.password);
      if (pwdErr) newFieldErrors.password = pwdErr;
    }
    if (formData.password !== formData.confirmPassword) newFieldErrors.confirmPassword = 'Las contraseñas no coinciden';
    if (formData.birth_date) {
      const age = calculateAge(formData.birth_date);
      if (age !== null && age < 16) newFieldErrors.birth_date = 'Debes ser mayor de 16 años para registrarte';
    }
    setFieldErrors(newFieldErrors);
    if (Object.keys(newFieldErrors).length > 0) return;

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
    <div className="min-h-screen bg-white overflow-x-hidden">
      <section className="relative pt-24 pb-16 px-4">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <button
              onClick={() => navigate('/admin/dashboard')}
              className="inline-flex items-center gap-2 text-emerald-600 hover:text-emerald-700 transition mb-4"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Volver al dashboard
            </button>
            <h1 className="text-4xl font-bold text-slate-900 mb-2">Crear Usuario</h1>
            <p className="text-slate-600">
              Crea credenciales para un nuevo operador o administrador
            </p>
          </div>

          {/* Success Message */}
          {success && (
            <div className="mb-6 rounded-xl bg-green-50 p-4 ring-1 ring-green-200">
              <div className="flex items-center gap-3">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-green-800">Usuario creado exitosamente. Redirigiendo...</p>
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mb-6 rounded-xl bg-red-50 p-4 ring-1 ring-red-200">
              <p className="text-red-800">{error}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="bg-white rounded-lg border border-emerald-100 shadow-sm shadow-emerald-100/50 p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Nombre */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Nombre *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border border-emerald-200 bg-white px-4 py-3 text-slate-900 focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 outline-none transition"
                  placeholder="Juan"
                />
                {fieldErrors.name && (
                  <p className="mt-1 text-xs text-red-500">{fieldErrors.name}</p>
                )}
              </div>

              {/* Apellido */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Apellido
                </label>
                <input
                  type="text"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-emerald-200 bg-white px-4 py-3 text-slate-900 focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 outline-none transition"
                  placeholder="Pérez"
                />
              </div>

              {/* Email */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Correo Electrónico *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border border-emerald-200 bg-white px-4 py-3 text-slate-900 focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 outline-none transition"
                  placeholder="correo@ejemplo.com"
                />
                {fieldErrors.email && (
                  <p className="mt-1 text-xs text-red-500">{fieldErrors.email}</p>
                )}
              </div>

              {/* Rol */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Rol *
                </label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border border-emerald-200 bg-white px-4 py-3 text-slate-900 focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 outline-none transition"
                >
                  <option value="operator">Operador</option>
                  <option value="admin">Administrador</option>
                  <option value="user">Usuario/Turista</option>
                </select>
              </div>

              {/* Contraseña */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Contraseña *
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  minLength={8}
                  maxLength={64}
                  className="w-full rounded-lg border border-emerald-200 bg-white px-4 py-3 text-slate-900 focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 outline-none transition"
                  placeholder="8-64 caracteres"
                />
                {fieldErrors.password && (
                  <p className="mt-1 text-xs text-red-500">{fieldErrors.password}</p>
                )}
              </div>

              {/* Confirmar Contraseña */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Confirmar Contraseña *
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  minLength={8}
                  maxLength={64}
                  className="w-full rounded-lg border border-emerald-200 bg-white px-4 py-3 text-slate-900 focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 outline-none transition"
                  placeholder="Repite la contraseña"
                />
                {fieldErrors.confirmPassword && (
                  <p className="mt-1 text-xs text-red-500">{fieldErrors.confirmPassword}</p>
                )}
              </div>

              {/* País */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  País
                </label>
                <input
                  type="text"
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-emerald-200 bg-white px-4 py-3 text-slate-900 focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 outline-none transition"
                  placeholder="Colombia"
                />
              </div>

              {/* Fecha de Nacimiento */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Fecha de Nacimiento
                </label>
                <input
                  type="date"
                  name="birth_date"
                  value={formData.birth_date}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-emerald-200 bg-white px-4 py-3 text-slate-900 focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 outline-none transition"
                />
                {fieldErrors.birth_date && (
                  <p className="mt-1 text-xs text-red-500">{fieldErrors.birth_date}</p>
                )}
              </div>
            </div>

            {/* Botones */}
            <div className="flex items-center justify-end gap-4 mt-8">
              <button
                type="button"
                onClick={() => navigate('/admin/dashboard')}
                className="rounded-full px-6 py-3 text-slate-700 hover:bg-slate-100 border border-emerald-200 transition"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={loading || Object.values(fieldErrors).some(Boolean)}
                className="inline-flex items-center gap-2 rounded-full bg-emerald-500 px-6 py-3 font-semibold text-white hover:bg-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                {loading ? (
                  <>
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white"></div>
                    Creando...
                  </>
                ) : (
                  'Crear Usuario'
                )}
              </button>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
}
