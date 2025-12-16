import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { initializeCsrfToken, resetPassword } from './services/api';

export default function ResetPasswordPage({ onNavigateLogin }) {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') || '';
  const emailFromUrl = searchParams.get('email') || '';

  const [email, setEmail] = useState(emailFromUrl);
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    initializeCsrfToken();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!token) {
      setError('Falta el token de recuperación. Usa el enlace del correo.');
      return;
    }
    if (password.length < 8) {
      setError('La contraseña debe tener mínimo 8 caracteres');
      return;
    }
    if (password !== password2) {
      setError('Las contraseñas no coinciden');
      return;
    }

    setLoading(true);
    try {
      const msg = await resetPassword(token, email, password, password2);
      setSuccess(msg || 'Contraseña restablecida');
      setPassword('');
      setPassword2('');
    } catch (err) {
      const msg = err?.message || err?.error || 'No se pudo restablecer la contraseña';
      setError(typeof msg === 'string' ? msg : 'No se pudo restablecer la contraseña');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-[#0b2f2a] via-[#0f3f38] to-[#0b2f2a] text-white">
      <div className="mx-auto flex min-h-screen max-w-7xl items-center px-6 py-12 md:px-10">
        <div className="hidden flex-1 md:flex md:flex-col md:pr-10">
          <span className="text-emerald-300/80 text-xs tracking-[0.4em]">ECOTURISMO</span>
          <h1 className="mt-6 text-5xl leading-tight font-semibold">Crea una nueva contraseña segura.</h1>
          <p className="mt-4 max-w-xl text-emerald-100/80">
            Usa el enlace que enviamos a tu correo (Mailtrap), copia el token y restablece tu acceso.
          </p>
        </div>

        <div className="w-full md:w-[420px]">
          <div className="rounded-lg bg-white/10 backdrop-blur-md ring-1 ring-white/10 p-6 md:p-8 shadow-xl">
            <div className="mb-6">
              <h2 className="text-2xl font-semibold">Restablecer contraseña</h2>
              <p className="mt-1 text-sm text-emerald-100/80">Completa los datos y crea tu nueva clave</p>
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

              <div>
                <label className="block text-sm font-medium text-emerald-100">Nueva contraseña</label>
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

              <button
                type="submit"
                disabled={loading}
                className="mt-2 inline-flex w-full items-center justify-center rounded-lg bg-emerald-500 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-300 disabled:opacity-60"
              >
                {loading ? 'Guardando…' : 'Restablecer contraseña'}
              </button>

              <p className="text-center text-sm text-emerald-100/80">
                ¿Ya la cambiaste?{' '}
                <button type="button" onClick={onNavigateLogin} className="underline underline-offset-4 hover:text-emerald-100">Inicia sesión</button>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
