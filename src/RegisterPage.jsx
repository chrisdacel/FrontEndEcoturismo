import { useState } from 'react';
import { useAuth } from './context/AuthContext';
import { register as apiRegister } from './services/api';

export default function RegisterPage({ onNavigateHome, onNavigateLogin, onNavigatePreferences, onNavigateConfirm }) {
  const { setUser } = useAuth();
  const role = 'turist'; // Registro solo turista
  const [name, setName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [country, setCountry] = useState('');
  const [birthDate, setBirthDate] = useState(''); // YYYY-MM-DD
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (password.length < 8) {
      setError('La contraseña debe tener mínimo 8 caracteres');
      return;
    }
    if (password !== password2) {
      setError('Las contraseñas no coinciden');
      return;
    }

    try {
      setLoading(true);
      const user = await apiRegister(
        name.trim(),
        email.trim(),
        password,
        role,
        lastName.trim() || null,
        country.trim() || null,
        birthDate || null
      );
      setUser(user);
      setSuccess('Registro exitoso. Te enviamos un correo para confirmar la cuenta.');
      setName('');
      setLastName('');
      setEmail('');
      setCountry('');
      setBirthDate('');
      setPassword('');
      setPassword2('');
      // Redirigir a confirmar cuenta
      setTimeout(() => {
        if (onNavigateConfirm) {
          onNavigateConfirm();
        } else if (onNavigateHome) {
          onNavigateHome();
        }
      }, 600);
    } catch (err) {
      const msg = err?.message || err?.error || 'No se pudo registrar';
      setError(typeof msg === 'string' ? msg : 'Error en el registro');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-[#0b2f2a] via-[#0f3f38] to-[#0b2f2a] text-white">
      <div className="mx-auto flex min-h-screen max-w-7xl items-center px-6 py-12 md:px-10">
        {/* Intro izquierda */}
        <div className="hidden flex-1 md:flex md:flex-col md:pr-10">
          <span className="text-emerald-300/80 text-xs tracking-[0.4em]">ECOTURISMO</span>
          <h1 className="mt-6 text-5xl leading-tight font-semibold">
            Crea tu cuenta para explorar experiencias responsables.
          </h1>
          <p className="mt-4 max-w-xl text-emerald-100/80">
            Elige tu rol para disfrutar de contenido personalizado: como Turista descubre destinos; como Operador, publica y gestiona tus sitios.
          </p>
        </div>

        {/* Formulario derecha */}
        <div className="w-full md:w-[520px]">
          <div className="rounded-lg bg-white/10 backdrop-blur-md ring-1 ring-white/10 p-6 md:p-8 shadow-xl">
            <div className="mb-6">
              <h2 className="text-2xl font-semibold">Crear cuenta</h2>
              <p className="mt-1 text-sm text-emerald-100/80">Completa tus datos para comenzar</p>
            </div>

            {/* Registro turista (único) */}
            <div className="mb-5">
              <span className="inline-flex items-center rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-medium text-emerald-200 ring-1 ring-emerald-400/30">
                Registro de Turista
              </span>
            </div>

            {error && (
              <div className="mb-4 rounded-lg border border-red-400/30 bg-red-500/10 px-3 py-2 text-sm text-red-100">
                {error}
              </div>
            )}
            {success && (
              <div className="mb-4 rounded-lg border border-emerald-400/30 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-100">
                {success}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-emerald-100">Nombre</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="mt-1 w-full rounded-lg border border-white/10 bg-white/10 px-3 py-2 text-white placeholder:text-emerald-100/60 outline-none focus:ring-2 focus:ring-emerald-400/60"
                    placeholder="Tu nombre"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-emerald-100">Apellido (opcional)</label>
                  <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="mt-1 w-full rounded-lg border border-white/10 bg-white/10 px-3 py-2 text-white placeholder:text-emerald-100/60 outline-none focus:ring-2 focus:ring-emerald-400/60"
                    placeholder="Tu apellido"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-emerald-100">Correo electrónico</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="mt-1 w-full rounded-lg border border-white/10 bg-white/10 px-3 py-2 text-white placeholder:text-emerald-100/60 outline-none focus:ring-2 focus:ring-emerald-400/60"
                  placeholder="tu@correo.com"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-emerald-100">País</label>
                  <input
                    type="text"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    required
                    className="mt-1 w-full rounded-lg border border-white/10 bg-white/10 px-3 py-2 text-white placeholder:text-emerald-100/60 outline-none focus:ring-2 focus:ring-emerald-400/60"
                    placeholder="Colombia"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-emerald-100">Fecha de nacimiento</label>
                  <input
                    type="date"
                    value={birthDate}
                    onChange={(e) => setBirthDate(e.target.value)}
                    required
                    className="mt-1 w-full rounded-lg border border-white/10 bg-white/10 px-3 py-2 text-white placeholder:text-emerald-100/60 outline-none focus:ring-2 focus:ring-emerald-400/60"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-emerald-100">Contraseña</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={8}
                    className="mt-1 w-full rounded-lg border border-white/10 bg-white/10 px-3 py-2 text-white placeholder:text-emerald-100/60 outline-none focus:ring-2 focus:ring-emerald-400/60"
                    placeholder="Mínimo 8 caracteres"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-emerald-100">Confirmar contraseña</label>
                  <input
                    type="password"
                    value={password2}
                    onChange={(e) => setPassword2(e.target.value)}
                    required
                    minLength={8}
                    className="mt-1 w-full rounded-lg border border-white/10 bg-white/10 px-3 py-2 text-white placeholder:text-emerald-100/60 outline-none focus:ring-2 focus:ring-emerald-400/60"
                    placeholder="Repite tu contraseña"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="mt-2 inline-flex w-full items-center justify-center rounded-lg bg-emerald-500 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-300 disabled:opacity-60"
              >
                {loading ? 'Creando cuenta…' : 'Crear cuenta'}
              </button>

              <p className="text-center text-xs text-emerald-100/70">
                ¿Ya tienes cuenta?{' '}
                <button type="button" onClick={onNavigateLogin} className="underline underline-offset-4 hover:text-emerald-100">Inicia sesión</button>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
