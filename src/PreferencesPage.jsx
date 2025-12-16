import { useEffect, useState } from 'react';
import { useAuth } from './context/AuthContext';
import { fetchPreferencesOptions, fetchUserPreferences, updateUserPreferences } from './services/api';

// Mapeo de íconos para preferencias
const preferenceIcons = {
  'hiking': '🥾',
  'birdwatching': '🦅',
  'biking': '🚴',
  'climbing': '🧗',
  'wildlife': '🐢',
  'reserves': '🏞️',
  'kayaking': '🛶',
  'forest_bathing': '🌲',
};

export default function PreferencesPage({ onNavigateHome, onNavigateLogin, isFirstTime = false }) {
  const { user, loading: authLoading } = useAuth();
  const [options, setOptions] = useState([]);
  const [selected, setSelected] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        setError('');
        const [opts, mine] = await Promise.all([
          fetchPreferencesOptions(),
          fetchUserPreferences(),
        ]);
        setOptions(opts);
        setSelected(mine.map((p) => p.id));
      } catch (e) {
        const msg = e?.message || 'No se pudieron cargar las preferencias';
        setError(msg);
      } finally {
        setLoading(false);
      }
    }
    if (!authLoading && user) load();
  }, [authLoading, user]);

  const toggle = (id) => {
    setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError('');
      setSuccess('');
      await updateUserPreferences(selected);
      setSuccess('Preferencias guardadas');
      setTimeout(() => {
        if (isFirstTime) {
          onNavigateHome();
        }
      }, 800);
    } catch (e) {
      const msg = e?.message || 'No se pudieron guardar las preferencias';
      setError(msg);
    } finally {
      setSaving(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen grid place-items-center bg-gradient-to-b from-[#0b2f2a] via-[#0f3f38] to-[#0b2f2a] text-white">
        <p className="text-emerald-100">Cargando…</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen grid place-items-center bg-gradient-to-b from-[#0b2f2a] via-[#0f3f38] to-[#0b2f2a] text-white px-6">
        <div className="rounded-2xl bg-white/10 ring-1 ring-white/10 p-8 text-center">
          <p className="mb-4">Debes iniciar sesión para configurar tus preferencias.</p>
          <button onClick={onNavigateLogin} className="rounded-lg bg-emerald-500 px-4 py-2 text-sm font-semibold hover:bg-emerald-600">Iniciar sesión</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-[#0b2f2a] via-[#0f3f38] to-[#0b2f2a] text-white">
      <div className="mx-auto max-w-6xl px-6 py-10 md:py-14">
        <div className="mb-8">
          <span className="text-emerald-300/80 text-xs tracking-[0.3em]">PREFERENCIAS</span>
          <h1 className="mt-3 text-3xl md:text-4xl font-semibold">
            {isFirstTime ? 'Tú decides el camino, elige una opción.' : 'Personaliza tu experiencia'}
          </h1>
          <p className="mt-2 text-emerald-100/80">
            {isFirstTime ? 'Selecciona las actividades que más te interesan para recibir recomendaciones personalizadas.' : 'Elige los temas que más te interesan para recomendarte destinos.'}
          </p>
        </div>

        {error && (
          <div className="mb-4 rounded-lg border border-red-400/30 bg-red-500/10 px-3 py-2 text-sm text-red-100">{error}</div>
        )}
        {success && (
          <div className="mb-4 rounded-lg border border-emerald-400/30 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-100">{success}</div>
        )}

        {loading ? (
          <div className="rounded-2xl bg-white/10 ring-1 ring-white/10 p-8">Cargando opciones…</div>
        ) : (
          <div className="rounded-2xl bg-white/10 ring-1 ring-white/10 p-6 md:p-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {options.map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => toggle(opt.id)}
                  className={`flex flex-col items-center justify-center text-center rounded-xl p-4 ring-1 transition min-h-[140px] ${
                    selected.includes(opt.id)
                      ? 'bg-emerald-500/20 text-white ring-emerald-400/40'
                      : 'bg-white/10 text-emerald-100 ring-white/10 hover:bg-white/20'
                  }`}
                >
                  <span className="text-3xl mb-2">{preferenceIcons[opt.image] || '🌍'}</span>
                  <span className="block text-xs font-medium leading-tight">{opt.name}</span>
                </button>
              ))}
            </div>

            <div className="mt-8 flex gap-3 justify-end">
              {!isFirstTime && (
                <button
                  onClick={onNavigateHome}
                  className="rounded-lg bg-white/10 px-4 py-2.5 text-sm font-semibold text-emerald-100 ring-1 ring-white/10 hover:bg-white/20"
                >
                  Cancelar
                </button>
              )}
              <button
                onClick={handleSave}
                disabled={saving}
                className="rounded-lg bg-emerald-500 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-300 disabled:opacity-60"
              >
                {saving ? 'Guardando…' : 'Siguiente'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
