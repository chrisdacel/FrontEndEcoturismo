import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebook, faLinkedin, faYoutube, faInstagram } from '@fortawesome/free-brands-svg-icons';
import { useAuth } from './context/AuthContext';

function HomePage({ onNavigateLogin, onNavigateRegister, onNavigateColeccion, onNavigateOferta, onNavigatePrivacidad, onNavigateSobreNosotros }) {
  const { user } = useAuth();
  const [scrollY, setScrollY] = useState(0);
  const [fadeIn, setFadeIn] = useState(true);
  const [heroVisible, setHeroVisible] = useState(false);

  // Carousels
  const [populareIndex, setPopularesIndex] = useState(0);
  const [eventosIndex, setEventosIndex] = useState(0);
  const [eventosTimer, setEventosTimer] = useState(null);

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

  const eventos = [
    { id: 1, title: 'Santa Rosa De Cabal', image: 'url(/images/Pagina_inicio/Pasadia-termales-de-santa-rosa-de-cabal-y-filandia.webp)' },
    { id: 2, title: 'Via Pereira La Virginia', image: 'url(/images/Pagina_inicio/Nevado-del-Tolima-WalterV-1024x683.jpeg)' },
    { id: 3, title: 'Santa Rosa De Cabal', image: 'url(/images/Pagina_inicio/Pasadia-termales-de-santa-rosa-de-cabal-y-filandia.webp)' },
    { id: 4, title: 'Via Pereira La Virginia', image: 'url(/images/Pagina_inicio/Nevado-del-Tolima-WalterV-1024x683.jpeg)' },
    { id: 5, title: 'Santa Rosa De Cabal', image: 'url(/images/Pagina_inicio/Pasadia-termales-de-santa-rosa-de-cabal-y-filandia.webp)' },
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
    setFadeIn(false);
    setTimeout(() => {
      setEventosIndex(index);
      setFadeIn(true);
    }, 300);
    clearInterval(eventosTimer);
    const timer = setInterval(() => {
      setFadeIn(false);
      setTimeout(() => {
        setEventosIndex((prev) => (prev + 1) % eventos.length);
        setFadeIn(true);
      }, 300);
    }, 5000);
    setEventosTimer(timer);
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setFadeIn(false);
      setTimeout(() => {
        setEventosIndex((prev) => (prev + 1) % eventos.length);
        setFadeIn(true);
      }, 300);
    }, 5000);
    setEventosTimer(timer);
    return () => clearInterval(timer);
  }, [eventos.length]);

  return (
    <div className="relative min-h-screen overflow-hidden bg-white text-slate-900">
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
        {/* HERO */}
        <section className="relative overflow-hidden bg-cover bg-center min-h-[80vh]" style={{ backgroundImage: "url(/images/Pagina_inicio/ecoturismo.jpg)" }}>
          <div className={`absolute inset-0 bg-gradient-to-r from-white via-white/80 to-transparent md:from-white md:via-white/60 md:to-black/20 transition-opacity duration-500 ${heroVisible ? 'opacity-100' : 'opacity-0'}`} />
          <div className={`absolute left-6 md:left-12 top-[25%] z-10 transition-all duration-700 ${heroVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}>
            <div className="inline-flex items-center gap-3 rounded-full bg-emerald-50 px-4 py-2 text-sm text-emerald-700">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              Ecoturismo
            </div>
            <div className="mt-4 max-w-2xl space-y-4">
              <h1 className="text-4xl font-bold leading-tight text-slate-900 md:text-5xl">
                Explora, guarda y personaliza tus rutas ecoturísticas en Risaralda
              </h1>
              <p className="text-lg text-slate-700">
                Conecta con la naturaleza, recibe eventos cercanos y guarda tus sitios favoritos. Todo sincronizado con tu perfil y preferencias.
              </p>
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
          <div className="absolute bottom-8 right-8 z-50 flex gap-3">
            <div className="rounded-lg border border-white/30 bg-white/15 backdrop-blur-lg p-4 shadow-2xl">
              <p className="text-xs uppercase tracking-wide text-white font-bold">PRÓXIMO EVENTO</p>
              <p className="mt-2 text-lg font-bold text-white">Avistamiento en Ucumarí</p>
              <p className="text-sm text-white">Sábado 9:00 AM</p>
            </div>
            {user && user.role !== 'admin' && (
              <div className="rounded-lg border border-white/30 bg-white/15 backdrop-blur-lg p-4 shadow-2xl">
                <p className="text-xs uppercase tracking-wide text-white font-bold">FAVORITOS</p>
                <p className="mt-2 text-lg font-bold text-white">3 nuevos sitios</p>
                <p className="text-sm text-white">Listos para explorar</p>
              </div>
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

        {/* POPULARES + EVENTOS */}
        <section className="w-full py-20">
          <div className="mx-auto max-w-7xl px-6">
            <div className="mb-10 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.25em] text-emerald-700">Agenda viva</p>
                <h2 className="text-3xl font-semibold text-slate-900">Sitios populares y eventos en tiempo real</h2>
                <p className="mt-2 text-slate-600">Desliza para ver los destinos más guardados y los eventos que se vienen.</p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={onNavigateColeccion}
                  className="rounded-full border border-emerald-200 px-4 py-2 text-sm font-semibold text-slate-900 transition hover:border-emerald-400 hover:bg-emerald-50"
                >
                  Ver colección completa
                </button>
              </div>
            </div>

            {/* Carousel eventos */}
            <div className="relative overflow-hidden rounded-lg border border-emerald-100 shadow-lg shadow-emerald-100/50 min-h-96 bg-slate-900">
                {/* Background image con crossfade */}
                <div 
                  className={`absolute inset-0 bg-cover bg-center transition-opacity duration-700 ease-in-out ${fadeIn ? 'opacity-100' : 'opacity-0'}`}
                  style={{ backgroundImage: eventos[eventosIndex]?.image || 'none' }}
                />
                
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/20 to-transparent" />

                <div className={`relative flex h-full flex-col justify-end gap-2 p-8 transition-all duration-500 transform ${fadeIn ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                  <p className="text-xs uppercase tracking-[0.2em] text-white/80">Próximo evento</p>
                  <h3 className="text-3xl font-bold text-white">{eventos[eventosIndex]?.title}</h3>
                  <p className="text-white/90">Recibe alertas y guarda en tu agenda.</p>
                </div>

                {/* Flechas navegación */}
                <button
                  onClick={() => handleEventosChange((eventosIndex - 1 + eventos.length) % eventos.length)}
                  className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-black/40 px-3 py-2 text-2xl font-bold text-white transition hover:bg-black/60"
                  aria-label="Evento anterior"
                >
                  &lt;
                </button>
                <button
                  onClick={() => handleEventosChange((eventosIndex + 1) % eventos.length)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-black/40 px-3 py-2 text-2xl font-bold text-white transition hover:bg-black/60"
                  aria-label="Siguiente evento"
                >
                  &gt;
                </button>

                {/* Dots */}
              </div>

              {/* Dots fuera de la card */}
              <div className="mt-4 flex justify-center gap-3">
                {eventos.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleEventosChange(idx)}
                    className={`h-2.5 w-2.5 rounded-full transition ${idx === eventosIndex ? 'bg-emerald-600' : 'bg-emerald-200'}`}
                    aria-label={`Ir al evento ${idx + 1}`}
                  />
                ))}
            </div>
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
      <footer className="border-t border-emerald-100 bg-emerald-50/50">
        <div className="mx-auto max-w-7xl px-6 py-12">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {/* Col 1 */}
            <div>
              <h3 className="mb-2 text-lg font-bold text-slate-900">Conexion</h3>
              <p className="mb-4 text-sm text-slate-700">EcoRisaralda</p>
              <div className="flex gap-4 text-lg text-emerald-600">
                <a href="#"><FontAwesomeIcon icon={faFacebook} /></a>
                <a href="#"><FontAwesomeIcon icon={faLinkedin} /></a>
                <a href="#"><FontAwesomeIcon icon={faYoutube} /></a>
                <a href="#"><FontAwesomeIcon icon={faInstagram} /></a>
              </div>
              <div className="mt-4 text-sm text-slate-700">
                🌐
                <select className="ml-2 rounded border border-emerald-200 bg-white px-2 py-1 text-slate-700 outline-none">
                  <option>Español</option>
                  <option>English</option>
                </select>
              </div>
            </div>

            {/* Col 2 */}
            <div>
              <h4 className="mb-4 font-bold text-slate-900">Información</h4>
              <ul className="space-y-2 text-sm text-slate-700">
                <li><a href="#" className="hover:text-slate-900">Conexión EcoRisaralda</a></li>
                <li><a href="#" className="hover:text-slate-900">Descripción</a></li>
                <li><a href="#" className="hover:text-slate-900">Lema</a></li>
              </ul>
            </div>

            {/* Col 3 */}
            <div>
              <h4 className="mb-4 font-bold text-slate-900">Navegación rápida</h4>
              <ul className="space-y-2 text-sm text-slate-700">
                <li><button onClick={onNavigateColeccion} className="text-left hover:text-slate-900">Inicio</button></li>
                <li><button onClick={onNavigateSobreNosotros} className="text-left hover:text-slate-900">Sobre nosotros</button></li>
                <li><button onClick={onNavigatePrivacidad} className="text-left hover:text-slate-900">Políticas</button></li>
              </ul>
            </div>

            {/* Col 4 */}
            <div>
              <h4 className="mb-4 font-bold text-slate-900">Contacto y soporte</h4>
              <ul className="space-y-2 text-sm text-slate-700">
                <li><a href="mailto:ecorisaralda@contacto.com" className="hover:text-slate-900">ecorisaralda@contacto.com</a></li>
                <li><a href="#" className="hover:text-slate-900">300 445 80055</a></li>
                <li><a href="#" className="hover:text-slate-900">Preguntas</a></li>
              </ul>
            </div>
          </div>

          <div className="mt-12 border-t border-emerald-100 pt-6 text-center text-sm text-slate-600">
            <p className="mb-2"><em>Conectando viajeros con la naturaleza. Explora, guarda y comparte experiencias únicas.</em></p>
            <p>© 2025 Conexión EcoRisaralda – Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default HomePage;
