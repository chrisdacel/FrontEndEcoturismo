import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebook, faLinkedin, faYoutube, faInstagram } from '@fortawesome/free-brands-svg-icons';

export default function ColeccionPageOperador({ userName = "Jane Mar", onNavigateHome, onNavigateSobreNosotros, onNavigatePrivacidad, onNavigateSitio }) {
  const [scrollToTop, setScrollToTop] = useState(false);
  const [carouselIndex, setCarouselIndex] = useState([0, 0, 0]);
  const [searchText, setSearchText] = useState('');

  const sitios = [
    { id: 1, nombre: "Nevado del Tolima", municipio: "Municipio de Santa Isabel", imagen: "/images/Coleccion_sitios_ecoturisticos/paisaje_01.jpeg" },
    { id: 2, nombre: "Laguna del Otún", municipio: "Municipio de Pereira", imagen: "/images/Coleccion_sitios_ecoturisticos/paisaje_02.jpeg" },
    { id: 3, nombre: "Termales de Santa Rosa", municipio: "Municipio de Santa Rosa de Cabal", imagen: "/images/Coleccion_sitios_ecoturisticos/paisaje_03.jpeg" },
    { id: 4, nombre: "Parque Natural Ucumarí", municipio: "Municipio de Pereira", imagen: "/images/Coleccion_sitios_ecoturisticos/paisaje_04.jpeg" }
  ];

  const recomendaciones = [
    { id: 1, nombre: "Cascada del Fraile", descripcion: "Belleza natural impresionante", imagen: "/images/Coleccion_sitios_ecoturisticos/paisaje_01.jpeg" },
    { id: 2, nombre: "Reserva Natural Barbas Bremen", descripcion: "Biodiversidad única", imagen: "/images/Coleccion_sitios_ecoturisticos/paisaje_02.jpeg" },
    { id: 3, nombre: "Bioparque Ukumarí", descripcion: "Experiencia educativa", imagen: "/images/Coleccion_sitios_ecoturisticos/paisaje_03.jpeg" },
    { id: 4, nombre: "Alto del Nudo", descripcion: "Vistas panorámicas", imagen: "/images/Coleccion_sitios_ecoturisticos/paisaje_04.jpeg" }
  ];

  useEffect(() => {
    const handleScroll = () => {
      setScrollToTop(window.scrollY > 100);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePrevCarousel = (carouselIdx) => {
    setCarouselIndex((prev) => {
      const newIndex = [...prev];
      newIndex[carouselIdx] = Math.max(0, newIndex[carouselIdx] - 1);
      return newIndex;
    });
  };

  const handleNextCarousel = (carouselIdx) => {
    setCarouselIndex((prev) => {
      const newIndex = [...prev];
      newIndex[carouselIdx] = Math.min(sitios.length - 4, newIndex[carouselIdx] + 1);
      return newIndex;
    });
  };

  return (
    <div className="flex min-h-screen flex-col coleccion-shell text-slate-900">
      {/* Header */}
      <header className="fixed top-0 z-50 w-full bg-white shadow-md">
        <div className="flex items-center justify-between px-6 py-4 md:px-12">
          <button onClick={onNavigateHome} className="flex items-center gap-2 hover:opacity-80">
            <img src="/images/Pagina_inicio/nature-svgrepo-com.svg" alt="Logo" className="h-8 w-8" />
            <div>
              <h3 className="text-sm font-bold">Conexion</h3>
              <p className="text-xs text-slate-600">EcoRisaralda</p>
              <p className="text-xs font-semibold text-[#267E1B]">OPERADOR</p>
            </div>
          </button>

          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100">
              <img src="/images/Coleccion_sitios_ecoturisticos/user.svg" alt="Usuario" className="h-6 w-6" />
              <span className="text-sm font-medium">{userName}</span>
            </div>

            <button className="hidden md:block">
              <img src="/images/Coleccion_sitios_ecoturisticos/favourites.png" alt="Favoritos" className="h-6 w-6" />
            </button>

            <button className="md:hidden">
              <img src="/images/Pagina_inicio/img_drop_down.png" alt="Menu" className="h-8 w-8" />
            </button>
          </div>
        </div>
      </header>

      {/* Scroll to Top Button */}
      {scrollToTop && (
        <button
          onClick={scrollTop}
          className="fixed bottom-5 right-5 z-50 rounded-full bg-white shadow-lg transition hover:scale-110 md:right-0"
          title="Volver arriba"
        >
          <img src="/images/Coleccion_sitios_ecoturisticos/arrow-up2.svg" alt="Arriba" className="h-12 w-12" />
        </button>
      )}

      {/* Main Content */}
      <main className="mt-16">
        {/* Hero Section with Search */}
        <section className="coleccion-hero relative h-[500px] bg-cover bg-center" style={{ backgroundImage: "url('/images/Pagina_inicio/ecoturismo.jpg')" }}>
          <div className="absolute inset-0 bg-black/40"></div>
          <div className="relative flex h-full flex-col items-center justify-center px-8 text-white">
            <h1 className="mb-8 text-center text-4xl font-bold md:text-5xl">Conoce los mejores destinos turísticos en un clic</h1>
            <div className="w-full max-w-2xl">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  placeholder="Buscar destino..."
                  className="coleccion-pill-input flex-1 rounded-lg border-2 border-white bg-white/90 px-6 py-3 text-slate-900 outline-none focus:border-[#267E1B]"
                />
                <button className="rounded-lg bg-[#267E1B] px-8 py-3 font-semibold transition hover:bg-[#1d5f14]">
                  Buscar
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Carousel 1 */}
        <section className="bg-white px-8 py-16 md:px-20">
          <h2 className="mb-8 text-3xl font-bold text-[#267E1B]">Destinos Populares</h2>
          
          <div className="relative">
            <div className="overflow-hidden">
              <div className="flex transition-transform duration-500 ease-in-out" style={{ transform: `translateX(-${carouselIndex[0] * 25}%)` }}>
                {sitios.map((sitio) => (
                  <div key={sitio.id} className="min-w-[25%] px-2">
                    <button
                      onClick={onNavigateSitio}
                      className="coleccion-card w-full overflow-hidden bg-white transition hover:shadow-xl"
                    >
                      <div className="h-48 bg-gray-300 bg-cover bg-center" style={{ backgroundImage: `url('${sitio.imagen}')` }}></div>
                      <div className="p-4">
                        <h3 className="mb-2 text-lg font-bold text-[#267E1B]">{sitio.nombre}</h3>
                        <p className="text-sm text-gray-600">{sitio.municipio}</p>
                      </div>
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={() => handlePrevCarousel(0)}
              disabled={carouselIndex[0] === 0}
              className="coleccion-carousel-nav absolute left-0 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-3 shadow-lg hover:bg-white"
            >
              <span className="text-3xl text-[#267E1B]">‹</span>
            </button>
            <button
              onClick={() => handleNextCarousel(0)}
              disabled={carouselIndex[0] >= sitios.length - 4}
              className="coleccion-carousel-nav absolute right-0 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-3 shadow-lg hover:bg-white"
            >
              <span className="text-3xl text-[#267E1B]">›</span>
            </button>
          </div>
        </section>

        {/* Carousel 2 */}
        <section className="bg-gray-50 px-8 py-16 md:px-20">
          <h2 className="mb-8 text-3xl font-bold text-[#267E1B]">Reservas Naturales</h2>
          
          <div className="relative">
            <div className="overflow-hidden">
              <div className="flex transition-transform duration-500 ease-in-out" style={{ transform: `translateX(-${carouselIndex[1] * 25}%)` }}>
                {sitios.map((sitio) => (
                  <div key={sitio.id} className="min-w-[25%] px-2">
                    <button
                      onClick={onNavigateSitio}
                      className="coleccion-card w-full overflow-hidden bg-white transition hover:shadow-xl"
                    >
                      <div className="h-48 bg-gray-300 bg-cover bg-center" style={{ backgroundImage: `url('${sitio.imagen}')` }}></div>
                      <div className="p-4">
                        <h3 className="mb-2 text-lg font-bold text-[#267E1B]">{sitio.nombre}</h3>
                        <p className="text-sm text-gray-600">{sitio.municipio}</p>
                      </div>
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={() => handlePrevCarousel(1)}
              disabled={carouselIndex[1] === 0}
              className="coleccion-carousel-nav absolute left-0 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-3 shadow-lg hover:bg-white"
            >
              <span className="text-3xl text-[#267E1B]">‹</span>
            </button>
            <button
              onClick={() => handleNextCarousel(1)}
              disabled={carouselIndex[1] >= sitios.length - 4}
              className="coleccion-carousel-nav absolute right-0 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-3 shadow-lg hover:bg-white"
            >
              <span className="text-3xl text-[#267E1B]">›</span>
            </button>
          </div>
        </section>

        {/* Carousel 3 */}
        <section className="bg-white px-8 py-16 md:px-20">
          <h2 className="mb-8 text-3xl font-bold text-[#267E1B]">Cascadas y Ríos</h2>
          
          <div className="relative">
            <div className="overflow-hidden">
              <div className="flex transition-transform duration-500 ease-in-out" style={{ transform: `translateX(-${carouselIndex[2] * 25}%)` }}>
                {sitios.map((sitio) => (
                  <div key={sitio.id} className="min-w-[25%] px-2">
                    <button
                      onClick={onNavigateSitio}
                      className="coleccion-card w-full overflow-hidden bg-white transition hover:shadow-xl"
                    >
                      <div className="h-48 bg-gray-300 bg-cover bg-center" style={{ backgroundImage: `url('${sitio.imagen}')` }}></div>
                      <div className="p-4">
                        <h3 className="mb-2 text-lg font-bold text-[#267E1B]">{sitio.nombre}</h3>
                        <p className="text-sm text-gray-600">{sitio.municipio}</p>
                      </div>
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={() => handlePrevCarousel(2)}
              disabled={carouselIndex[2] === 0}
              className="coleccion-carousel-nav absolute left-0 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-3 shadow-lg hover:bg-white"
            >
              <span className="text-3xl text-[#267E1B]">‹</span>
            </button>
            <button
              onClick={() => handleNextCarousel(2)}
              disabled={carouselIndex[2] >= sitios.length - 4}
              className="coleccion-carousel-nav absolute right-0 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-3 shadow-lg hover:bg-white"
            >
              <span className="text-3xl text-[#267E1B]">›</span>
            </button>
          </div>
        </section>

        {/* Recomendaciones */}
        <section className="bg-gray-50 px-8 py-16 md:px-20">
          <h1 className="mb-12 text-center text-4xl font-bold text-[#267E1B]">Recomendaciones</h1>

          <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {recomendaciones.map((recomendacion) => (
              <button
                key={recomendacion.id}
                onClick={onNavigateSitio}
                className="coleccion-reco-card group relative overflow-hidden shadow-lg transition hover:shadow-2xl"
              >
                <div className="h-64 bg-cover bg-center" style={{ backgroundImage: `url('${recomendacion.imagen}')` }}></div>
                <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 transition-opacity group-hover:opacity-100"></div>
                <div className="absolute bottom-0 left-0 right-0 z-20 translate-y-full p-6 text-white transition-transform group-hover:translate-y-0">
                  <h3 className="mb-2 text-xl font-bold">{recomendacion.nombre}</h3>
                  <p className="text-sm">{recomendacion.descripcion}</p>
                </div>
              </button>
            ))}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="coleccion-footer border-t border-[#267E1B] bg-gray-200 px-6 py-12 md:px-12">
        <div className="mb-8 grid grid-cols-1 gap-8 md:grid-cols-4">
          <div>
            <h2 className="mb-1 text-xl font-bold text-slate-900">Conexion</h2>
            <p className="mb-4 text-sm text-gray-700">EcoRisaralda</p>
            <div className="flex gap-4 text-lg text-[#4caf50]">
              <a href="#" className="transition hover:scale-125"><FontAwesomeIcon icon={faFacebook} /></a>
              <a href="#" className="transition hover:scale-125"><FontAwesomeIcon icon={faLinkedin} /></a>
              <a href="#" className="transition hover:scale-125"><FontAwesomeIcon icon={faYoutube} /></a>
              <a href="#" className="transition hover:scale-125"><FontAwesomeIcon icon={faInstagram} /></a>
            </div>
            <div className="mt-4 flex items-center gap-2">
              <span>🌐</span>
              <select className="rounded border px-2 py-1 text-sm">
                <option>Español</option>
                <option>English</option>
              </select>
            </div>
          </div>

          <div>
            <h4 className="mb-3 font-bold text-slate-900">Información</h4>
            <ul className="space-y-2 text-sm text-gray-700">
              <li><a href="#" onClick={onNavigateHome} className="hover:underline">Conexión EcoRisaralda</a></li>
              <li><a href="#" onClick={onNavigateHome} className="hover:underline">Descripción</a></li>
              <li><a href="#" onClick={onNavigateHome} className="hover:underline">Lema</a></li>
            </ul>
          </div>

          <div>
            <h4 className="mb-3 font-bold text-slate-900">Navegación rápida</h4>
            <ul className="space-y-2 text-sm text-gray-700">
              <li><a href="#" onClick={onNavigateHome} className="hover:underline">Inicio</a></li>
              <li><button onClick={onNavigateSobreNosotros} className="hover:underline text-left">Sobre nosotros</button></li>
              <li><button onClick={onNavigatePrivacidad} className="hover:underline text-left">Políticas</button></li>
            </ul>
          </div>

          <div>
            <h4 className="mb-3 font-bold text-slate-900">Contacto y soporte</h4>
            <ul className="space-y-2 text-sm text-gray-700">
              <li><a href="mailto:ecorisaralda@contacto.com" className="hover:underline">ecorisaralda@contacto.com</a></li>
              <li><a href="#" className="hover:underline">300 445 80055</a></li>
              <li><a href="#" className="hover:underline">Preguntas</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-400 pt-6 text-center text-sm text-gray-700">
          <p className="mb-2"><em>Conectando viajeros con la naturaleza. Explora, guarda y comparte experiencias únicas.</em></p>
          <p>© 2025 Conexión EcoRisaralda – Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  );
}
