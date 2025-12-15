import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebook, faLinkedin, faYoutube, faInstagram } from '@fortawesome/free-brands-svg-icons';

export default function ColeccionPage({ onNavigateHome, onNavigateLogin, onNavigatePrivacidad, onNavigateSobreNosotros }) {
  const [scrollToTop, setScrollToTop] = useState(false);
  const [carouselIndex, setCarouselIndex] = useState([0, 0, 0]);

  // Datos de sitios
  const sitios = [
    {
      id: 1,
      nombre: 'Santuario Fauna Flora Otún',
      ubicacion: 'Via Pereira- La virginia',
      imagen: '/images/Pagina_inicio/Santuario-Fauna-Flora-Otun-Quimbaya-Ucumari-13.jpg',
    },
    {
      id: 2,
      nombre: 'Parque Nacional Natural Los Nevados',
      ubicacion: 'Municipio de Santa Rosa de Cabal',
      imagen: '/images/Pagina_inicio/Nevado-del-Tolima-WalterV-1024x683.jpeg',
    },
    {
      id: 3,
      nombre: 'Termales de Santa Rosa',
      ubicacion: 'Santa Rosa de Cabal',
      imagen: '/images/Pagina_inicio/photo-1532185922611-3410b1898a1c.jpg',
    },
    {
      id: 4,
      nombre: 'Valle del Cocora',
      ubicacion: 'Salento, Quindío',
      imagen: '/images/Pagina_inicio/Nevado-del-Tolima-WalterV-1024x683.jpeg',
    },
    {
      id: 5,
      nombre: 'Guásimo Natural Park',
      ubicacion: 'Circasia',
      imagen: '/images/Pagina_inicio/guasimo.jpg',
    },
  ];

  const recomendaciones = [
    {
      id: 1,
      nombre: 'Ecoturismo en Risaralda',
      imagen: '/images/Pagina_inicio/Santuario-Fauna-Flora-Otun-Quimbaya-Ucumari-13.jpg',
    },
    {
      id: 2,
      nombre: 'Aventura en la Naturaleza',
      imagen: '/images/Pagina_inicio/Nevado-del-Tolima-WalterV-1024x683.jpeg',
    },
    {
      id: 3,
      nombre: 'Paisajes Naturales',
      imagen: '/images/Pagina_inicio/photo-1532185922611-3410b1898a1c.jpg',
    },
    {
      id: 4,
      nombre: 'Experiencia Única',
      imagen: '/images/Pagina_inicio/guasimo.jpg',
    },
  ];

  // Scroll to top button
  useEffect(() => {
    const handleScroll = () => {
      setScrollToTop(window.scrollY > 100);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTopHandler = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCarouselNext = (index) => {
    const newIndices = [...carouselIndex];
    if (newIndices[index] < sitios.length - 4) {
      newIndices[index]++;
      setCarouselIndex(newIndices);
    }
  };

  const handleCarouselPrev = (index) => {
    const newIndices = [...carouselIndex];
    if (newIndices[index] > 0) {
      newIndices[index]--;
      setCarouselIndex(newIndices);
    }
  };

  return (
    <div className="min-h-screen bg-white text-slate-900">
      {/* Header */}
      <header className="fixed top-0 z-50 w-full bg-white shadow-sm">
        <div className="flex items-center justify-between px-6 py-4 md:px-12">
          <button onClick={onNavigateHome} className="flex items-center gap-2 hover:opacity-80">
            <img src="/images/Pagina_inicio/nature-svgrepo-com.svg" alt="Logo" className="h-8 w-8" />
            <div>
              <h3 className="text-sm font-bold text-slate-900">Conexion</h3>
              <p className="text-xs text-slate-600">EcoRisaralda</p>
            </div>
          </button>

          <div className="flex items-center gap-4">
            <button
              onClick={onNavigateHome}
              className="hidden h-10 rounded-lg bg-[#267E1B] px-6 text-sm font-semibold text-white transition hover:bg-[#1f6517] md:block"
            >
              Registrarse
            </button>
            <button
              onClick={onNavigateLogin}
              className="hidden h-10 rounded-lg border-2 border-[#267E1B] px-6 text-sm font-semibold text-[#267E1B] transition hover:bg-[#267E1B] hover:text-white md:block"
            >
              Iniciar Sesión
            </button>

            {/* Mobile Menu */}
            <button className="md:hidden">
              <img src="/images/Pagina_inicio/img_drop_down.png" alt="Menu" className="h-8 w-8" />
            </button>
          </div>
        </div>
      </header>

      {/* Scroll to Top Button */}
      {scrollToTop && (
        <button
          onClick={scrollToTopHandler}
          className="fixed bottom-5 right-5 z-50 rounded-full bg-white p-2 shadow-lg hover:scale-110 transition-transform"
        >
          <img src="/images/Coleccion_sitios_ecoturisticos/arrow-up2.svg" alt="Subir" className="h-8 w-8" />
        </button>
      )}

      <main className="pt-20">
        {/* Sección 1: Carrusel Principal */}
        <section className="w-full bg-white py-20">
          <div className="flex flex-col gap-12 md:flex-row md:items-center md:gap-8 px-6 md:px-12">
            {/* Izquierda: Imágenes */}
            <div className="flex-1 flex justify-center items-center gap-4">
              <img
                src={sitios[0].imagen}
                alt="Principal"
                className="h-96 w-56 rounded-lg object-cover shadow-lg"
              />
            </div>

            {/* Derecha: Título y Buscador */}
            <div className="flex-1 flex flex-col items-center gap-8">
              <div className="text-center">
                <h1 className="text-4xl md:text-5xl font-bold text-[#267E1B] mb-4">
                  Conoce los mejores destinos
                </h1>
                <h1 className="text-4xl md:text-5xl font-bold text-[#267E1B]">
                  turísticos en un clic
                </h1>
              </div>

              <div className="relative w-full max-w-md">
                <input
                  type="text"
                  placeholder="Buscar en EcoRisaralda..."
                  className="w-full rounded-full border-2 border-[#267E1B] px-6 py-3 focus:outline-none focus:ring-2 focus:ring-[#267E1B]"
                />
                <img
                  src="/images/Pagina_inicio/search-svgrepo-com.svg"
                  alt="Buscar"
                  className="absolute right-4 top-1/2 h-6 w-6 -translate-y-1/2"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Sección 2: Carruseles de Sitios */}
        <section className="w-full bg-white py-16 px-6 md:px-12">
          {[0, 1, 2].map((carouselNum) => (
            <div key={carouselNum} className="mb-12">
              <div className="relative flex items-center gap-4">
                {/* Botón Anterior */}
                <button
                  onClick={() => handleCarouselPrev(carouselNum)}
                  disabled={carouselIndex[carouselNum] === 0}
                  className="text-3xl font-bold text-[#267E1B] hover:scale-125 transition disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  ‹
                </button>

                {/* Carrusel */}
                <div className="flex-1 overflow-hidden">
                  <div className="flex gap-4 transition-transform duration-500"
                    style={{
                      transform: `translateX(-${carouselIndex[carouselNum] * (100 / 4)}%)`,
                    }}
                  >
                    {sitios.map((sitio) => (
                      <div
                        key={sitio.id}
                        className="flex-shrink-0 w-1/4 flex flex-col gap-2"
                      >
                        <img
                          src={sitio.imagen}
                          alt={sitio.nombre}
                          className="h-48 w-full rounded-lg object-cover"
                        />
                        <h5 className="font-bold text-slate-900 text-sm">{sitio.nombre}</h5>
                        <p className="text-xs text-gray-600">{sitio.ubicacion}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Botón Siguiente */}
                <button
                  onClick={() => handleCarouselNext(carouselNum)}
                  disabled={carouselIndex[carouselNum] >= sitios.length - 4}
                  className="text-3xl font-bold text-[#267E1B] hover:scale-125 transition disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  ›
                </button>
              </div>
            </div>
          ))}
        </section>

        {/* Sección 3: Recomendaciones */}
        <section className="w-full bg-white py-16 px-6 md:px-12 mb-20">
          <h2 className="mb-12 text-center text-3xl font-bold">Recomendaciones</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {recomendaciones.map((rec) => (
              <div key={rec.id} className="group relative cursor-pointer">
                <img
                  src={rec.imagen}
                  alt={rec.nombre}
                  className="h-80 w-full rounded-lg object-cover shadow-lg"
                />
                {/* Overlay */}
                <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-black/60 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  <div className="text-center text-white">
                    <h4 className="text-xl font-bold mb-2">{rec.nombre}</h4>
                    <p className="text-sm">Explora este destino increíble</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-[#267E1B] bg-gray-200 px-6 py-12 md:px-12">
        <div className="mb-8 grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* Columna 1 */}
          <div>
            <h2 className="mb-2 text-xl font-bold text-slate-900">Conexion</h2>
            <p className="mb-4 text-sm text-gray-700">EcoRisaralda</p>
            <div className="flex gap-4 text-lg text-[#267E1B]">
              <a href="#" className="hover:scale-125 transition">
                <FontAwesomeIcon icon={faFacebook} />
              </a>
              <a href="#" className="hover:scale-125 transition">
                <FontAwesomeIcon icon={faLinkedin} />
              </a>
              <a href="#" className="hover:scale-125 transition">
                <FontAwesomeIcon icon={faYoutube} />
              </a>
              <a href="#" className="hover:scale-125 transition">
                <FontAwesomeIcon icon={faInstagram} />
              </a>
            </div>
            <div className="mt-4">
              <span className="mr-2">🌐</span>
              <select className="rounded border px-2 py-1">
                <option>Español</option>
                <option>English</option>
              </select>
            </div>
          </div>

          {/* Columna 2 */}
          <div>
            <h4 className="mb-4 font-bold text-slate-900">Información</h4>
            <ul className="space-y-2 text-sm text-gray-700">
              <li><a href="#" className="hover:underline">Conexión EcoRisaralda</a></li>
              <li><a href="#" className="hover:underline">Descripción</a></li>
              <li><a href="#" className="hover:underline">Lema</a></li>
            </ul>
          </div>

          {/* Columna 3 */}
          <div>
            <h4 className="mb-4 font-bold text-slate-900">Navegación rápida</h4>
            <ul className="space-y-2 text-sm text-gray-700">
              <li><a href="#" onClick={onNavigateHome} className="hover:underline">Inicio</a></li>
              <li><button onClick={onNavigateSobreNosotros} className="hover:underline text-left">Sobre nosotros</button></li>
              <li><button onClick={onNavigatePrivacidad} className="hover:underline text-left">Políticas</button></li>
            </ul>
          </div>

          {/* Columna 4 */}
          <div>
            <h4 className="mb-4 font-bold text-slate-900">Contacto y soporte</h4>
            <ul className="space-y-2 text-sm text-gray-700">
              <li><a href="mailto:ecorisaralda@contacto.com" className="hover:underline">ecorisaralda@contacto.com</a></li>
              <li><a href="#" className="hover:underline">300 445 80055</a></li>
              <li><a href="#" className="hover:underline">Preguntas</a></li>
            </ul>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="border-t border-gray-400 pt-6 text-center text-sm text-gray-700">
          <p className="mb-2"><em>Conectando viajeros con la naturaleza. Explora, guarda y comparte experiencias únicas.</em></p>
          <p>© 2025 Conexión EcoRisaralda – Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  );
}
