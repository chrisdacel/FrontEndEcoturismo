import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebook, faLinkedin, faYoutube, faInstagram } from '@fortawesome/free-brands-svg-icons';

function SobreNosotrosPage({ onNavigateHome, onNavigateLogin, onNavigateRegister, onNavigatePrivacidad }) {
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [heroVisible, setHeroVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 100);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const t = setTimeout(() => setHeroVisible(true), 50);
    return () => clearTimeout(t);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-white text-slate-900">

      {/* Scroll to Top Button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 z-50 rounded-full bg-emerald-500 px-3 py-3 text-white shadow-lg shadow-emerald-500/40 transition hover:scale-110 hover:bg-emerald-600"
          aria-label="Volver arriba"
        >
          ↑
        </button>
      )}

      <main>
        {/* Hero */}
        <section
          className="relative overflow-hidden bg-cover bg-center min-h-[70vh]"
          style={{ backgroundImage: "url('/images/Sobre_Nosotros/fondo ciudad.jpg')" }}
        >
          <div className={`absolute inset-0 bg-gradient-to-r from-white via-white/70 to-transparent md:from-white md:via-white/50 md:to-black/10 transition-opacity duration-500 ${heroVisible ? 'opacity-100' : 'opacity-0'}`} />
          <div className={`absolute bottom-8 left-6 md:bottom-12 md:left-12 z-10 transition-all duration-700 ${heroVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}>
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900">Sobre Nosotros</h1>
            <p className="mt-3 max-w-2xl text-base md:text-lg text-slate-700 leading-relaxed">Conectamos viajeros con experiencias sostenibles y auténticas en Risaralda.</p>
          </div>
        </section>

        {/* Intro */}
        <section className="py-12 px-4 bg-white">
          <div className="max-w-4xl mx-auto text-center">
            <p className="text-base md:text-lg text-slate-700 leading-relaxed mb-2">En Conexión EcoRisaralda somos un equipo de apasionados por la naturaleza y el turismo responsable.</p>
            <p className="text-base md:text-lg text-slate-700 leading-relaxed mb-2">Nacimos con la misión de acercarte los rincones más auténticos y sostenibles del mundo, aquellos que</p>
            <p className="text-base md:text-lg text-slate-700 leading-relaxed">muchos desconocen pero que ofrecen experiencias inolvidables</p>
          </div>
        </section>

        {/* Nuestra Misión */}
        <section className="py-16 px-4 bg-gray-50">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row gap-12 items-center">
              <div className="w-full md:w-[45%]">
                <h2 className="text-3xl md:text-4xl font-semibold text-slate-900 mb-6">Nuestra Misión</h2>
                <p className="text-gray-700 leading-relaxed">Te ayudamos a descubrir destinos ecoturísticos cuidadosamente seleccionados, ofreciéndote toda la información práctica que necesitas: cómo llegar, actividades disponibles, alojamientos sostenibles y recomendaciones locales. Queremos que planifiques tu aventura con confianza y que, al mismo tiempo, contribuyas al cuidado del medio ambiente y al desarrollo de las comunidades anfitrionas.</p>
              </div>
              <div className="w-full md:w-[50%]">
                <img src="/images/Sobre_Nosotros/fondo ciudad.jpg" alt="Nuestra Misión" className="w-full h-80 object-cover rounded-lg border border-emerald-100 shadow-lg" />
              </div>
            </div>
          </div>
        </section>

        {/* ¿Qué Ofrecemos? */}
        <section className="py-16 px-4 bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row gap-12 items-center">
              <div className="w-full md:w-[45%]">
                <h2 className="text-3xl md:text-4xl font-semibold text-slate-900 mb-6">¿Qué Ofrecemos?</h2>
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-start gap-2"><span className="text-emerald-600 font-bold mt-1">•</span><span>Guías completas de cada lugar: datos de interés, horarios, tarifas y consejos de conservación.</span></li>
                  <li className="flex items-start gap-2"><span className="text-emerald-600 font-bold mt-1">•</span><span>Recomendaciones personalizadas según tus gustos y nivel de aventura.</span></li>
                  <li className="flex items-start gap-2"><span className="text-emerald-600 font-bold mt-1">•</span><span>Notificaciones actuales sobre eventos y novedades en tus destinos favoritos.</span></li>
                  <li className="flex items-start gap-2"><span className="text-emerald-600 font-bold mt-1">•</span><span>Opiniones de otros viajeros, para que conozcas de primera mano experiencias reales.</span></li>
                  <li className="flex items-start gap-2"><span className="text-emerald-600 font-bold mt-1">•</span><span>Chatbot 24/7, listo para resolver tus dudas al instante.</span></li>
                </ul>
              </div>
              <div className="w-full md:w-[50%]">
                <img src="/images/Sobre_Nosotros/ecoturismo.jpg" alt="Qué Ofrecemos" className="w-full h-80 object-cover rounded-lg border border-emerald-100 shadow-lg" />
              </div>
            </div>
          </div>
        </section>

        {/* Nuestros Valores */}
        <section className="py-16 px-4 bg-gray-50">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row gap-12 items-center">
              <div className="w-full md:w-[45%]">
                <h2 className="text-3xl md:text-4xl font-semibold text-slate-900 mb-6">Nuestros Valores</h2>
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-start gap-2"><span className="text-emerald-600 font-bold mt-1">•</span><span>Sostenibilidad: promovemos prácticas que minimizan el impacto ambiental.</span></li>
                  <li className="flex items-start gap-2"><span className="text-emerald-600 font-bold mt-1">•</span><span>Autenticidad: destacamos proyectos y comunidades locales de verdadera riqueza cultural.</span></li>
                  <li className="flex items-start gap-2"><span className="text-emerald-600 font-bold mt-1">•</span><span>Responsabilidad: educamos sobre el respeto a la flora, fauna y tradiciones locales.</span></li>
                  <li className="flex items-start gap-2"><span className="text-emerald-600 font-bold mt-1">•</span><span>Innovación: usamos tecnología para facilitar el acceso a información confiable y actualizada.</span></li>
                </ul>
              </div>
              <div className="w-full md:w-[50%]">
                <img src="/images/Sobre_Nosotros/ecoturismo.jpg" alt="Nuestros Valores" className="w-full h-80 object-cover rounded-lg border border-emerald-100 shadow-lg" />
              </div>
            </div>
          </div>
        </section>

        {/* Closing */}
        <section className="py-12 px-4 bg-white">
          <div className="max-w-4xl mx-auto text-center">
            <p className="text-base md:text-lg text-slate-700 leading-relaxed mb-2">Únete a nosotros y conviértete en un viajero consciente. Descubre, respeta y disfruta de la naturaleza — ¡tu</p>
            <p className="text-base md:text-lg text-slate-700 leading-relaxed">próxima gran aventura te espera!</p>
            {/* CTA removed as requested for admin page */}
          </div>
        </section>
      </main>

      {/* Footer (estilo Home) */}
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
                <li><button onClick={onNavigateHome} className="text-left hover:text-slate-900">Inicio</button></li>
                <li><button className="text-left hover:text-slate-900">Sobre nosotros</button></li>
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

export default SobreNosotrosPage;
