import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebook, faLinkedin, faYoutube, faInstagram } from '@fortawesome/free-brands-svg-icons';

function SitioPageOperador({ userName = "Jane Mar", onNavigateHome, onNavigateSobreNosotros, onNavigatePrivacidad }) {
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <div className="flex min-h-screen flex-col bg-white text-slate-900">
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
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="flex items-center gap-2 hover:opacity-80"
            >
              <img src="/images/roles/search-svgrepo-com.svg" alt="Buscar" className="h-6 w-6" />
              <span className="hidden md:inline text-sm">Buscar</span>
            </button>

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

        {searchOpen && (
          <div className="border-t border-gray-200 bg-white px-6 py-4 md:px-12">
            <input
              type="text"
              placeholder="Escribe tu búsqueda..."
              className="w-full rounded-lg border-2 border-[#267E1B] px-4 py-2 text-lg outline-none focus:border-[#267E1B]"
            />
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="mt-16">
        {/* Hero Section */}
        <section className="relative h-[500px] bg-cover bg-center" style={{ backgroundImage: "url('/images/sitios/LA-VIRGINIA-540X370.jpg')" }}>
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
          <div className="relative flex h-full flex-col items-start justify-end px-8 pb-16 text-white md:px-20">
            <h1 className="mb-4 text-4xl font-bold md:text-5xl">Reserva natural parque la Nona</h1>
            <p className="mb-6 max-w-3xl text-lg md:text-xl">
              ¡Conéctate con la naturaleza y descubre la magia de La Virginia, Risaralda — un paraíso ecoturístico por explorar!
            </p>
            <button className="rounded-lg bg-[#267E1B] px-8 py-3 text-lg font-semibold transition hover:bg-[#1d5f14]">
              Conoce más
            </button>
          </div>
        </section>

        {/* Description Section */}
        <section className="bg-white px-8 py-16 md:px-20">
          <div className="mx-auto max-w-5xl">
            <p className="text-center text-lg leading-relaxed text-gray-600 md:text-xl">
              La Reserva Natural Parque La Nona es un destino ideal para los amantes del ecoturismo.
              Rodeada de exuberante vegetación y rica biodiversidad, esta reserva ofrece una experiencia
              única de conexión con la naturaleza. Los visitantes pueden disfrutar de caminatas ecológicas,
              avistamiento de aves, y recorridos interpretativos que promueven la conservación del medio ambiente.
              Es un espacio perfecto para quienes buscan tranquilidad, aire puro y un contacto respetuoso con los ecosistemas locales.
            </p>
          </div>
        </section>

        {/* Info Section 1 - Localización */}
        <section className="bg-gray-50 px-8 py-16 md:px-20">
          <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 md:grid-cols-2">
            <div>
              <h2 className="mb-6 text-3xl font-bold text-[#267E1B]">Localización</h2>
              <p className="text-lg leading-relaxed text-gray-600">
                La Reserva Natural Parque La Nona se encuentra en el municipio de Marsella, en el departamento de Risaralda, Colombia.
                Está ubicada a aproximadamente 7 kilómetros del casco urbano de Marsella.
              </p>
            </div>
            <div className="flex justify-center">
              <img
                src="/images/sitios/Captura de pantalla 2025-04-09 235939.png"
                alt="Mapa de localización"
                className="rounded-lg shadow-lg"
              />
            </div>
          </div>
        </section>

        {/* Info Section 2 - Clima */}
        <section className="bg-white px-8 py-16 md:px-20">
          <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 md:grid-cols-2">
            <div className="order-2 md:order-1 flex justify-center">
              <img
                src="/images/sitios/LA-VIRGINIA-540X370.jpg"
                alt="Vegetación y clima"
                className="rounded-lg shadow-lg"
              />
            </div>
            <div className="order-1 md:order-2">
              <h2 className="mb-6 text-3xl font-bold text-[#267E1B]">Clima</h2>
              <p className="text-lg leading-relaxed text-gray-600">
                Tiene un clima templado y húmedo, con temperaturas entre 17°C y 26°C. Llueve con frecuencia durante todo el año,
                lo que favorece su vegetación exuberante. Se recomienda llevar ropa impermeable y calzado adecuado para caminatas.
              </p>
            </div>
          </div>
        </section>

        {/* Info Section 3 - Características */}
        <section className="bg-gray-50 px-8 py-16 md:px-20">
          <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 md:grid-cols-2">
            <div>
              <h2 className="mb-6 text-3xl font-bold text-[#267E1B]">Características</h2>
              <p className="text-lg leading-relaxed text-gray-600">
                El parque destaca por su biodiversidad, senderos ecológicos bien señalizados, miradores naturales
                con vistas panorámicas, y programas de educación ambiental. Es un refugio de tranquilidad que combina
                turismo con conservación.
              </p>
            </div>
            <div className="flex justify-center">
              <img
                src="/images/sitios/unnamed.jpg"
                alt="Vista de montaña y reserva natural"
                className="rounded-lg shadow-lg"
              />
            </div>
          </div>
        </section>

        {/* Info Section 4 - Flora y Fauna */}
        <section className="bg-white px-8 py-16 md:px-20">
          <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 md:grid-cols-2">
            <div className="order-2 md:order-1 flex justify-center">
              <img
                src="/images/sitios/Departamento-Risaralda-de-Colombia-10.jpg"
                alt="Flora y fauna del parque"
                className="rounded-lg shadow-lg"
              />
            </div>
            <div className="order-1 md:order-2">
              <h2 className="mb-6 text-3xl font-bold text-[#267E1B]">Flora y Fauna</h2>
              <p className="text-lg leading-relaxed text-gray-600">
                La reserva alberga una gran variedad de especies vegetales como heliconias, bromelias y orquídeas.
                En cuanto a fauna, es posible avistar colibríes, tangaras, ardillas y ocasionalmente mamíferos como
                cusumbos y armadillos.
              </p>
            </div>
          </div>
        </section>

        {/* Info Section 5 - Infraestructura */}
        <section className="bg-gray-50 px-8 py-16 md:px-20">
          <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 md:grid-cols-2">
            <div>
              <h2 className="mb-6 text-3xl font-bold text-[#267E1B]">Infraestructura</h2>
              <p className="text-lg leading-relaxed text-gray-600">
                El parque cuenta con senderos demarcados, zonas de descanso, áreas de picnic, baños públicos y
                señalización informativa. También ofrece servicios de guianza especializada y talleres ambientales.
              </p>
            </div>
            <div className="flex justify-center">
              <img
                src="/images/sitios/maxresdefault.jpg"
                alt="Infraestructura del parque"
                className="rounded-lg shadow-lg"
              />
            </div>
          </div>
        </section>

        {/* Info Section 6 - Recomendaciones */}
        <section className="bg-white px-8 py-16 md:px-20">
          <div className="mx-auto max-w-5xl">
            <h2 className="mb-6 text-center text-3xl font-bold text-[#267E1B]">Recomendaciones</h2>
            <p className="text-center text-lg leading-relaxed text-gray-600">
              Se sugiere llevar ropa cómoda, calzado para caminatas, impermeable, repelente, protector solar,
              cámara fotográfica, y agua. Es importante respetar las normas del parque, no dejar residuos y
              mantener una actitud responsable con el medio ambiente para preservar este tesoro natural.
            </p>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-[#267E1B] bg-gray-200 px-6 py-12 md:px-12">
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

export default SitioPageOperador;
