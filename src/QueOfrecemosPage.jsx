import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebook, faLinkedin, faYoutube, faInstagram } from '@fortawesome/free-brands-svg-icons';

function QueOfrecemosPage({ onNavigateRegister }) {
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const onScroll = () => setShowScrollTop(window.scrollY > 100);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const features = [
    { id: 'seccion2', title: 'Guarda tus sitios favoritos', description: 'Guarda tus sitios favoritos y tenlos siempre a un click', image: '/images/loqueofrecemos/marcadorrr.png' },
    { id: 'seccion3', title: 'Espacio para tu opinión', description: 'Comparte tu experiencia y ayuda a otros viajeros', image: '/images/loqueofrecemos/customer-reviewww.png' },
    { id: 'seccion4', title: 'Notificaciones personalizadas', description: 'Recibe notificaciones a tu medida, con lo que realmente te interesa', image: '/images/loqueofrecemos/notificacion.png' },
    { id: 'seccion5', title: 'Mantente al día', description: 'No te pierdas los nuevos eventos y actividades ecológicas', image: '/images/loqueofrecemos/calendario (1).png' },
    { id: 'seccion6', title: 'Recomendaciones personalizadas', description: 'Descubre experiencias únicas según tus gustos e intereses', image: '/images/loqueofrecemos/medios-de-comunicacion-social (2).png' },
    { id: 'seccion7', title: 'Nuestro chatbot te ayuda', description: 'Resuelve tus dudas al instante con nuestro chatbot turístico', image: '/images/loqueofrecemos/robotica (1).png' },
  ];

  const sections = [
    { id: 'seccion2', intro: 'Tus lugares favoritos siempre a mano', title: 'Guarda tus sitios favoritos', description: 'Guarda los destinos y lugares que más te inspiran para futuras aventuras. Ten siempre a mano tus sitios favoritos y accede rápidamente cuando planifiques tu próxima escapada.', image: '/images/loqueofrecemos/360_F_543301935_x7GbHP4insZoPIlyiefioUteakwn4ivh.jpg', cta: 'Regístrate para guardar tus sitios favoritos' },
    { id: 'seccion3', intro: 'Comparte tu experiencia', title: 'Espacio para tu opinión', description: 'Tu opinión ayuda a otros viajeros. Comparte experiencias, sugerencias y comentarios sobre los destinos que has visitado para enriquecer las aventuras ecológicas de la comunidad.', image: '/images/loqueofrecemos/experiencias-de-team-building-al-aire-libre-portada.jpg', cta: 'Regístrate para dejar tu reseña' },
    { id: 'seccion4', intro: 'Notificaciones a tu medida', title: 'Notificaciones personalizadas', description: 'Recibe alertas adaptadas a tus intereses: nuevos eventos, ofertas especiales y novedades en tus lugares favoritos para que no te pierdas nada.', image: '/images/loqueofrecemos/photo-1560483647-6a049edeef29.jpg', cta: 'Regístrate para personalización' },
    { id: 'seccion5', intro: 'No te pierdas de nada', title: 'Mantente al día', description: 'Entérate de festivales, actividades y experiencias en tus destinos preferidos. Mantén tu agenda ecológica actualizada y disfruta cada momento.', image: '/images/loqueofrecemos/calendar-pencil-and-clock-as-tiempo-background-jlwr8f81osug906i.jpg', cta: 'Conoce los nuevos eventos' },
    { id: 'seccion6', intro: 'Planes que se adaptan a ti', title: 'Recomendaciones personalizadas', description: 'Descubre actividades, destinos y eventos ajustados a tus gustos. Te ayudamos a planear el viaje perfecto, ya sea aventura, relax o cultura.', image: '/images/loqueofrecemos/contagiarte_de_ritmos_locales_GettyImages-627027011-scaled.jpg', cta: 'Regístrate para tu personalización' },
    { id: 'seccion7', intro: 'Resuelve tus dudas al instante', title: 'Nuestro chatbot te ayuda', description: 'Un asistente virtual disponible 24/7 para responder preguntas sobre destinos, actividades o detalles logísticos y guiarte en tu experiencia ecoturística.', image: '/images/loqueofrecemos/photo-1515378960530-7c0da6231fb1.jpg', cta: 'Habla con el chatbot' },
  ];

  return (
    <div className="min-h-screen bg-white text-slate-900">
      <main className="pt-24 pb-16">
        <div className="mx-auto max-w-6xl px-6 md:px-10">
          <div className="mb-16 flex flex-col gap-4 text-left">
            <h1 className="text-4xl font-bold text-slate-900 md:text-5xl">Qué ofrecemos</h1>
            <p className="text-lg text-gray-600 md:text-xl">Experiencias auténticas en armonía con el planeta</p>
          </div>

          <section className="mb-20 grid gap-12 md:grid-cols-3">
            {features.map((feature) => (
              <div key={feature.id} className="flex flex-col gap-3">
                <img src={feature.image} alt={feature.title} className="h-28 w-28" />
                <p className="text-lg font-semibold text-slate-900">{feature.title}</p>
                <p className="text-sm text-gray-600 leading-relaxed">{feature.description}</p>
                <a href={`#${feature.id}`} className="text-sm font-semibold text-slate-700 underline decoration-emerald-500 decoration-2 underline-offset-4 hover:text-emerald-600">Más información</a>
              </div>
            ))}
          </section>

          <section className="flex flex-col gap-24">
            {sections.map((section) => (
              <div key={section.id} id={section.id} className="flex flex-col gap-6">
                <h2 className="text-2xl font-bold text-[#267E1B] md:text-3xl">{section.intro}</h2>
                <img src={section.image} alt={section.title} className="h-[380px] w-full rounded-lg object-cover shadow-md" />
                <h3 className="text-2xl font-semibold text-slate-900">{section.title}</h3>
                <p className="text-base text-gray-700 leading-relaxed">{section.description}</p>
                <button onClick={onNavigateRegister} className="w-fit rounded-full bg-emerald-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-500/30 transition hover:-translate-y-0.5 hover:bg-emerald-400">{section.cta}</button>
              </div>
            ))}
          </section>
        </div>
      </main>

      {showScrollTop && (
        <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="fixed bottom-6 right-6 z-50 rounded-full bg-emerald-500 px-3 py-3 text-white shadow-lg shadow-emerald-500/40 transition hover:scale-110 hover:bg-emerald-600" aria-label="Subir">↑</button>
      )}

      {/* FOOTER */}
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
                <li><a href="/" className="hover:text-slate-900">Inicio</a></li>
                <li><a href="/sobre-nosotros" className="hover:text-slate-900">Sobre nosotros</a></li>
                <li><a href="/privacidad" className="hover:text-slate-900">Políticas</a></li>
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

export default QueOfrecemosPage;