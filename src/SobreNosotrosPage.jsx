import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebook, faLinkedin, faYoutube, faInstagram } from '@fortawesome/free-brands-svg-icons';

function SobreNosotrosPage({ onNavigateHome, onNavigateLogin, onNavigateRegister, onNavigatePrivacidad }) {
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 100);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

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

            <button
              onClick={onNavigateRegister}
              className="hidden md:block h-10 rounded-lg bg-[#267E1B] px-6 text-sm font-semibold text-white transition hover:bg-white hover:text-[#267E1B] hover:border hover:border-[#267E1B]"
            >
              Registrarse
            </button>
            <button
              onClick={onNavigateLogin}
              className="hidden md:block h-10 rounded-lg border-2 border-[#267E1B] px-6 text-sm font-semibold text-[#267E1B] transition hover:bg-[#267E1B] hover:text-white"
            >
              Iniciar Sesión
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

      {/* Scroll to Top Button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-5 right-5 z-50 rounded-full bg-white shadow-lg transition hover:scale-110 md:right-0"
          title="Volver arriba"
        >
          <img src="/images/Coleccion_sitios_ecoturisticos/arrow-up2.svg" alt="Arriba" className="h-12 w-12" />
        </button>
      )}

      {/* Main Content */}
      <main className="mt-16 flex flex-col">
        {/* Hero Section */}
        <section className="relative h-[40rem] w-full bg-cover bg-center" style={{ backgroundImage: "url('/images/Sobre_Nosotros/fondo ciudad.jpg')" }}>
          <h1 className="absolute bottom-[10%] left-[5%] text-6xl font-semibold text-white md:text-8xl lg:text-[100px]" style={{ textShadow: '-4px 0 2px rgba(0, 0, 0, 0.819)' }}>
            Sobre Nosotros
          </h1>
        </section>

        {/* Description 01 */}
        <div className="flex flex-col items-center justify-center gap-2 bg-white px-5 py-10 md:px-10">
          <p className="text-center text-lg text-gray-500 md:text-xl lg:text-2xl">
            En Conexión EcoRisaralda somos un equipo de apasionados por la naturaleza y el turismo responsable.
          </p>
          <p className="text-center text-lg text-gray-500 md:text-xl lg:text-2xl">
            Nacimos con la misión de acercarte los rincones más auténticos y sostenibles del mundo, aquellos que
          </p>
          <p className="text-center text-lg text-gray-500 md:text-xl lg:text-2xl">
            muchos desconocen pero que ofrecen experiencias inolvidables
          </p>
        </div>

        {/* Section 02 - Content Rows */}
        <section className="mx-auto flex w-[90%] flex-col gap-6 bg-white py-8">
          {/* Row 1 - Nuestra Misión */}
          <div className="flex flex-col items-center gap-12 md:flex-row md:justify-between">
            <div className="flex w-full flex-col justify-center gap-8 md:w-[45%]">
              <h1 className="text-3xl font-bold text-[#267E1B] md:text-4xl">Nuestra Misión</h1>
              <p className="text-justify text-lg text-gray-500 md:text-xl lg:text-2xl">
                Te ayudamos a descubrir destinos ecoturísticos cuidadosamente seleccionados, ofreciéndote
                toda la información práctica que necesitas: cómo llegar, actividades disponibles,
                alojamientos sostenibles y recomendaciones locales. Queremos que planifiques tu aventura
                con confianza y que, al mismo tiempo, contribuyas al cuidado del medio ambiente y al
                desarrollo de las comunidades anfitrionas.
              </p>
            </div>
            <div className="flex w-full items-center justify-center md:w-[50%]">
              <img src="/images/Sobre_Nosotros/fondo ciudad.jpg" alt="Ciudad" className="h-[15rem] w-full md:h-auto md:w-[90%]" />
            </div>
          </div>

          {/* Row 2 - ¿Qué Ofrecemos? */}
          <div className="flex flex-col items-center gap-12 md:flex-row md:justify-between">
            <div className="flex w-full flex-col justify-center gap-8 md:w-[45%]">
              <h1 className="text-3xl font-bold text-[#267E1B] md:text-4xl">¿Qué Ofrecemos?</h1>
              <ul className="flex flex-col gap-2 text-gray-500">
                <li className="text-lg md:text-xl lg:text-2xl">• Guías completas de cada lugar: datos de interés, horarios, tarifas y consejos de conservación.</li>
                <li className="text-lg md:text-xl lg:text-2xl">• Recomendaciones personalizadas según tus gustos y nivel de aventura.</li>
                <li className="text-lg md:text-xl lg:text-2xl">• Notificaciones actuales sobre eventos y novedades en tus destinos favoritos.</li>
                <li className="text-lg md:text-xl lg:text-2xl">• Opiniones de otros viajeros, para que conozcas de primera mano experiencias reales.</li>
                <li className="text-lg md:text-xl lg:text-2xl">• Chatbot 24/7, listo para resolver tus dudas al instante.</li>
              </ul>
            </div>
            <div className="flex w-full items-center justify-center md:w-[50%]">
              <img src="/images/Sobre_Nosotros/ecoturismo.jpg" alt="Ecoturismo" className="h-[15rem] w-full md:h-auto md:w-[90%]" />
            </div>
          </div>

          {/* Row 3 - Nuestros Valores */}
          <div className="flex flex-col items-center gap-12 md:flex-row md:justify-between">
            <div className="flex w-full flex-col justify-center gap-8 md:w-[45%]">
              <h1 className="text-3xl font-bold text-[#267E1B] md:text-4xl">Nuestros Valores</h1>
              <ul className="flex flex-col gap-2 text-gray-500">
                <li className="text-lg md:text-xl lg:text-2xl">• Sostenibilidad: promovemos prácticas que minimizan el impacto ambiental.</li>
                <li className="text-lg md:text-xl lg:text-2xl">• Autenticidad: destacamos proyectos y comunidades locales de verdadera riqueza cultural.</li>
                <li className="text-lg md:text-xl lg:text-2xl">• Transparencia: toda la información está verificada y actualizada regularmente.</li>
                <li className="text-lg md:text-xl lg:text-2xl">• Comunidad: creemos en el poder de compartir experiencias para inspirar a otros viajeros.</li>
              </ul>
            </div>
            <div className="flex w-full items-center justify-center md:w-[50%]">
              <img src="/images/Sobre_Nosotros/ecoturismo.jpg" alt="Ecoturismo valores" className="h-[15rem] w-full md:h-auto md:w-[90%]" />
            </div>
          </div>
        </section>

        {/* Description 02 */}
        <div className="flex flex-col items-center justify-center gap-2 bg-white px-5 py-10 md:px-10">
          <p className="text-center text-lg text-gray-500 md:text-xl lg:text-2xl">
            Únete a nosotros y conviértete en un viajero consciente. Descubre, respeta y disfruta de la naturaleza — ¡tu
          </p>
          <p className="text-center text-lg text-gray-500 md:text-xl lg:text-2xl">
            próxima gran aventura te espera!
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-[#267E1B] bg-gray-200 px-6 py-12 md:px-12">
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
              <li><a href="#" className="hover:underline">Sobre nosotros</a></li>
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

export default SobreNosotrosPage;
