import { useEffect, useState } from 'react';
import { createAdminPreference, deleteAdminPreference, getAdminPreferences, updateAdminPreference } from './services/adminApi';

const defaultForm = { name: '', color: '' };

export default function AdminLabelsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [labels, setLabels] = useState([]);
  const [form, setForm] = useState(defaultForm);
  const [editingId, setEditingId] = useState(null);

  const load = async () => {
    try {
      setLoading(true);
      const data = await getAdminPreferences();
      setLabels(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err?.message || 'Error cargando etiquetas');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const resetForm = () => {
    setForm(defaultForm);
    setEditingId(null);
  };

  const normalizeColor = (value) => {
    if (!value) return '';
    return value.startsWith('#') ? value : `#${value}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!form.name || !form.color) {
      setError('Completa nombre y color');
      return;
    }

    const payload = {
      name: form.name.trim(),
      image: '',
      color: normalizeColor(form.color.trim()).replace('#', ''),
    };

    try {
      setSaving(true);
      if (editingId) {
        await updateAdminPreference(editingId, payload);
        setSuccess('Etiqueta actualizada');
      } else {
        await createAdminPreference(payload);
        setSuccess('Etiqueta creada');
      }
      resetForm();
      await load();
    } catch (err) {
      setError(err?.message || 'Error guardando etiqueta');
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (label) => {
    setEditingId(label.id);
    setForm({ name: label.name || '', color: label.color || '' });
    setSuccess('');
    setError('');
  };

  const handleDelete = async (id) => {
    if (!confirm('¿Eliminar esta etiqueta?')) return;
    try {
      await deleteAdminPreference(id);
      setLabels((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      setError(err?.message || 'Error eliminando etiqueta');
    }
  };

  return (
    <div className="min-h-screen bg-white text-slate-900">
      <section className="relative pt-24 pb-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold">Gestionar etiquetas</h1>
            <p className="text-slate-600">Crea, edita o elimina etiquetas para clasificar los sitios.</p>
          </div>

          {error && (
            <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</div>
          )}
          {success && (
            <div className="mb-4 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">{success}</div>
          )}

          <form onSubmit={handleSubmit} className="mb-8 rounded-lg border border-emerald-100 bg-white p-6 shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm text-slate-700 mb-1">Nombre</label>
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-emerald-200 px-3 py-2"
                  placeholder="Ej: Senderismo (hiking)"
                />
              </div>
              <div>
                <label className="block text-sm text-slate-700 mb-1">Color (hex)</label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={normalizeColor(form.color || '#10b981')}
                    onChange={(e) => setForm((prev) => ({ ...prev, color: e.target.value.replace('#', '') }))}
                    className="h-10 w-12 rounded border border-emerald-200"
                    aria-label="Seleccionar color"
                  />
                  <input
                    name="color"
                    value={form.color}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-emerald-200 px-3 py-2"
                    placeholder="Ej: FF6B6B"
                  />
                </div>
              </div>
            </div>
            <div className="mt-4 flex gap-2 justify-end">
              {editingId && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="rounded-full border border-slate-300 px-4 py-2 text-sm text-slate-700"
                >
                  Cancelar
                </button>
              )}
              <button
                type="submit"
                disabled={saving}
                className="rounded-full bg-emerald-500 px-5 py-2 text-sm font-semibold text-white hover:bg-emerald-600 disabled:opacity-60"
              >
                {saving ? 'Guardando...' : editingId ? 'Actualizar' : 'Crear'}
              </button>
            </div>
          </form>

          {loading ? (
            <div className="text-sm text-slate-600">Cargando etiquetas...</div>
          ) : (
            <div className="overflow-x-auto rounded-lg border border-slate-200">
              <table className="min-w-full text-sm">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-slate-600">Nombre</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-slate-600">Color</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-slate-600">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {labels.map((label) => (
                    <tr key={label.id}>
                      <td className="px-4 py-3 text-slate-800">{label.name}</td>
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center gap-2">
                          <span
                            className="h-3 w-3 rounded-full"
                            style={{ backgroundColor: `#${label.color}` }}
                          />
                          <span className="text-slate-600">#{label.color}</span>
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEdit(label)}
                            className="rounded-full border border-emerald-200 px-3 py-1 text-xs text-emerald-700 hover:bg-emerald-50"
                          >
                            Editar
                          </button>
                          <button
                            onClick={() => handleDelete(label.id)}
                            className="rounded-full border border-rose-200 px-3 py-1 text-xs text-rose-700 hover:bg-rose-50"
                          >
                            Eliminar
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {labels.length === 0 && (
                    <tr>
                      <td colSpan="3" className="px-4 py-6 text-center text-slate-600">No hay etiquetas registradas.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
