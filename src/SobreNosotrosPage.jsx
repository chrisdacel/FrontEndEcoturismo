import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebook, faLinkedin, faYoutube, faInstagram } from '@fortawesome/free-brands-svg-icons';

function SobreNosotrosPage({ onNavigateHome, onNavigateLogin, onNavigateRegister, onNavigatePrivacidad }) {
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
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
    <div className="flex min-h-screen flex-col bg-white text-slate-900">

      {/* Scroll to Top Button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 z-50 rounded-full bg-green-600 p-3 text-white shadow-lg transition hover:bg-green-700"
        >
          <img src="/images/Pagina_inicio/arrow-up2.svg" alt="Arriba" className="h-6 w-6" />
        </button>
      )}

      <main>
        {/* Row 3 - Nuestros Valores */}
        <div className="flex flex-col items-center gap-12 md:flex-row md:justify-between">
          <div className="flex w-full flex-col justify-center gap-6 md:w-[45%]">
              <h1 className="text-3xl md:text-4xl font-semibold text-slate-900">Nuestros Valores</h1>
              <ul className="flex flex-col gap-2 text-slate-700">
                <li className="text-base md:text-lg leading-relaxed">• Sostenibilidad: promovemos prácticas que minimizan el impacto ambiental.</li>
                <li className="text-base md:text-lg leading-relaxed">• Autenticidad: destacamos proyectos y comunidades locales de verdadera riqueza cultural.</li>
                <li className="text-base md:text-lg leading-relaxed">• Transparencia: toda la información está verificada y actualizada regularmente.</li>
                <li className="text-base md:text-lg leading-relaxed">• Comunidad: creemos en el poder de compartir experiencias para inspirar a otros viajeros.</li>
              </ul>
          </div>
          <div className="flex w-full items-center justify-center md:w-[50%]">
              <img src="/images/Sobre_Nosotros/ecoturismo.jpg" alt="Ecoturismo valores" className="h-[15rem] w-full md:h-auto md:w-[90%] rounded-lg border border-emerald-100 shadow-lg" />
          </div>
        </div>

        {/* Description 02 */}
        <div className="flex flex-col items-center justify-center gap-2 bg-white px-5 py-10 md:px-10">
          <p className="text-center text-base md:text-lg text-slate-700 leading-relaxed">
            Únete a nosotros y conviértete en un viajero consciente. Descubre, respeta y disfruta de la naturaleza — ¡tu
          </p>
          <p className="text-center text-base md:text-lg text-slate-700 leading-relaxed">
            próxima gran aventura te espera!
          </p>
        </div>
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
