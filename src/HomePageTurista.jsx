import React, { useState, useEffect } from 'react';

export default function HomePageTurista({ 
  userName = "Jane Mar",
  onNavigateColeccion,
  onNavigateSobreNosotros,
  onNavigatePrivacidad,
  onNavigateOferta
}) {
  const [searchOpen, setSearchOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [popularesIndex, setPopularesIndex] = useState(0);
  const [eventosIndex, setEventosIndex] = useState(0);

  // Scroll event listener
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
      setShowScrollTop(window.scrollY > 300);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Auto-play populares carousel
  useEffect(() => {
    const timer = setInterval(() => {
      setPopularesIndex((prev) => (prev + 1) % 10);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  // Auto-play eventos carousel
  useEffect(() => {
    const timer = setInterval(() => {
      setEventosIndex((prev) => (prev + 1) % 5);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const popularesData = [
    { img: '/images/Pagina_inicio/Paisaje_1.jpg', title: 'Santuario Otún Quimbaya', location: 'Municipio de Santa Rosa de Cabal' },
    { img: '/images/Pagina_inicio/Paisaje_2.jpg', title: 'Cascadas de Santa Rosa', location: 'Municipio de Santa Rosa de Cabal' },
    { img: '/images/Pagina_inicio/Paisaje_3.jpg', title: 'Parque Natural La Marcada', location: 'Municipio de Dosquebradas' },
    { img: '/images/Pagina_inicio/Paisaje_4.jpg', title: 'Termales Santa Rosa', location: 'Municipio de Santa Rosa de Cabal' },
    { img: '/images/Pagina_inicio/Paisaje_5.jpg', title: 'Laguna del Otún', location: 'Municipio de Pereira' },
    { img: '/images/Pagina_inicio/Paisaje_6.jpg', title: 'Cascada del Amor', location: 'Municipio de Marsella' },
    { img: '/images/Pagina_inicio/Paisaje_7.jpg', title: 'Parque Ucumarí', location: 'Municipio de Pereira' },
    { img: '/images/Pagina_inicio/Paisaje_8.jpg', title: 'Reserva Natural Bremen', location: 'Municipio de Filandia' },
    { img: '/images/Pagina_inicio/Paisaje_9.jpg', title: 'Nevado del Ruiz', location: 'Municipio de Villa María' },
    { img: '/images/Pagina_inicio/Paisaje_10.jpg', title: 'Santuario de Flora y Fauna', location: 'Municipio de Apia' }
  ];

  const eventosData = [
    { img: '/images/Pagina_inicio/evento_1.jpg', title: 'Festival de Aves' },
    { img: '/images/Pagina_inicio/evento_2.jpg', title: 'Caminata Ecológica' },
    { img: '/images/Pagina_inicio/evento_3.jpg', title: 'Día del Medio Ambiente' },
    { img: '/images/Pagina_inicio/evento_4.jpg', title: 'Tour Nocturno' },
    { img: '/images/Pagina_inicio/evento_5.jpg', title: 'Avistamiento de Flora' }
  ];

  const getVisiblePopulares = () => {
    const visible = [];
    for (let i = 0; i < 3; i++) {
      visible.push(popularesData[(popularesIndex + i) % popularesData.length]);
    }
    return visible;
  };

  return (
    <div className="min-h-screen bg-white font-['Albert_Sans']">
      {/* Header */}
      <header className="bg-white shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <img src="/images/Pagina_inicio/nature-svgrepo-com.svg" alt="Logo" className="h-12 w-12" />
            <div className="flex flex-col leading-tight">
              <h3 className="text-lg font-bold text-gray-800">Conexion</h3>
              <h5 className="text-sm text-gray-600">EcoRisaralda</h5>
              <h6 className="text-xs text-green-600 font-semibold">USUARIO</h6>
            </div>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-4">
            {/* Search button */}
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="hidden md:flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-100 transition"
            >
              <img src="/images/roles/search-svgrepo-com.svg" alt="Buscar" className="h-5 w-5" />
              <span className="text-sm text-gray-700">Buscar</span>
            </button>

            {/* User display */}
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-50">
              <img src="/images/Coleccion_sitios_ecoturisticos/user.svg" alt="User" className="h-6 w-6" />
              <span className="text-sm font-medium text-gray-800">{userName}</span>
            </div>

            {/* Favorites icon */}
            <button className="p-2 hover:bg-gray-100 rounded-lg transition">
              <img src="/images/Coleccion_sitios_ecoturisticos/favourites.png" alt="Favoritos" className="h-6 w-6" />
            </button>

            {/* Dropdown menu */}
            <div className="md:hidden">
              <img src="/images/Pagina_inicio/img_drop_down.png" alt="Menu" className="h-6 w-6 cursor-pointer" />
            </div>
          </div>
        </div>

        {/* Search dropdown */}
        {searchOpen && (
          <div className="border-t bg-white px-4 py-3">
            <input
              type="text"
              placeholder="Escribe tu búsqueda..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
        )}
      </header>

      {/* Scroll to top button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 bg-green-600 text-white p-3 rounded-full shadow-lg hover:bg-green-700 transition z-50"
        >
          <img src="/images/Pagina_inicio/arrow-up2.svg" alt="Arriba" className="h-6 w-6" />
        </button>
      )}

      {/* Main content */}
      <main>
        {/* Hero Section */}
        <section
          className="relative h-screen bg-cover bg-center flex items-center justify-center"
          style={{ backgroundImage: "url('/images/Pagina_inicio/Paisaje_1.jpg')" }}
        >
          <div className="absolute inset-0 bg-black bg-opacity-40"></div>
          <div className="relative z-10 text-center text-white px-4">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              Descubre los mejores sitios <span className="text-green-400">ecoturísticos</span>
            </h1>
            <p className="text-lg md:text-xl mb-8">
              Explora rutas y lugares únicos donde disfrutar de la naturaleza de manera sostenible.
              <br />
              ¡Tu próxima aventura verde te espera!
            </p>
            <button
              onClick={onNavigateColeccion}
              className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg text-lg font-semibold transition"
            >
              Ver más
            </button>
          </div>
        </section>

        {/* Populares Section */}
        <section className="py-16 px-4 bg-gray-50">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
              ¡Mantente al día con los sitios más populares y eventos siempre actualizados!
            </h2>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Populares carousel */}
              <div>
                <h3 className="text-2xl font-bold mb-6 text-green-700">POPULARES</h3>
                <div className="relative">
                  {/* Navigation buttons */}
                  <button
                    onClick={() => setPopularesIndex((prev) => (prev - 1 + 10) % 10)}
                    className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full p-2 shadow-lg"
                  >
                    <span className="text-2xl font-bold text-gray-700">&lsaquo;</span>
                  </button>
                  <button
                    onClick={() => setPopularesIndex((prev) => (prev + 1) % 10)}
                    className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full p-2 shadow-lg"
                  >
                    <span className="text-2xl font-bold text-gray-700">&rsaquo;</span>
                  </button>

                  {/* Carousel items */}
                  <div className="flex gap-4 overflow-hidden">
                    {getVisiblePopulares().map((item, index) => (
                      <div key={index} className="flex-shrink-0 w-1/3">
                        <div className="bg-white rounded-lg shadow-md overflow-hidden">
                          <img src={item.img} alt={item.title} className="w-full h-48 object-cover" />
                          <div className="p-4">
                            <h4 className="font-semibold text-gray-800 mb-1">{item.title}</h4>
                            <p className="text-sm text-gray-600">{item.location}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Eventos carousel */}
              <div>
                <h3 className="text-2xl font-bold mb-6 text-green-700">EVENTOS</h3>
                <div className="relative">
                  <div className="relative h-80 rounded-lg overflow-hidden shadow-lg">
                    {eventosData.map((evento, index) => (
                      <div
                        key={index}
                        className={`absolute inset-0 transition-opacity duration-500 ${
                          index === eventosIndex ? 'opacity-100' : 'opacity-0'
                        }`}
                      >
                        <img src={evento.img} alt={evento.title} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent flex items-end">
                          <h4 className="text-white text-2xl font-bold p-6">{evento.title}</h4>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Navigation arrows */}
                  <button
                    onClick={() => setEventosIndex((prev) => (prev - 1 + 5) % 5)}
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full p-2 shadow-lg"
                  >
                    <span className="text-2xl font-bold text-gray-700">&lsaquo;</span>
                  </button>
                  <button
                    onClick={() => setEventosIndex((prev) => (prev + 1) % 5)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full p-2 shadow-lg"
                  >
                    <span className="text-2xl font-bold text-gray-700">&rsaquo;</span>
                  </button>

                  {/* Dots navigation */}
                  <div className="flex justify-center gap-2 mt-4">
                    {eventosData.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setEventosIndex(index)}
                        className={`w-3 h-3 rounded-full transition ${
                          index === eventosIndex ? 'bg-green-600' : 'bg-gray-300'
                        }`}
                      ></button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Beneficios Section */}
        <section className="py-16 px-4 bg-white">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
              Descubre todos los beneficios
            </h2>

            <div className="grid md:grid-cols-3 gap-8 mb-12">
              {/* Guardar */}
              <div className="bg-gray-50 rounded-lg p-6 text-center hover:shadow-lg transition">
                <img
                  src="/images/loqueofrecemos/marcadorrr.png"
                  alt="Guardar"
                  className="h-20 w-20 mx-auto mb-4"
                />
                <h3 className="text-xl font-bold text-gray-800 mb-2">Guardar</h3>
                <p className="text-gray-600">
                  Guarda tus destinos favoritos y accede a ellos cuando quieras.
                </p>
              </div>

              {/* Notificaciones */}
              <div className="bg-gray-50 rounded-lg p-6 text-center hover:shadow-lg transition">
                <img
                  src="/images/loqueofrecemos/notificacion.png"
                  alt="Notificaciones"
                  className="h-20 w-20 mx-auto mb-4"
                />
                <h3 className="text-xl font-bold text-gray-800 mb-2">Notificaciones</h3>
                <p className="text-gray-600">
                  Recibe alertas sobre eventos y novedades en tus lugares favoritos.
                </p>
              </div>

              {/* Reseñas */}
              <div className="bg-gray-50 rounded-lg p-6 text-center hover:shadow-lg transition">
                <img
                  src="/images/loqueofrecemos/customer-reviewww.png"
                  alt="Reseñas"
                  className="h-20 w-20 mx-auto mb-4"
                />
                <h3 className="text-xl font-bold text-gray-800 mb-2">Reseñas</h3>
                <p className="text-gray-600">
                  Lee opiniones de otros viajeros y comparte tus experiencias.
                </p>
              </div>
            </div>

            <div className="text-center">
              <button
                onClick={onNavigateOferta}
                className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg text-lg font-semibold transition"
              >
                Leer más
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4">
        <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-8">
          {/* Column 1 */}
          <div>
            <h2 className="text-2xl font-bold mb-2">Conexion</h2>
            <p className="text-gray-400 mb-4">EcoRisaralda</p>
            <div className="flex gap-4 mb-4">
              <a href="#" className="text-gray-400 hover:text-white transition">
                <i className="fab fa-facebook text-xl"></i>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition">
                <i className="fab fa-linkedin text-xl"></i>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition">
                <i className="fab fa-youtube text-xl"></i>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition">
                <i className="fab fa-instagram text-xl"></i>
              </a>
            </div>
            <div className="flex items-center gap-2">
              <span>🌐</span>
              <select className="bg-gray-800 text-white px-2 py-1 rounded">
                <option>Español</option>
                <option>English</option>
              </select>
            </div>
          </div>

          {/* Column 2 */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Información</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-400 hover:text-white transition">Conexión EcoRisaralda</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition">Descripción</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition">Lema</a></li>
            </ul>
          </div>

          {/* Column 3 */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Navegación rápida</h4>
            <ul className="space-y-2">
              <li><button onClick={onNavigateSobreNosotros} className="text-gray-400 hover:text-white transition">Sobre nosotros</button></li>
              <li><button onClick={onNavigatePrivacidad} className="text-gray-400 hover:text-white transition">Políticas</button></li>
            </ul>
          </div>

          {/* Column 4 */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Contacto y soporte</h4>
            <ul className="space-y-2">
              <li><a href="mailto:ecorisaralda@contacto.com" className="text-gray-400 hover:text-white transition">ecorisaralda@contacto.com</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition">300 445 80055</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition">Preguntas</a></li>
            </ul>
          </div>
        </div>

        {/* Footer bottom */}
        <div className="max-w-7xl mx-auto mt-8 pt-8 border-t border-gray-700 text-center text-gray-400">
          <p className="mb-2"><em>Conectando viajeros con la naturaleza. Explora, guarda y comparte experiencias únicas.</em></p>
          <p>© 2025 Conexión EcoRisaralda – Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  );
}
