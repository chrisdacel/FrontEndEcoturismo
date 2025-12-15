import React, { useState } from 'react';

export default function SitioPageTurista({ 
  userName = "Jane Mar",
  onNavigateHome,
  onNavigateSobreNosotros,
  onNavigatePrivacidad
}) {
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white font-['Albert_Sans']">
      {/* Header */}
      <header className="bg-white shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2 cursor-pointer" onClick={onNavigateHome}>
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

      <main>
        {/* Hero Section */}
        <section
          className="relative h-96 bg-cover bg-center flex items-center justify-center"
          style={{ backgroundImage: "url('/images/sitios/LA-VIRGINIA-540X370.jpg')" }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"></div>
          <div className="relative z-10 text-center text-white px-4">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Reserva natural parque la Nona</h1>
            <p className="text-lg md:text-xl mb-6">
              ¡Conéctate con la naturaleza y descubre la magia de La Virginia, Risaralda — un paraíso ecoturístico por explorar!
            </p>
            <button className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg font-semibold transition">
              Conoce más
            </button>
          </div>
        </section>

        {/* Description Section */}
        <section className="py-16 px-4 bg-white">
          <div className="max-w-4xl mx-auto text-center">
            <p className="text-lg text-gray-700 leading-relaxed">
              La Reserva Natural Parque La Nona es un destino ideal para los amantes del ecoturismo.
              Rodeada de exuberante vegetación y rica biodiversidad, esta reserva ofrece una experiencia
              única de conexión con la naturaleza. Los visitantes pueden disfrutar de caminatas ecológicas,
              avistamiento de aves, y recorridos interpretativos que promueven la conservación del medio ambiente.
              Es un espacio perfecto para quienes buscan tranquilidad, aire puro y un contacto respetuoso con los ecosistemas locales.
            </p>
          </div>
        </section>

        {/* Localización Section */}
        <section className="py-16 px-4 bg-gray-50">
          <div className="max-w-7xl mx-auto">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div className="order-2 md:order-1">
                <h2 className="text-3xl font-bold text-green-700 mb-4">Localización</h2>
                <p className="text-gray-700 leading-relaxed">
                  La Reserva Natural Parque La Nona se encuentra ubicada en el municipio de La Virginia, Risaralda,
                  en una zona estratégica de fácil acceso desde las principales ciudades del Eje Cafetero. Su ubicación
                  privilegiada la convierte en un punto de encuentro ideal para los amantes de la naturaleza.
                </p>
              </div>
              <div className="order-1 md:order-2">
                <img
                  src="/images/sitios/Captura de pantalla 2025-04-09 235939.png"
                  alt="Mapa de localización"
                  className="w-full h-80 object-cover rounded-lg shadow-md"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Clima Section */}
        <section className="py-16 px-4 bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div className="order-1">
                <img
                  src="/images/sitios/LA-VIRGINIA-540X370.jpg"
                  alt="Vegetación y clima"
                  className="w-full h-80 object-cover rounded-lg shadow-md"
                />
              </div>
              <div className="order-2">
                <h2 className="text-3xl font-bold text-green-700 mb-4">Clima</h2>
                <p className="text-gray-700 leading-relaxed">
                  El clima en la Reserva Natural Parque La Nona es cálido y húmedo, con temperaturas que oscilan
                  entre los 24°C y 28°C durante todo el año. Las lluvias son frecuentes, especialmente en los meses
                  de abril y octubre, lo que contribuye a mantener la exuberante vegetación del lugar.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Características Section */}
        <section className="py-16 px-4 bg-gray-50">
          <div className="max-w-7xl mx-auto">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div className="order-2 md:order-1">
                <h2 className="text-3xl font-bold text-green-700 mb-4">Características</h2>
                <p className="text-gray-700 leading-relaxed">
                  La reserva cuenta con senderos ecológicos bien señalizados, áreas de descanso, miradores naturales
                  y espacios para la observación de aves. Su paisaje está dominado por bosques de galería, quebradas
                  cristalinas y una gran diversidad de especies vegetales y animales propias de la región.
                </p>
              </div>
              <div className="order-1 md:order-2">
                <img
                  src="/images/sitios/unnamed.jpg"
                  alt="Vista de montaña y reserva natural"
                  className="w-full h-80 object-cover rounded-lg shadow-md"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Flora y Fauna Section */}
        <section className="py-16 px-4 bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div className="order-1">
                <img
                  src="/images/sitios/Departamento-Risaralda-de-Colombia-10.jpg"
                  alt="Flora y fauna del parque"
                  className="w-full h-80 object-cover rounded-lg shadow-md"
                />
              </div>
              <div className="order-2">
                <h2 className="text-3xl font-bold text-green-700 mb-4">Flora y Fauna</h2>
                <p className="text-gray-700 leading-relaxed">
                  En la Reserva Natural Parque La Nona se pueden encontrar especies de flora como ceibas, guayacanes,
                  yarumos y heliconias. En cuanto a fauna, es común avistar aves como loros, guacamayas, garzas y colibríes,
                  así como mamíferos pequeños, reptiles y una gran variedad de insectos propios del ecosistema tropical.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Infraestructura Section */}
        <section className="py-16 px-4 bg-gray-50">
          <div className="max-w-7xl mx-auto">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div className="order-2 md:order-1">
                <h2 className="text-3xl font-bold text-green-700 mb-4">Infraestructura</h2>
                <p className="text-gray-700 leading-relaxed">
                  La reserva dispone de instalaciones básicas para recibir visitantes, incluyendo baños ecológicos,
                  áreas de camping, kioscos para descanso, y un centro de información donde se brindan charlas sobre
                  conservación ambiental. También cuenta con guías locales capacitados que acompañan a los turistas
                  en sus recorridos.
                </p>
              </div>
              <div className="order-1 md:order-2">
                <img
                  src="/images/sitios/maxresdefault.jpg"
                  alt="Infraestructura del parque"
                  className="w-full h-80 object-cover rounded-lg shadow-md"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Recomendaciones Section */}
        <section className="py-16 px-4 bg-white">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-green-700 mb-6">Recomendaciones</h2>
            <p className="text-gray-700 leading-relaxed">
              Se sugiere llevar ropa cómoda, calzado para caminatas, impermeable, repelente, protector solar, 
              cámara fotográfica, y agua. Es importante respetar las normas del parque, no dejar residuos y 
              mantener una actitud responsable con el medio ambiente para preservar este tesoro natural.
            </p>
          </div>
        </section>

        {/* Opiniones Section */}
        <section className="py-16 px-4 bg-gray-50">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-800 mb-4">Calificaciones y opiniones</h2>
              <img src="/images/sitios/puntuación.png" alt="Puntuación" className="h-16 mx-auto mb-6" />
              <button className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg font-semibold transition">
                Escribe una reseña
              </button>
            </div>

            {/* Reseñas */}
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex items-start gap-4">
                  <img src="/images/Coleccion_sitios_ecoturisticos/user.svg" alt="User" className="h-12 w-12 rounded-full bg-gray-200 p-2" />
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-gray-800">María González</h4>
                      <span className="text-yellow-500">★★★★★</span>
                    </div>
                    <p className="text-gray-600">
                      Excelente lugar para conectarse con la naturaleza. Los senderos están muy bien mantenidos
                      y la biodiversidad es impresionante. Totalmente recomendado para familias.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex items-start gap-4">
                  <img src="/images/Coleccion_sitios_ecoturisticos/user.svg" alt="User" className="h-12 w-12 rounded-full bg-gray-200 p-2" />
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-gray-800">Carlos Ramírez</h4>
                      <span className="text-yellow-500">★★★★☆</span>
                    </div>
                    <p className="text-gray-600">
                      Muy bonito el lugar y bien cuidado. Los guías son muy conocedores de la flora y fauna local.
                      Solo sugiero mejorar las señalizaciones en algunos senderos.
                    </p>
                  </div>
                </div>
              </div>
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
              <li><button onClick={onNavigateHome} className="text-gray-400 hover:text-white transition">Inicio</button></li>
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
