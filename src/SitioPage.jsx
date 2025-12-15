import React, { useState } from 'react';

export default function SitioPage({ 
  onNavigateHome,
  onNavigateLogin,
  onNavigateRegister,
  onNavigateSobreNosotros,
  onNavigatePrivacidad
}) {
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white font-['Albert_Sans']">
      {/* Header */}
      <header className="bg-white shadow-md fixed top-0 w-full z-50">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2 cursor-pointer" onClick={onNavigateHome}>
            <img src="/images/Pagina_inicio/nature-svgrepo-com.svg" alt="Logo" className="h-12 w-12" />
            <div className="flex flex-col leading-tight">
              <h3 className="text-lg font-bold text-gray-800">Conexion</h3>
              <h5 className="text-sm text-gray-600">EcoRisaralda</h5>
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

            {/* Register button */}
            <button
              onClick={onNavigateRegister}
              className="hidden md:block bg-green-700 hover:bg-white hover:text-green-700 text-white px-6 py-2 rounded-lg font-semibold border border-green-700 transition"
            >
              Registrarse
            </button>

            {/* Login button */}
            <button
              onClick={onNavigateLogin}
              className="hidden md:block bg-white hover:bg-green-700 hover:text-white text-green-700 px-6 py-2 rounded-lg font-bold border border-green-700 transition"
            >
              Iniciar Sesion
            </button>

            {/* Dropdown menu */}
            <div className="md:hidden">
              <img src="/images/Pagina_inicio/img_drop_down.png" alt="Menu" className="h-6 w-6 cursor-pointer" />
            </div>
          </div>
        </div>

        {/* Search dropdown */}
        {searchOpen && (
          <div className="border-t bg-white px-4 py-3 animate-fadeIn">
            <input
              type="text"
              placeholder="Escribe tu búsqueda..."
              className="w-full px-4 py-2 border-2 border-green-700 rounded-lg text-green-700 focus:outline-none"
            />
          </div>
        )}
      </header>

      {/* Spacer for fixed header */}
      <div className="h-16"></div>

      <main>
        {/* Hero Section */}
        <section
          className="relative h-screen bg-cover bg-center flex items-center justify-center"
          style={{ backgroundImage: "url('/images/sitios/mesmerizing-scenery-beautiful-green-mountains-with-cloudy-sky.jpg')" }}
        >
          <div className="absolute inset-0 bg-black bg-opacity-40"></div>
          <div className="relative z-10 text-center text-white px-4">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Reserva natural parque la Nona</h1>
            <p className="text-lg md:text-xl mb-6 max-w-2xl mx-auto">
              ¡Conéctate con la naturaleza y descubre la magia de La Virginia, Risaralda — un paraíso ecoturístico por explorar!
            </p>
            <button className="bg-green-700 hover:bg-green-800 text-white px-8 py-3 rounded-lg font-semibold transition">
              Conoce más
            </button>
          </div>
        </section>

        {/* Description Section */}
        <section className="py-16 px-4 bg-white">
          <div className="max-w-4xl mx-auto text-center">
            <p className="text-lg text-gray-500 leading-relaxed">
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
                <p className="text-gray-600 leading-relaxed">
                  La Reserva Natural Parque La Nona se encuentra en el municipio de Marsella, en el departamento de Risaralda, Colombia.
                  Está ubicada a aproximadamente 7 kilómetros del casco urbano de Marsella.
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
                <p className="text-gray-600 leading-relaxed">
                  Tiene un clima templado y húmedo, con temperaturas entre 17°C y 26°C. Llueve con frecuencia durante todo el año,
                  lo que favorece su vegetación exuberante. Se recomienda llevar ropa impermeable y calzado adecuado para caminatas.
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
                <p className="text-gray-600 leading-relaxed">
                  La Reserva Natural Parque La Nona está ubicada en Marsella, Risaralda, y tiene unas 505 hectáreas de bosque andino entre los 1.700 y 2.100 m s. n. m.
                  Es rica en biodiversidad, fuente de varias quebradas y cuenta con alojamiento, zona de camping y senderos ecológicos ideales para caminatas y avistamiento de aves.
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
                <p className="text-gray-600 leading-relaxed">
                  El parque alberga una gran variedad de especies vegetales como árboles de yarumo, cedro y guadua.
                  También es hogar de aves como tucanes, tangaras, y búhos, además de mamíferos como zarigüeyas, armadillos
                  y pequeños felinos, lo que lo convierte en un espacio vital para la conservación de la biodiversidad.
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
                <p className="text-gray-600 leading-relaxed">
                  El parque cuenta con cabañas, zonas de camping, baños ecológicos, miradores y senderos señalizados.
                  Estas infraestructuras están diseñadas para minimizar el impacto ambiental y ofrecer comodidad a los visitantes,
                  fomentando una experiencia segura y respetuosa con el entorno natural.
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
            <p className="text-gray-600 leading-relaxed">
              Se sugiere llevar ropa cómoda, calzado para caminatas, impermeable, repelente, protector solar, 
              cámara fotográfica, y agua. Es importante respetar las normas del parque, no dejar residuos y 
              mantener una actitud responsable con el medio ambiente para preservar este tesoro natural.
            </p>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-200 text-gray-600 py-12 px-4 border-t border-green-700">
        <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-8">
          {/* Column 1 */}
          <div>
            <h2 className="text-2xl font-bold mb-2 text-gray-800">Conexion</h2>
            <p className="text-gray-600 mb-4">EcoRisaralda</p>
            <div className="flex gap-4 mb-4">
              <a href="#" className="text-green-600 hover:text-green-800 transition">
                <i className="fab fa-facebook text-xl"></i>
              </a>
              <a href="#" className="text-green-600 hover:text-green-800 transition">
                <i className="fab fa-linkedin text-xl"></i>
              </a>
              <a href="#" className="text-green-600 hover:text-green-800 transition">
                <i className="fab fa-youtube text-xl"></i>
              </a>
              <a href="#" className="text-green-600 hover:text-green-800 transition">
                <i className="fab fa-instagram text-xl"></i>
              </a>
            </div>
            <div className="flex items-center gap-2">
              <span>🌐</span>
              <select className="bg-white text-gray-700 px-2 py-1 rounded border">
                <option>Español</option>
                <option>English</option>
              </select>
            </div>
          </div>

          {/* Column 2 */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-gray-800">Información</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-600 hover:underline">Conexión EcoRisaralda</a></li>
              <li><a href="#" className="text-gray-600 hover:underline">Descripción</a></li>
              <li><a href="#" className="text-gray-600 hover:underline">Lema</a></li>
            </ul>
          </div>

          {/* Column 3 */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-gray-800">Navegación rápida</h4>
            <ul className="space-y-2">
              <li><button onClick={onNavigateHome} className="text-gray-600 hover:underline">Inicio</button></li>
              <li><button onClick={onNavigateSobreNosotros} className="text-gray-600 hover:underline">Sobre nosotros</button></li>
              <li><button onClick={onNavigatePrivacidad} className="text-gray-600 hover:underline">Políticas</button></li>
            </ul>
          </div>

          {/* Column 4 */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-gray-800">Contacto y soporte</h4>
            <ul className="space-y-2">
              <li><a href="mailto:ecorisaralda@contacto.com" className="text-gray-600 hover:underline">ecorisaralda@contacto.com</a></li>
              <li><a href="#" className="text-gray-600 hover:underline">300 445 80055</a></li>
              <li><a href="#" className="text-gray-600 hover:underline">Preguntas</a></li>
            </ul>
          </div>
        </div>

        {/* Footer bottom */}
        <div className="max-w-7xl mx-auto mt-8 pt-8 border-t border-gray-300 text-center text-gray-500">
          <p className="mb-2"><em>Conectando viajeros con la naturaleza. Explora, guarda y comparte experiencias únicas.</em></p>
          <p>© 2025 Conexión EcoRisaralda – Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  );
}
