import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchProfile, updateProfile, uploadAvatar, deleteAvatar } from './services/api';
import { useAuth } from './context/AuthContext';

export default function AdminProfilePage() {
  const navigate = useNavigate();
  const { user, setUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [profile, setProfile] = useState({ name: '', last_name: '', email: '' });
  const [avatarUrl, setAvatarUrl] = useState('');
  const [savingProfile, setSavingProfile] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [success, setSuccess] = useState('');

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    try {
      setLoading(true);
      const data = await fetchProfile();
      setProfile({
        name: data.name || '',
        last_name: data.last_name || '',
        email: data.email || '',
      });
      if (data.avatar_url) setAvatarUrl(data.avatar_url);
      setError('');
    } catch (err) {
      setError(err.message || 'Error cargando perfil');
    } finally {
      setLoading(false);
    }
  };

  const handleProfileSave = async (e) => {
    e.preventDefault();
    try {
      setSavingProfile(true);
      const updated = await updateProfile(profile);
      // Preservar avatar_url del user actual si el backend no lo incluye
      setUser({ ...updated, avatar_url: updated.avatar_url || user?.avatar_url });
      setError('');
      setSuccess('Perfil actualizado correctamente');
    } catch (err) {
      setError(err.message || 'No se pudo actualizar');
      setSuccess('');
    } finally {
      setSavingProfile(false);
    }
  };

  const handleRemoveAvatar = async () => {
    try {
      setUploadingAvatar(true);
      setError('');
      const result = await deleteAvatar();
      setAvatarUrl('');
      setUser({ ...result.user, avatar_url: null });
      setSuccess('Foto eliminada');
    } catch (err) {
      setError(err.message || 'No se pudo eliminar la foto');
      setSuccess('');
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleAvatar = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setUploadingAvatar(true);
      setError('');
      setSuccess('');
      const result = await uploadAvatar(file);
      setAvatarUrl(result.avatar_url);
      // Actualizar el usuario en el contexto con los datos actualizados
      if (result.user) {
        const updatedUser = { ...result.user, avatar_url: result.avatar_url };
        setUser(updatedUser);
      }
      setSuccess('Foto actualizada correctamente');
    } catch (err) {
      setError(err.message || 'No se pudo subir la foto');
    } finally {
      setUploadingAvatar(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-emerald-400/30 border-t-emerald-400"></div>
          <p className="text-sm text-slate-600">Cargando perfil...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-slate-900 px-4">
      <div className="max-w-4xl mx-auto pt-24 pb-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Perfil</h1>
          <p className="text-slate-600">Administra tu información y seguridad</p>
        </div>

        {error && (
          <div className="mb-4 rounded-xl bg-red-100 p-4 ring-1 ring-red-300 text-red-700">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-4 rounded-lg bg-emerald-100 p-4 ring-1 ring-emerald-300 text-emerald-700">
            {success}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Avatar */}
          <div className="bg-white rounded-lg p-6 ring-1 ring-slate-200 flex flex-col items-center gap-4">
            <div className="relative h-28 w-28 rounded-full bg-slate-100 ring-2 ring-emerald-400/40 overflow-hidden">
              {avatarUrl ? (
                <img src={avatarUrl} alt="avatar" className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-2xl font-semibold text-slate-600">
                  {profile.name?.[0] || 'A'}
                </div>
              )}
              {uploadingAvatar && (
                <div className="absolute inset-0 bg-white/80 flex items-center justify-center">
                  <div className="h-8 w-8 animate-spin rounded-full border-2 border-emerald-400/30 border-t-emerald-400"></div>
                </div>
              )}
            </div>
            <label className="inline-flex items-center gap-2 rounded-full bg-transparent px-4 py-2 text-sm font-semibold text-emerald-700 ring-1 ring-emerald-200 hover:bg-emerald-100 cursor-pointer">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828L18 9.828M16 5l3 3m-1.414-4.414a2 2 0 112.828 2.828L12 14l-4 1 1-4 8.414-8.414z" />
              </svg>
              Cambiar foto
              <input type="file" accept="image/*" className="hidden" onChange={handleAvatar} disabled={uploadingAvatar} />
            </label>
            <button
              type="button"
              onClick={handleRemoveAvatar}
              disabled={uploadingAvatar || !avatarUrl}
              className="inline-flex items-center gap-2 rounded-full bg-transparent px-4 py-2 text-sm font-semibold text-rose-700 ring-1 ring-rose-200 hover:bg-rose-100 disabled:opacity-60"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5-3h4m-7 3h10" />
              </svg>
              Eliminar foto
            </button>
            <p className="text-xs text-slate-500 text-center">JPG, PNG o GIF (máx. 2MB)</p>
          </div>

          {/* Datos de perfil */}
          <form onSubmit={handleProfileSave} className="bg-white rounded-lg p-6 ring-1 ring-slate-200 space-y-4 lg:col-span-2">
            <div>
              <label className="block text-sm text-slate-700 mb-1">Nombre</label>
              <input
                value={profile.name}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                required
                className="w-full rounded-lg bg-white px-4 py-2 text-slate-900 ring-1 ring-slate-200 focus:ring-2 focus:ring-emerald-400 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm text-slate-700 mb-1">Apellido</label>
              <input
                value={profile.last_name}
                onChange={(e) => setProfile({ ...profile, last_name: e.target.value })}
                className="w-full rounded-lg bg-white px-4 py-2 text-slate-900 ring-1 ring-slate-200 focus:ring-2 focus:ring-emerald-400 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm text-slate-700 mb-1">Email</label>
              <input
                type="email"
                value={profile.email}
                disabled
                className="w-full rounded-lg bg-slate-50 px-4 py-2 text-slate-500 ring-1 ring-slate-200 cursor-not-allowed"
              />
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={savingProfile}
                className="inline-flex items-center gap-2 rounded-full bg-emerald-500 px-5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-emerald-600 disabled:opacity-50"
              >
                {savingProfile ? 'Guardando...' : 'Guardar cambios'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
