import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebook, faLinkedin, faYoutube, faInstagram } from '@fortawesome/free-brands-svg-icons';

function HomePage({ onNavigateLogin, onNavigateRegister, onNavigateColeccion, onNavigateOferta, onNavigatePrivacidad, onNavigateSobreNosotros }) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);

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
    setEventosIndex(index);
    clearInterval(eventosTimer);
    const timer = setInterval(() => {
      setEventosIndex((prev) => (prev + 1) % eventos.length);
    }, 5000);
    setEventosTimer(timer);
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setEventosIndex((prev) => (prev + 1) % eventos.length);
    }, 5000);
    setEventosTimer(timer);
    return () => clearInterval(timer);
  }, [eventos.length]);

  return (
    <div className="min-h-screen bg-white text-slate-900">
      {/* HEADER */}
      <header className="fixed top-0 z-50 w-full bg-white shadow-sm">
        <div className="flex items-center justify-between px-6 py-4 md:px-12">
          {/* Logo */}
          <a href="#" className="flex items-center gap-2">
            <img src="/images/Pagina_inicio/nature-svgrepo-com.svg" alt="Logo" className="h-8 w-8" />
            <div>
              <h3 className="text-sm font-bold text-slate-900">Conexion</h3>
              <p className="text-xs text-slate-600">EcoRisaralda</p>
            </div>
          </a>

          {/* Center - Buscador */}
          <div className="hidden gap-4 md:flex">
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="flex items-center gap-2 text-slate-700 hover:text-[#267E1B]"
            >
              <img src="/images/Pagina_inicio/search-svgrepo-com.svg" alt="Buscar" className="h-5 w-5" />
              <span className="text-sm">Buscar</span>
            </button>
          </div>

          {/* Right - Botones */}
          <div className="flex items-center gap-4">
            <button
              onClick={onNavigateRegister}
              className="hidden h-10 rounded-lg border border-[#267E1B] px-4 text-sm font-semibold text-[#267E1B] transition hover:bg-[#267E1B] hover:text-white md:block"
            >
              Registrarse
            </button>
            <button
              onClick={onNavigateLogin}
              className="hidden h-10 rounded-lg bg-[#267E1B] px-4 text-sm font-semibold text-white transition hover:bg-[#1f6517] md:block"
            >
              Iniciar Sesion
            </button>

            {/* Dropdown */}
            <div className="relative md:hidden">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="h-10 w-10 rounded-lg hover:bg-slate-100"
              >
                <img src="/images/Pagina_inicio/img_drop_down.png" alt="Menu" className="mx-auto h-6 w-6" />
              </button>
              {dropdownOpen && (
                <div className="absolute right-0 top-12 w-48 rounded-lg border border-slate-200 bg-white shadow-lg">
                  <a href="#" className="block px-4 py-3 text-sm font-semibold text-[#267E1B] hover:bg-slate-100">
                    Inicio
                  </a>
                  <a href="#" className="block px-4 py-3 text-sm font-semibold text-[#267E1B] hover:bg-slate-100">
                    Coleccion
                  </a>
                  <a href="#" className="block px-4 py-3 text-sm font-semibold text-[#267E1B] hover:bg-slate-100">
                    Acerca Nosotros
                  </a>
                  <div className="border-t border-slate-200 px-4 py-3">
                    <button
                      onClick={onNavigateRegister}
                      className="mb-2 w-full rounded-lg bg-[#267E1B] py-2 text-sm font-semibold text-white"
                    >
                      Registrarse
                    </button>
                    <button
                      onClick={onNavigateLogin}
                      className="w-full rounded-lg border border-[#267E1B] py-2 text-sm font-semibold text-[#267E1B]"
                    >
                      Iniciar Sesion
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Search Dropdown */}
        {searchOpen && (
          <div className="border-t border-slate-200 px-6 py-6">
            <input
              type="text"
              placeholder="Escribe tu búsqueda..."
              className="w-full rounded-lg border-2 border-[#267E1B] px-4 py-3 text-base text-slate-800 outline-none"
            />
          </div>
        )}
      </header>

      {/* Back to top button */}
      {scrollY > 100 && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-6 right-6 z-40 rounded-full bg-white p-3 shadow-lg transition hover:scale-110"
        >
          <img src="/images/Coleccion_sitios_ecoturisticos/arrow-up2.svg" alt="Arriba" className="h-6 w-6" />
        </button>
      )}

      <main className="pt-20">
        {/* SECCION 01 - HERO */}
        <section className="h-96 w-full bg-cover bg-center" style={{ backgroundImage: 'linear-gradient(to right, white 28%, rgba(255, 255, 255, 0) 80%), url(/images/Pagina_inicio/ecoturismo.jpg)' }}>
          <div className="flex h-full flex-col justify-center gap-6 pl-12">
            <div>
              <h1 className="text-5xl font-semibold text-slate-900">Descubre los mejores</h1>
              <h1 className="text-5xl font-semibold text-slate-900">
                sitios <span className="font-black text-[#267E1B]">ecoturisticos</span>
              </h1>
            </div>
            <p className="max-w-lg text-xl text-slate-700">
              Explora rutas y lugares unicos donde disfrutar de la naturaleza de manera sostenible.¡Tu proxima aventura verde te espera!
            </p>
            <button onClick={onNavigateColeccion} className="w-fit rounded-lg bg-[#3c8428] px-7 py-3 text-xl font-semibold text-white transition hover:bg-white hover:text-[#267E1B] hover:outline hover:outline-[#267E1B]">
              Ver más
            </button>
          </div>
        </section>

        {/* SECCION 02 - POPULARES */}
        <section className="w-full py-20">
          <div className="mx-auto max-w-7xl">
            <div className="mb-12 text-center">
              <h2 className="text-3xl font-semibold text-slate-900">¡Mantente al día con los sitios más populares y eventos</h2>
              <p className="mt-2 text-xl text-slate-700">siempre actualizados!</p>
            </div>

            <div className="flex flex-col gap-8 lg:flex-row lg:gap-12">
              {/* Carousel */}
              <div className="flex-1">
                <div className="relative overflow-hidden">
                  <div className="mb-4 flex gap-2">
                    <button
                      onClick={handlePopularesPrev}
                      disabled={!canGoPrev}
                      className="text-3xl font-bold text-[#208114] disabled:opacity-50"
                    >
                      ‹
                    </button>
                    <button
                      onClick={handlePopularesNext}
                      disabled={!canGoNext}
                      className="text-3xl font-bold text-[#208114] disabled:opacity-50"
                    >
                      ›
                    </button>
                  </div>
                  <div className="flex gap-4 transition-transform duration-700" style={{ transform: `translateX(-${populareIndex * (100 / visibleItems)}%)` }}>
                    {sitios.map((sitio) => (
                      <div key={sitio.id} className="min-w-[calc(100%/3)] flex-shrink-0">
                        <img src={sitio.image} alt={sitio.title} className="h-72 w-full rounded-lg object-cover" />
                        <h5 className="mt-3 font-bold text-slate-900">{sitio.title}</h5>
                        <p className="text-sm text-slate-600">{sitio.location}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right text */}
              <div className="flex flex-1 flex-col justify-start gap-6 pt-6 lg:pt-0">
                <h2 className="text-4xl font-bold">
                  Más <span className="text-[#267E1B]">Populares</span>
                </h2>
                <p className="text-lg text-slate-700">
                  Descubre los sitios Ecoturisticos más populares y vive la naturaleza en su maxima expresion
                </p>
                <a href="#" className="w-fit rounded-lg bg-[#267E1B] px-8 py-3 font-semibold text-white transition hover:bg-[#1f6517]">
                  Más informacion
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* SECCION 03 - EVENTOS */}
        <section className="w-full bg-slate-900 py-20">
          <div className="mx-auto max-w-7xl px-6">
            <h3 className="mb-12 text-center text-2xl font-semibold text-white underline">EVENTOS</h3>
            <div className="relative h-80 overflow-hidden rounded-lg">
              {eventos.map((evento, idx) => (
                <div
                  key={evento.id}
                  className={`absolute inset-0 flex flex-col items-center justify-center bg-cover bg-center transition-opacity duration-700 ${
                    idx === eventosIndex ? 'opacity-100' : 'opacity-0'
                  }`}
                  style={{
                    backgroundImage: `linear-gradient(rgba(0,0,0,0.516), rgba(0,0,0,0.505)), ${evento.image}`,
                  }}
                >
                  <h1 className="text-5xl font-bold text-white">{evento.title}</h1>
                  <button className="mt-8 rounded-lg border-3 border-white px-6 py-3 font-semibold text-white transition hover:bg-white hover:text-black">
                    Más informacion
                  </button>
                </div>
              ))}

              {/* Flechas navegación */}
              <button
                onClick={() => handleEventosChange((eventosIndex - 1 + eventos.length) % eventos.length)}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-6xl font-bold text-white opacity-50 hover:opacity-100"
              >
                ‹
              </button>
              <button
                onClick={() => handleEventosChange((eventosIndex + 1) % eventos.length)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-6xl font-bold text-white opacity-50 hover:opacity-100"
              >
                ›
              </button>

              {/* Dots */}
              <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-3">
                {eventos.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleEventosChange(idx)}
                    className={`h-3 w-3 rounded-full transition ${idx === eventosIndex ? 'bg-white' : 'bg-white/50'}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* SECCION 04 - BENEFICIOS */}
        <section className="w-full py-20">
          <div className="mx-auto max-w-7xl px-6">
            <h2 className="mb-16 text-center text-3xl font-semibold text-slate-900">Descubre todos los beneficios</h2>
            <div className="grid gap-12 sm:grid-cols-3 md:gap-24">
              {beneficios.map((beneficio) => (
                <div key={beneficio.id} className="flex flex-col items-center gap-6 text-center">
                  <img src={beneficio.image} alt={beneficio.title} className="h-24 w-24" />
                  <p className="text-lg text-slate-700">{beneficio.title}</p>
                </div>
              ))}
            </div>
            <div className="mt-12 flex justify-center">
              <button onClick={onNavigateOferta} className="rounded-lg bg-[#3c8428] px-8 py-3 font-semibold text-white transition hover:bg-white hover:text-[#267E1B] hover:outline hover:outline-[#267E1B]">
                  Leer más
                </button>
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="border-t border-[#267E1B] bg-slate-200 py-12">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {/* Col 1 */}
            <div>
              <h3 className="mb-2 text-lg font-bold text-slate-900">Conexion</h3>
              <p className="mb-4 text-sm text-slate-700">EcoRisaralda</p>
              <div className="flex gap-4 text-lg text-[#4caf50]">
                <a href="#"><FontAwesomeIcon icon={faFacebook} /></a>
                <a href="#"><FontAwesomeIcon icon={faLinkedin} /></a>
                <a href="#"><FontAwesomeIcon icon={faYoutube} /></a>
                <a href="#"><FontAwesomeIcon icon={faInstagram} /></a>
              </div>
              <div className="mt-4 text-sm">
                🌐
                <select className="ml-2 rounded px-2 py-1">
                  <option>Español</option>
                  <option>English</option>
                </select>
              </div>
            </div>

            {/* Col 2 */}
            <div>
              <h4 className="mb-4 font-bold text-slate-900">Información</h4>
              <ul className="space-y-2 text-sm text-slate-700">
                <li><a href="#" className="hover:underline">Conexión EcoRisaralda</a></li>
                <li><a href="#" className="hover:underline">Descripcion</a></li>
                <li><a href="#" className="hover:underline">Lema</a></li>
              </ul>
            </div>

            {/* Col 3 */}
            <div>
              <h4 className="mb-4 font-bold text-slate-900">Navegación rápida</h4>
              <ul className="space-y-2 text-sm text-slate-700">
                <li><a href="#" className="hover:underline">Inicio</a></li>
                <li><button onClick={onNavigateSobreNosotros} className="hover:underline text-left">Sobre nosotros</button></li>
                <li><button onClick={onNavigatePrivacidad} className="hover:underline text-left">Políticas</button></li>
              </ul>
            </div>

            {/* Col 4 */}
            <div>
              <h4 className="mb-4 font-bold text-slate-900">Contacto y soporte</h4>
              <ul className="space-y-2 text-sm text-slate-700">
                <li><a href="mailto:ecorisaralda@contacto.com" className="hover:underline">ecorisaralda@contacto.com</a></li>
                <li><a href="#" className="hover:underline">300 445 80055</a></li>
                <li><a href="#" className="hover:underline">Preguntas</a></li>
              </ul>
            </div>
          </div>

          <div className="mt-12 border-t border-slate-300 pt-6 text-center text-sm text-slate-600">
            <p className="mb-2"><em>Conectando viajeros con la naturaleza. Explora, guarda y comparte experiencias únicas.</em></p>
            <p>© 2025 Conexión EcoRisaralda – Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default HomePage;
