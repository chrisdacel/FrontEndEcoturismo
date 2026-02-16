import { useState, useEffect } from 'react';
import Footer from './components/Footer';
import { useAuth } from './context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { api, fetchRecommendations, fetchUpcomingEvents } from './services/api';

function HomePage({ onNavigateLogin, onNavigateRegister, onNavigateColeccion, onNavigateOferta, onNavigatePrivacidad, onNavigateSobreNosotros }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [scrollY, setScrollY] = useState(0);
  const [fadeIn, setFadeIn] = useState(true);
  const [heroVisible, setHeroVisible] = useState(false);

  // Carousels
  const [populareIndex, setPopularesIndex] = useState(0);
  const [eventosIndex, setEventosIndex] = useState(0);
  const [eventosTimer, setEventosTimer] = useState(null);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [eventCardIndex, setEventCardIndex] = useState(0);
  const [eventCardVisible, setEventCardVisible] = useState(true);
  const [loadingNextEvent, setLoadingNextEvent] = useState(false);
  const [recommendedCount, setRecommendedCount] = useState(0);

  // Datos
  const sitios = [
    { id: 1, title: 'Parque Regional Natural Ucumari', subtitle: '', location: 'Via Pereira- La virginia', image: '/images/Pagina_inicio/Santuario-Fauna-Flora-Otun-Quimbaya-Ucumari-13.jpg' },
    { id: 2, title: 'Parque Nacional Natural Los Nevados', subtitle: '', location: 'Municipio de Santa Rosa de Cabal', image: '/images/Pagina_inicio/Nevado-del-Tolima-WalterV-1024x683.jpeg' },
    { id: 3, title: 'Sendero Ecológico Guasimo', subtitle: '', location: 'Santa Rosa de Cabal y Pereira', image: '/images/Pagina_inicio/guasimo.jpg' },
    { id: 4, title: 'Parque Regional Natural Ucumari', subtitle: '', location: 'Via Pereira- La virginia', image: '/images/Pagina_inicio/Santuario-Fauna-Flora-Otun-Quimbaya-Ucumari-13.jpg' },
    { id: 5, title: 'Parque Regional Natural Ucumari', subtitle: '', location: 'Via Pereira- La virginia', image: '/images/Pagina_inicio/Santuario-Fauna-Flora-Otun-Quimbaya-Ucumari-13.jpg' },
    { id: 6, title: 'Parque Regional Natural Ucumari', subtitle: '', location: 'Via Pereira- La virginia', image: '/images/Pagina_inicio/Santuario-Fauna-Flora-Otun-Quimbaya-Ucumari-13.jpg' },
    { id: 7, title: 'Parque Regional Natural Ucumari', subtitle: '', location: 'Via Pereira- La virginia', image: '/images/Pagina_inicio/Santuario-Fauna-Flora-Otun-Quimbaya-Ucumari-13.jpg' },
    { id: 8, title: 'Parque Regional Natural Ucumari', subtitle: '', location: 'Via Pereira- La virginia', image: '/images/Pagina_inicio/Santuario-Fauna-Flora-Otun-Quimbaya-Ucumari-13.jpg' },
    { id: 9, title: 'Parque Regional Natural Ucumari', subtitle: '', location: 'Via Pereira- La virginia', image: '/images/Pagina_inicio/Santuario-Fauna-Flora-Otun-Quimbaya-Ucumari-13.jpg' },
    { id: 10, title: 'Parque Regional Natural Ucumari', subtitle: '', location: 'Via Pereira- La virginia', image: '/images/Pagina_inicio/Santuario-Fauna-Flora-Otun-Quimbaya-Ucumari-13.jpg' },
  ];

  const beneficios = [
    { id: 1, title: '¡Guarda y gestiona tus sitios ecoturisticos facilmente!', image: '/images/Pagina_inicio/marcador.png' },
    { id: 2, title: '¡Personaliza tus notificaciones a tu gusto!', image: '/images/Pagina_inicio/activo.png' },
    { id: 3, title: '¡Deja tu reseña y calificacion para compartir tu experiencia!', image: '/images/Pagina_inicio/chat-bot.png' },
  ];

  // Scroll visibility
  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const t = setTimeout(() => setHeroVisible(true), 50);
    return () => clearTimeout(t);
  }, []);

  // Carousel populares
  const visibleItems = 3;
  const totalItems = sitios.length;
  const canGoNext = populareIndex < totalItems - visibleItems;
  const canGoPrev = populareIndex > 0;

  const handlePopularesNext = () => {
    if (canGoNext) setPopularesIndex(populareIndex + 1);
  };

  const handlePopularesPrev = () => {
    if (canGoPrev) setPopularesIndex(populareIndex - 1);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setPopularesIndex((prev) => (prev < totalItems - visibleItems ? prev + 1 : prev));
    }, 5000);
    return () => clearInterval(interval);
  }, [totalItems]);

  // Carousel eventos
  const handleEventosChange = (index) => {
    if (upcomingEvents.length === 0) return;
    setFadeIn(false);
    setTimeout(() => {
      setEventosIndex(index);
      setFadeIn(true);
    }, 300);
    clearInterval(eventosTimer);
    const timer = setInterval(() => {
      setFadeIn(false);
      setTimeout(() => {
        setEventosIndex((prev) => (prev + 1) % upcomingEvents.length);
        setFadeIn(true);
      }, 300);
    }, 5000);
    setEventosTimer(timer);
  };

  useEffect(() => {
    if (upcomingEvents.length === 0) return undefined;
    const timer = setInterval(() => {
      setFadeIn(false);
      setTimeout(() => {
        setEventosIndex((prev) => (prev + 1) % upcomingEvents.length);
        setFadeIn(true);
      }, 300);
    }, 5000);
    setEventosTimer(timer);
    return () => clearInterval(timer);
  }, [upcomingEvents.length]);

  useEffect(() => {
    let active = true;
    const loadNextEvent = async () => {
      try {
        setLoadingNextEvent(true);
        const data = await fetchUpcomingEvents(6);
        if (active) {
          setUpcomingEvents(Array.isArray(data) ? data : []);
          setEventCardIndex(0);
          setEventCardVisible(true);
        }
      } catch (_) {
        if (active) setUpcomingEvents([]);
      } finally {
        if (active) setLoadingNextEvent(false);
      }
    };

    loadNextEvent();

    return () => {
      active = false;
    };
  }, [user]);

  useEffect(() => {
    let active = true;
    if (!user || user.role !== 'user') {
      setRecommendedCount(0);
      return undefined;
    }

    const loadRecommendationCount = async () => {
      try {
        const [recommendations, favoritesResponse] = await Promise.all([
          fetchRecommendations(),
          api.get('/api/favorites'),
        ]);
        if (!active) return;
        const favorites = Array.isArray(favoritesResponse?.data) ? favoritesResponse.data : [];
        const favoriteIds = new Set(favorites.map((fav) => Number(fav.id)));
        const recs = Array.isArray(recommendations) ? recommendations : [];
        const newCount = recs.filter((rec) => !favoriteIds.has(Number(rec.id))).length;
        setRecommendedCount(newCount);
      } catch (_) {
        if (active) setRecommendedCount(0);
      }
    };

    loadRecommendationCount();

    return () => {
      active = false;
    };
  }, [user]);

  useEffect(() => {
    if (!user || upcomingEvents.length <= 1) return undefined;
    let mounted = true;
    const interval = setInterval(() => {
      if (!mounted) return;
      setEventCardVisible(false);
      setTimeout(() => {
        if (!mounted) return;
        setEventCardIndex((prev) => (prev + 1) % upcomingEvents.length);
        setEventCardVisible(true);
      }, 250);
    }, 5000);

    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, [user, upcomingEvents.length]);

  const formatEventDate = (value) => {
    if (!value) return '';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return '';
    const day = date.toLocaleDateString('es-CO', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
    const time = date.toLocaleTimeString('es-CO', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });
    return `${day} ${time}`;
  };

  const storageUrl = (path) => (path ? `http://localhost:8000/api/files/${path}` : '');

  const activeEvent = upcomingEvents[eventCardIndex] || null;
  const activeEventPlaceId = activeEvent?.place?.id || activeEvent?.place_id || null;
  const handleEventClick = () => {
    if (!activeEventPlaceId) return;
    if (user?.role === 'admin') {
      navigate(`/admin/sitio/${activeEventPlaceId}`);
      return;
    }
    if (user?.role === 'operator') {
      navigate(`/operador/sitio/${activeEventPlaceId}`);
      return;
    }
    if (user?.role) {
      navigate(`/turista/sitio/${activeEventPlaceId}`);
      return;
    }
    navigate(`/sitio/${activeEventPlaceId}`);
  };

  const activeCarouselEvent = upcomingEvents[eventosIndex] || null;
  const activeCarouselPlaceId = activeCarouselEvent?.place?.id || activeCarouselEvent?.place_id || null;
  const handleCarouselEventClick = () => {
    if (!activeCarouselPlaceId) return;
    if (user?.role === 'admin') {
      navigate(`/admin/sitio/${activeCarouselPlaceId}`);
      return;
    }
    if (user?.role === 'operator') {
      navigate(`/operador/sitio/${activeCarouselPlaceId}`);
      return;
    }
    if (user?.role) {
      navigate(`/turista/sitio/${activeCarouselPlaceId}`);
      return;
    }
    navigate(`/sitio/${activeCarouselPlaceId}`);
  };

  // Altura del header: 56px (h-14)
  return (
    <div className="relative min-h-screen overflow-x-hidden bg-white text-slate-900 pt-14">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(76,175,80,0.08),transparent_35%)]" />

      {/* Back to top button */}
      {scrollY > 100 && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-6 right-6 z-40 rounded-full bg-emerald-500 px-3 py-3 text-white shadow-lg shadow-emerald-500/40 transition hover:scale-110 hover:bg-emerald-600"
          aria-label="Volver arriba"
        >
          ↑
        </button>
      )}

      <main className="relative z-10">
        <section className="relative overflow-hidden bg-cover bg-center min-h-[80vh]" style={{ backgroundImage: "url(/images/Pagina_inicio/ecoturismo.jpg)" }}>
          <div className={`absolute inset-0 bg-gradient-to-r from-white via-white/80 to-transparent md:from-white md:via-white/60 md:to-black/20 transition-opacity duration-500 ${heroVisible ? 'opacity-100' : 'opacity-0'}`} />
          <div className={`absolute left-6 md:left-12 top-[25%] z-10 transition-all duration-700 ${heroVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}>
            <div className="inline-flex items-center gap-3 rounded-full bg-emerald-50 px-4 py-2 text-sm text-emerald-700">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              {user ? 'Bienvenido' : 'Ecoturismo'}
            </div>
            <div className="mt-4 max-w-2xl space-y-4">
              {user ? (
                <>
                  <h1 className="text-4xl font-bold leading-tight text-slate-900 md:text-5xl">
                    <span className="flex flex-row items-center gap-2">
                      <span>Hola,</span>
                      <span
                        style={{maxWidth:'none',overflow:'visible',textOverflow:'clip',whiteSpace:'normal',display:'inline'}}
                        title={user.name}
                        className="align-middle"
                      >
                        {user.name
                          ? (user.name.length > 20
                              ? user.name.slice(0, 20) + '...'
                              : user.name)
                          : 'usuario'}
                      </span>
                    </span>
                  </h1>
                  <p className="text-lg text-slate-700">
                    Nos alegra tenerte de regreso. Inspírate con nuevos destinos, guarda tus rutas preferidas
                    y descubre eventos cercanos para vivir la naturaleza con propósito.
                  </p>
                </>
              ) : (
                <>
                  <h1 className="text-4xl font-bold leading-tight text-slate-900 md:text-5xl">
                    Explora, guarda y personaliza tus rutas ecoturísticas en Risaralda
                  </h1>
                  <p className="text-lg text-slate-700">
                    Conecta con la naturaleza, recibe eventos cercanos y guarda tus sitios favoritos. Todo sincronizado con tu perfil y preferencias.
                  </p>
                </>
              )}
            </div>
            <div className="mt-6 flex flex-wrap gap-4">
              <button
                onClick={onNavigateColeccion}
                className="rounded-full bg-emerald-500 px-6 py-3 font-semibold text-white shadow-lg shadow-emerald-500/30 transition hover:-translate-y-0.5 hover:bg-emerald-400"
              >
                Explorar colección
              </button>
            </div>
          </div>
          
          {/* Cards flotantes a la derecha */}
          <div className="absolute bottom-4 left-2 right-2 z-40 flex flex-col gap-2 sm:gap-3 md:bottom-8 md:left-auto md:right-8 md:flex-row">
            {user && (
              <button
                type="button"
                onClick={handleEventClick}
                disabled={!activeEventPlaceId}
                className={`w-full max-w-xs mx-auto rounded-lg border border-white/30 bg-white/15 backdrop-blur-lg p-2 sm:p-3 md:p-4 text-left shadow-2xl transition-all duration-500 md:w-auto md:max-w-md ${activeEventPlaceId ? 'cursor-pointer hover:-translate-y-0.5 hover:bg-white/20' : 'cursor-default'} ${eventCardVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}
                style={{ fontSize: '0.95rem' }}
              >
                <p className="text-xs uppercase tracking-wide text-white font-bold">PRÓXIMO EVENTO</p>
                {loadingNextEvent ? (
                  <p className="mt-1 text-xs text-white/90">Cargando evento...</p>
                ) : activeEvent ? (
                  <>
                    <p className="mt-1 text-base font-bold text-white line-clamp-1">{activeEvent.title || 'Evento ecoturistico'}</p>
                    <p className="text-xs text-white/90 line-clamp-1">{activeEvent.place?.name || 'Sitio ecoturistico'}</p>
                    <p className="text-xs text-white">{formatEventDate(activeEvent.starts_at)}</p>
                  </>
                ) : (
                  <p className="mt-1 text-xs text-white/90">No hay eventos proximos, mantente atento.</p>
                )}
              </button>
            )}
            {user?.role === 'user' && (
              <button
                type="button"
                onClick={() => navigate('/turista/coleccion#recomendaciones')}
                className="w-full max-w-xs mx-auto rounded-lg border border-white/30 bg-white/15 backdrop-blur-lg p-2 sm:p-3 md:p-4 text-left shadow-2xl transition hover:-translate-y-0.5 hover:bg-white/20 md:w-auto md:max-w-md"
                style={{ fontSize: '0.95rem' }}
              >
                <p className="text-xs uppercase tracking-wide text-white font-bold">FAVORITOS</p>
                <p className="mt-1 text-base font-bold text-white">
                  {recommendedCount} {recommendedCount === 1 ? 'nuevo sitio' : 'nuevos sitios'}
                </p>
                <p className="text-xs text-white">Listos para explorar</p>
              </button>
            )}
          </div>
        </section>

        {/* FEATURES STRIP */}
        <section className="py-10 mt-8">
          <div className="mx-auto grid max-w-6xl gap-6 px-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                title: 'Preferencias inteligentes',
                desc: 'Recibe sugerencias y alertas según lo que te gusta explorar.',
              },
              {
                title: 'Colección personal',
                desc: 'Guarda sitios, crea rutas y accede offline cuando lo necesites.',
              },
              {
                title: 'Eventos verificados',
                desc: 'Calendario eco con curaduría local y notificaciones oportunas.',
              },
              {
                title: 'Seguridad y acompañamiento',
                desc: 'Consejos de acceso, clima y contactos de apoyo en cada lugar.',
              },
            ].map((item) => (
              <div key={item.title}>
                <h3 className="text-lg font-semibold text-slate-900">{item.title}</h3>
                <p className="mt-2 text-sm text-slate-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* EVENTOS */}
        <section className="w-full py-20">
          <div className="mx-auto max-w-7xl px-6">
            <div className="mb-10 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.25em] text-emerald-700">Agenda viva</p>
                <h2 className="text-3xl font-semibold text-slate-900">Nuevos eventos</h2>
                <p className="mt-2 text-slate-600">Explora los eventos disponibles del momento.</p>
              </div>
            </div>

            {upcomingEvents.length > 0 ? (
              <>
                {/* Carousel eventos */}
                <button
                  type="button"
                  onClick={handleCarouselEventClick}
                  disabled={!activeCarouselPlaceId}
                  className={`relative w-full overflow-hidden rounded-lg border border-emerald-100 shadow-lg shadow-emerald-100/50 min-h-96 bg-slate-900 text-left transition ${activeCarouselPlaceId ? 'cursor-pointer hover:-translate-y-0.5' : 'cursor-default'}`}
                >
                  {/* Background image con crossfade */}
                  <div
                    className={`absolute inset-0 bg-cover bg-center transition-opacity duration-700 ease-in-out ${fadeIn ? 'opacity-100' : 'opacity-0'}`}
                    style={{ backgroundImage: upcomingEvents[eventosIndex]?.image ? `url(${storageUrl(upcomingEvents[eventosIndex]?.image)})` : 'none' }}
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/20 to-transparent" />

                  <div className={`relative flex h-full flex-col items-start justify-start gap-2 px-8 pb-8 pt-4 transition-all duration-500 transform ${fadeIn ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                    <p className="text-xs uppercase tracking-[0.2em] text-white/80">Próximo evento</p>
                    <h3 className="text-3xl font-bold text-white">
                      {upcomingEvents[eventosIndex]?.title || 'Evento ecoturistico'}
                    </h3>
                    <p className="text-white/90">Recibe alertas y guarda en tu agenda.</p>
                  </div>

                  {/* Flechas navegación */}
                  <span
                    onClick={e => { e.stopPropagation(); handleEventosChange((eventosIndex - 1 + upcomingEvents.length) % upcomingEvents.length); }}
                    className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-black/25 px-2 py-1.5 text-xl font-semibold text-white/90 shadow-sm transition hover:bg-black/40 md:-left-6 cursor-pointer select-none"
                    aria-label="Evento anterior"
                    role="button"
                    tabIndex={0}
                    onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.stopPropagation(); handleEventosChange((eventosIndex - 1 + upcomingEvents.length) % upcomingEvents.length); } }}
                  >
                    &lt;
                  </span>
                  <span
                    onClick={e => { e.stopPropagation(); handleEventosChange((eventosIndex + 1) % upcomingEvents.length); }}
                    className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-black/25 px-2 py-1.5 text-xl font-semibold text-white/90 shadow-sm transition hover:bg-black/40 md:-right-6 cursor-pointer select-none"
                    aria-label="Siguiente evento"
                    role="button"
                    tabIndex={0}
                    onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.stopPropagation(); handleEventosChange((eventosIndex + 1) % upcomingEvents.length); } }}
                  >
                    &gt;
                  </span>
                </button>

                {/* Dots fuera de la card */}
                <div className="mt-4 flex justify-center gap-3">
                  {upcomingEvents.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleEventosChange(idx)}
                      className={`h-2.5 w-2.5 rounded-full transition ${idx === eventosIndex ? 'bg-emerald-600' : 'bg-emerald-200'}`}
                      aria-label={`Ir al evento ${idx + 1}`}
                    />
                  ))}
                </div>
              </>
            ) : (
              <div className="rounded-2xl border border-emerald-100 bg-emerald-50/40 p-6 text-center text-sm text-slate-600">
                No hay eventos disponibles en este momento.
              </div>
            )}
          </div>
        </section>

        {/* BENEFICIOS */}
        <section className="pb-20">
          <div className="mx-auto max-w-7xl px-6">
            <div className="mb-10 text-center">
              <p className="text-sm uppercase tracking-[0.25em] text-emerald-700">Por qué usar Conexión EcoRisaralda</p>
              <h2 className="mt-2 text-3xl font-semibold text-slate-900">Diseñado para viajeros conscientes</h2>
              <p className="mt-3 text-slate-600">Configura, guarda y comparte experiencias sostenibles mientras recibes la mejor curaduría local.</p>
            </div>

            <div className="grid gap-10 md:grid-cols-3">
              {beneficios.map((beneficio) => (
                <div key={beneficio.id} className="flex min-h-64 w-full flex-col gap-4 rounded-lg border border-emerald-100 bg-emerald-50/30 p-6 text-center shadow-sm shadow-emerald-100/50">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-xl bg-emerald-100/50">
                    <img src={beneficio.image} alt={beneficio.title} className="h-10 w-10" />
                  </div>
                  <p className="text-base font-semibold text-slate-900 leading-snug">{beneficio.title}</p>
                  <p className="text-sm text-slate-600 leading-relaxed">Optimiza tu viaje con herramientas pensadas para seguridad, personalización y comunidad.</p>
                </div>
              ))}
            </div>

            <div className="mt-12 flex flex-col items-center gap-4 rounded-lg bg-transparent px-6 py-8 text-center">
              <h3 className="text-2xl font-semibold text-slate-900">Configura tus preferencias en minutos</h3>
              <p className="max-w-2xl text-slate-700">Activa notificaciones, selecciona categorías de interés y guarda sitios para recibir recordatorios antes de tus salidas.</p>
              <div className="flex flex-wrap justify-center gap-3">
                <button
                  onClick={onNavigateOferta}
                  className="rounded-full bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-emerald-700"
                >
                  Ver cómo funciona
                </button>
                {!user && (
                  <button
                    onClick={onNavigateRegister}
                    className="rounded-full border border-emerald-300 px-5 py-3 text-sm font-semibold text-slate-900 transition hover:-translate-y-0.5 hover:bg-emerald-50"
                  >
                    Crear cuenta ahora
                  </button>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <Footer 
        onNavigateSobreNosotros={onNavigateSobreNosotros}
        onNavigatePrivacidad={onNavigatePrivacidad}
        onNavigateQueOfrecemos={() => window.location.href = '/que-ofrecemos'}
        onNavigateColeccion={() => window.location.href = '/coleccion'}
        onNavigateLogin={() => window.location.href = '/login'}
        onNavigateInicio={() => window.location.href = '/'}
      />
    </div>
  );
}

export default HomePage;
