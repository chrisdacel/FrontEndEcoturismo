import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from './services/api';
import Alert from './components/Alert';

export default function AdminOperatorsPage() {
  const navigate = useNavigate();
  const [pendingPlaces, setPendingPlaces] = useState([]);
  const [pendingEvents, setPendingEvents] = useState([]);
  const [historyPlaces, setHistoryPlaces] = useState([]);
  const [historyEvents, setHistoryEvents] = useState([]);
  const [loadingApprovals, setLoadingApprovals] = useState(true);
  const [error, setError] = useState('');
  const [approvalBusyId, setApprovalBusyId] = useState(null);
  const [eventApprovalBusyId, setEventApprovalBusyId] = useState(null);
  const [placeMenuOpen, setPlaceMenuOpen] = useState(null);
  const [eventMenuOpen, setEventMenuOpen] = useState(null);
  const [placeMenuDirection, setPlaceMenuDirection] = useState('down');
  const [eventMenuDirection, setEventMenuDirection] = useState('down');
  const [viewMode, setViewMode] = useState('pending');


  useEffect(() => {
    loadApprovals();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (placeMenuOpen !== null) {
        const placeMenu = document.querySelector(`[data-place-menu-id="${placeMenuOpen}"]`);
        if (placeMenu && !placeMenu.contains(event.target)) {
          setPlaceMenuOpen(null);
        }
      }
      if (eventMenuOpen !== null) {
        const eventMenu = document.querySelector(`[data-event-menu-id="${eventMenuOpen}"]`);
        if (eventMenu && !eventMenu.contains(event.target)) {
          setEventMenuOpen(null);
        }
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [placeMenuOpen, eventMenuOpen]);

  const loadApprovals = async () => {
    try {
      setLoadingApprovals(true);
      const { data } = await api.get('/api/user-places');
      const list = Array.isArray(data) ? data : [];
      const pending = list.filter((place) => (place.approval_status || 'pending') === 'pending');
      const history = list.filter((place) => {
        const status = place.approval_status || 'pending';
        return status === 'approved' || status === 'rejected';
      });
      const allEvents = list.flatMap((place) => (
        Array.isArray(place.events)
          ? place.events.map((event) => ({ ...event, place }))
          : []
      ));
      const pendingEventList = allEvents.filter((event) => (event.approval_status || 'pending') === 'pending');
      const historyEventList = allEvents.filter((event) => {
        const status = event.approval_status || 'pending';
        return status === 'approved' || status === 'rejected';
      });
      setPendingPlaces(pending);
      setHistoryPlaces(history);
      setPendingEvents(pendingEventList);
      setHistoryEvents(historyEventList);
      setError('');
    } catch (err) {
      setError(err?.message || 'Error cargando aprobaciones');
    } finally {
      setLoadingApprovals(false);
    }
  };

  const updatePlaceApproval = async (id, status) => {
    try {
      setApprovalBusyId(id);
      await api.post(`/api/admin/places/${id}/approval`, { status });
      loadApprovals();
      setError('');
    } catch (err) {
      setError(err?.message || 'No se pudo actualizar el estado');
    } finally {
      setApprovalBusyId(null);
    }
  };

  const updateEventApproval = async (eventId, status) => {
    try {
      setEventApprovalBusyId(eventId);
      await api.post(`/api/admin/events/${eventId}/approval`, { status });
      loadApprovals();
      setError('');
    } catch (err) {
      const message = err?.response?.data?.message || err?.message || 'No se pudo actualizar el evento';
      setError(message);
    } finally {
      setEventApprovalBusyId(null);
    }
  };

  const approvalLabels = {
    pending: 'Pendiente',
    approved: 'Aprobado',
    rejected: 'Rechazado',
  };

  const renderPlaceRow = (place, rowKey) => (
    <tr key={rowKey} className="hover:bg-slate-50">
      <td className="px-6 py-6 text-sm font-medium text-slate-900">
        <span className="line-clamp-2">{place.name || place.nombre || '—'}</span>
      </td>
      <td className="px-6 py-6 text-sm text-slate-700">
        <span className="line-clamp-2">{place.user?.email || '—'}</span>
      </td>
      <td className="px-6 py-6 text-sm text-slate-700">
        {approvalLabels[place.approval_status] || 'Pendiente'}
      </td>
      <td className="px-6 py-6 text-sm text-right">
        <div className="relative" data-place-menu-id={place.id}>
          <button
            type="button"
            onClick={(event) => {
              const rect = event.currentTarget.getBoundingClientRect();
              const spaceBelow = window.innerHeight - rect.bottom;
              setPlaceMenuDirection(spaceBelow < 260 ? 'up' : 'down');
              setPlaceMenuOpen((prev) => (prev === place.id ? null : place.id));
            }}
            className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm text-slate-700 ring-1 ring-emerald-200 transition hover:bg-emerald-50"
          >
            Acciones sitio
            <svg
              className={`h-4 w-4 transition-transform duration-200 ${
                placeMenuOpen === place.id ? 'rotate-180' : ''
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          {placeMenuOpen === place.id && (
            <div
              className={`absolute right-0 w-56 max-h-none rounded-xl overflow-visible bg-white text-slate-800 shadow-lg ring-1 ring-slate-200/60 dropdown-open z-20 ${
                placeMenuDirection === 'up' ? 'bottom-full mb-2 origin-bottom-right' : 'top-full mt-2 origin-top-right'
              }`}
            >
              <button
                type="button"
                onClick={() => {
                  updatePlaceApproval(place.id, 'approved');
                  setPlaceMenuOpen(null);
                }}
                disabled={approvalBusyId === place.id}
                className="w-full px-4 py-2 text-left text-sm transition-colors hover:bg-slate-100 hover:text-emerald-500 disabled:opacity-60"
              >
                Aprobar
              </button>
              <button
                type="button"
                onClick={() => {
                  updatePlaceApproval(place.id, 'rejected');
                  setPlaceMenuOpen(null);
                }}
                disabled={approvalBusyId === place.id}
                className="w-full px-4 py-2 text-left text-sm transition-colors hover:bg-slate-100 hover:text-emerald-500 disabled:opacity-60"
              >
                Rechazar
              </button>
              <button
                type="button"
                onClick={() => {
                  updatePlaceApproval(place.id, 'pending');
                  setPlaceMenuOpen(null);
                }}
                disabled={approvalBusyId === place.id}
                className="w-full px-4 py-2 text-left text-sm transition-colors hover:bg-slate-100 hover:text-emerald-500 disabled:opacity-60"
              >
                Pendiente
              </button>
            </div>
          )}
        </div>
      </td>
    </tr>
  );

  const renderEventRow = (event, rowKey) => {
    const place = event.place || {};
    return (
      <tr key={rowKey} className="hover:bg-slate-50">
        <td className="px-6 py-7 text-sm font-medium text-slate-900">
          <span className="line-clamp-2">{event.title || event.name || event.nombre || '—'}</span>
        </td>
        <td className="px-6 py-7 text-sm text-slate-700">
          <span className="line-clamp-2">{place.name || place.nombre || '—'}</span>
        </td>
        <td className="px-6 py-7 text-sm text-slate-700">
          <span className="line-clamp-2">{place.user?.email || '—'}</span>
        </td>
        <td className="px-6 py-7 text-sm text-slate-700">
          {approvalLabels[event.approval_status] || 'Pendiente'}
        </td>
        <td className="px-6 py-7 text-sm text-right">
          <div className="relative" data-event-menu-id={event.id}>
            <button
              type="button"
              onClick={(eventTarget) => {
                const rect = eventTarget.currentTarget.getBoundingClientRect();
                const spaceBelow = window.innerHeight - rect.bottom;
                setEventMenuDirection(spaceBelow < 260 ? 'up' : 'down');
                setEventMenuOpen((prev) => (prev === event.id ? null : event.id));
              }}
              className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm text-slate-700 ring-1 ring-emerald-200 transition hover:bg-emerald-50"
            >
              Acciones evento
              <svg
                className={`h-4 w-4 transition-transform duration-200 ${
                  eventMenuOpen === event.id ? 'rotate-180' : ''
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {eventMenuOpen === event.id && (
              <div
                className={`absolute right-0 w-56 max-h-none rounded-xl overflow-visible bg-white text-slate-800 shadow-lg ring-1 ring-slate-200/60 dropdown-open z-50 ${
                  eventMenuDirection === 'up' ? 'bottom-full mb-2 origin-bottom-right' : 'top-full mt-2 origin-top-right'
                }`}
              >
                <button
                  type="button"
                  onClick={() => {
                    updateEventApproval(event.id, 'approved');
                    setEventMenuOpen(null);
                  }}
                  disabled={eventApprovalBusyId === event.id}
                  className="w-full px-4 py-2 text-left text-sm transition-colors hover:bg-slate-100 hover:text-emerald-500 disabled:opacity-60"
                >
                  Aprobar
                </button>
                <button
                  type="button"
                  onClick={() => {
                    updateEventApproval(event.id, 'rejected');
                    setEventMenuOpen(null);
                  }}
                  disabled={eventApprovalBusyId === event.id}
                  className="w-full px-4 py-2 text-left text-sm transition-colors hover:bg-slate-100 hover:text-emerald-500 disabled:opacity-60"
                >
                  Rechazar
                </button>
                <button
                  type="button"
                  onClick={() => {
                    updateEventApproval(event.id, 'pending');
                    setEventMenuOpen(null);
                  }}
                  disabled={eventApprovalBusyId === event.id}
                  className="w-full px-4 py-2 text-left text-sm transition-colors hover:bg-slate-100 hover:text-emerald-500 disabled:opacity-60"
                >
                  Pendiente
                </button>
              </div>
            )}
          </div>
        </td>
      </tr>
    );
  };

  if (loadingApprovals) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-emerald-400/30 border-t-emerald-400"></div>
          <p className="text-sm text-slate-600">Cargando aprobaciones...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-slate-900 px-4 pb-16 overflow-x-hidden">
      <div className="max-w-7xl mx-auto pt-24">
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
            <h1 className="text-3xl font-bold text-slate-900">Gestionar aprobaciones</h1>
            <p className="text-slate-600">Gestiona solicitudes de sitios y eventos</p>
          </div>
          <button
            type="button"
            onClick={() => setViewMode((prev) => (prev === 'pending' ? 'history' : 'pending'))}
            className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm text-slate-700 ring-1 ring-emerald-200 transition hover:bg-emerald-50"
          >
            {viewMode === 'pending' ? 'Ver historial' : 'Volver a pendientes'}
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {error && (
          <Alert type="error" className="mb-4">
            {error}
          </Alert>
        )}

        {viewMode === 'pending' ? (
          <>
            <div className="mt-10">
              <h2 className="text-lg font-semibold text-slate-900">Solicitudes de sitios</h2>
              <p className="mt-1 text-sm text-slate-600">Sitios pendientes por revisar</p>
            </div>

            <div className="mt-4 md:hidden space-y-3">
              {pendingPlaces.map((place) => (
                <div key={place.id} className="rounded-xl border border-slate-200 bg-white p-4">
                  <p className="text-sm font-semibold text-slate-900">{place.name || place.nombre || '—'}</p>
                  <p className="mt-1 text-xs text-slate-600">{place.user?.email || '—'}</p>
                  <p className="mt-2 text-xs text-slate-600">Estado: {approvalLabels[place.approval_status] || 'Pendiente'}</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => updatePlaceApproval(place.id, 'approved')}
                      disabled={approvalBusyId === place.id}
                      className="rounded-full bg-emerald-500 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-600 disabled:opacity-60"
                    >
                      Aprobar
                    </button>
                    <button
                      type="button"
                      onClick={() => updatePlaceApproval(place.id, 'rejected')}
                      disabled={approvalBusyId === place.id}
                      className="rounded-full bg-rose-500 px-3 py-1.5 text-xs font-semibold text-white hover:bg-rose-600 disabled:opacity-60"
                    >
                      Rechazar
                    </button>
                    <button
                      type="button"
                      onClick={() => updatePlaceApproval(place.id, 'pending')}
                      disabled={approvalBusyId === place.id}
                      className="rounded-full border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-60"
                    >
                      Pendiente
                    </button>
                  </div>
                </div>
              ))}
              {!loadingApprovals && pendingPlaces.length === 0 && (
                <div className="rounded-xl border border-slate-200 bg-white p-4 text-center text-sm text-slate-600">
                  No hay sitios pendientes
                </div>
              )}
            </div>

            <div className="mt-4 hidden md:block min-h-[320px] overflow-x-auto overflow-y-visible bg-white border-b border-slate-200 pb-10">
              <table className="min-w-full text-sm">
                <thead className="bg-white">
                  <tr>
                    <th className="px-6 py-3 text-left text-slate-700 uppercase tracking-wider text-xs">Sitio</th>
                    <th className="px-6 py-3 text-left text-slate-700 uppercase tracking-wider text-xs">Operador</th>
                    <th className="px-6 py-3 text-left text-slate-700 uppercase tracking-wider text-xs">Estado</th>
                    <th className="px-6 py-3 text-right text-slate-700 uppercase tracking-wider text-xs">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {pendingPlaces.map((place) => renderPlaceRow(place, place.id))}
                  {!loadingApprovals && pendingPlaces.length === 0 && (
                    <tr>
                      <td colSpan={4} className="px-6 py-6 text-center text-slate-600">No hay sitios pendientes</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="mt-10">
              <h2 className="text-lg font-semibold text-slate-900">Solicitudes de eventos</h2>
              <p className="mt-1 text-sm text-slate-600">Eventos pendientes por revisar</p>
            </div>

            <div className="mt-4 md:hidden space-y-3">
              {pendingEvents.map((event) => (
                <div key={event.id} className="rounded-xl border border-slate-200 bg-white p-4">
                  <p className="text-sm font-semibold text-slate-900">{event.title || event.name || event.nombre || '—'}</p>
                  <p className="mt-1 text-xs text-slate-600">{event.place?.name || event.place?.nombre || '—'}</p>
                  <p className="mt-1 text-xs text-slate-600">{event.place?.user?.email || '—'}</p>
                  <p className="mt-2 text-xs text-slate-600">Estado: {approvalLabels[event.approval_status] || 'Pendiente'}</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => updateEventApproval(event.id, 'approved')}
                      disabled={eventApprovalBusyId === event.id}
                      className="rounded-full bg-emerald-500 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-600 disabled:opacity-60"
                    >
                      Aprobar
                    </button>
                    <button
                      type="button"
                      onClick={() => updateEventApproval(event.id, 'rejected')}
                      disabled={eventApprovalBusyId === event.id}
                      className="rounded-full bg-rose-500 px-3 py-1.5 text-xs font-semibold text-white hover:bg-rose-600 disabled:opacity-60"
                    >
                      Rechazar
                    </button>
                    <button
                      type="button"
                      onClick={() => updateEventApproval(event.id, 'pending')}
                      disabled={eventApprovalBusyId === event.id}
                      className="rounded-full border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-60"
                    >
                      Pendiente
                    </button>
                  </div>
                </div>
              ))}
              {!loadingApprovals && pendingEvents.length === 0 && (
                <div className="rounded-xl border border-slate-200 bg-white p-4 text-center text-sm text-slate-600">
                  No hay eventos pendientes
                </div>
              )}
            </div>

            <div className="mt-4 hidden md:block min-h-[360px] overflow-visible bg-white border-b border-slate-200 pb-12">
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                <thead className="bg-white">
                  <tr>
                    <th className="px-6 py-3 text-left text-slate-700 uppercase tracking-wider text-xs">Evento</th>
                    <th className="px-6 py-3 text-left text-slate-700 uppercase tracking-wider text-xs">Sitio</th>
                    <th className="px-6 py-3 text-left text-slate-700 uppercase tracking-wider text-xs">Operador</th>
                    <th className="px-6 py-3 text-left text-slate-700 uppercase tracking-wider text-xs">Estado</th>
                    <th className="px-6 py-3 text-right text-slate-700 uppercase tracking-wider text-xs">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {pendingEvents.map((event) => renderEventRow(event, event.id))}
                  {!loadingApprovals && pendingEvents.length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-6 py-6 text-center text-slate-600">No hay eventos pendientes</td>
                    </tr>
                  )}
                </tbody>
                </table>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="mt-10">
              <h2 className="text-lg font-semibold text-slate-900">Historial de sitios</h2>
              <p className="mt-1 text-sm text-slate-600">Solicitudes respondidas de sitios</p>
            </div>

            <div className="mt-4 md:hidden space-y-3">
              {historyPlaces.map((place) => (
                <div key={`${place.id}-history`} className="rounded-xl border border-slate-200 bg-white p-4">
                  <p className="text-sm font-semibold text-slate-900">{place.name || place.nombre || '—'}</p>
                  <p className="mt-1 text-xs text-slate-600">{place.user?.email || '—'}</p>
                  <p className="mt-2 text-xs text-slate-600">Estado: {approvalLabels[place.approval_status] || 'Pendiente'}</p>
                </div>
              ))}
              {!loadingApprovals && historyPlaces.length === 0 && (
                <div className="rounded-xl border border-slate-200 bg-white p-4 text-center text-sm text-slate-600">
                  No hay historial de sitios
                </div>
              )}
            </div>

            <div className="mt-4 hidden md:block min-h-[320px] overflow-x-auto bg-white border-b border-slate-200 pb-10">
              <table className="min-w-full text-sm">
                <thead className="bg-white">
                  <tr>
                    <th className="px-6 py-3 text-left text-slate-700 uppercase tracking-wider text-xs">Sitio</th>
                    <th className="px-6 py-3 text-left text-slate-700 uppercase tracking-wider text-xs">Operador</th>
                    <th className="px-6 py-3 text-left text-slate-700 uppercase tracking-wider text-xs">Estado</th>
                    <th className="px-6 py-3 text-right text-slate-700 uppercase tracking-wider text-xs">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {historyPlaces.map((place) => renderPlaceRow(place, `${place.id}-history`))}
                  {!loadingApprovals && historyPlaces.length === 0 && (
                    <tr>
                      <td colSpan={4} className="px-6 py-6 text-center text-slate-600">No hay historial de sitios</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="mt-10">
              <h2 className="text-lg font-semibold text-slate-900">Historial de eventos</h2>
              <p className="mt-1 text-sm text-slate-600">Solicitudes respondidas de eventos</p>
            </div>

            <div className="mt-4 md:hidden space-y-3">
              {historyEvents.map((event) => (
                <div key={`history-${event.id}`} className="rounded-xl border border-slate-200 bg-white p-4">
                  <p className="text-sm font-semibold text-slate-900">{event.title || event.name || event.nombre || '—'}</p>
                  <p className="mt-1 text-xs text-slate-600">{event.place?.name || event.place?.nombre || '—'}</p>
                  <p className="mt-1 text-xs text-slate-600">{event.place?.user?.email || '—'}</p>
                  <p className="mt-2 text-xs text-slate-600">Estado: {approvalLabels[event.approval_status] || 'Pendiente'}</p>
                </div>
              ))}
              {!loadingApprovals && historyEvents.length === 0 && (
                <div className="rounded-xl border border-slate-200 bg-white p-4 text-center text-sm text-slate-600">
                  No hay historial de eventos
                </div>
              )}
            </div>

            <div className="mt-4 hidden md:block min-h-[360px] overflow-visible bg-white border-b border-slate-200 pb-12">
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                <thead className="bg-white">
                  <tr>
                    <th className="px-6 py-3 text-left text-slate-700 uppercase tracking-wider text-xs">Evento</th>
                    <th className="px-6 py-3 text-left text-slate-700 uppercase tracking-wider text-xs">Sitio</th>
                    <th className="px-6 py-3 text-left text-slate-700 uppercase tracking-wider text-xs">Operador</th>
                    <th className="px-6 py-3 text-left text-slate-700 uppercase tracking-wider text-xs">Estado</th>
                    <th className="px-6 py-3 text-right text-slate-700 uppercase tracking-wider text-xs">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {historyEvents.map((event) => renderEventRow(event, `history-${event.id}`))}
                  {!loadingApprovals && historyEvents.length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-6 py-6 text-center text-slate-600">No hay historial de eventos</td>
                    </tr>
                  )}
                </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
