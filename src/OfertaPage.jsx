import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebook, faLinkedin, faYoutube, faInstagram } from '@fortawesome/free-brands-svg-icons';

function OfertaPage({ onNavigateHome, onNavigateLogin, onNavigateRegister, onNavigatePrivacidad, onNavigateSobreNosotros }) {
  const [showSearch, setShowSearch] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const onScroll = () => setShowScrollTop(window.scrollY > 100);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const features = [
    {
      id: 'seccion2',
      title: 'Guarda tus sitios favoritos',
      description: 'Guarda tus sitios favoritos y tenlos siempre a un click',
      image: '/images/loqueofrecemos/marcadorrr.png',
    },
    {
      id: 'seccion3',
      title: 'Espacio para tu opinión',
      description: 'Comparte tu experiencia y ayuda a otros viajeros',
      image: '/images/loqueofrecemos/customer-reviewww.png',
    },
    {
      id: 'seccion4',
      title: 'Notificaciones personalizadas',
      description: 'Recibe notificaciones a tu medida, con lo que realmente te interesa',
      image: '/images/loqueofrecemos/notificacion.png',
    },
    {
      id: 'seccion5',
      title: 'Mantente al día',
      description: 'No te pierdas los nuevos eventos y actividades ecológicas',
      image: '/images/loqueofrecemos/calendario (1).png',
    },
    {
      id: 'seccion6',
      title: 'Recomendaciones personalizadas',
      description: 'Descubre experiencias únicas según tus gustos e intereses',
      image: '/images/loqueofrecemos/medios-de-comunicacion-social (2).png',
    },
    {
      id: 'seccion7',
      title: 'Nuestro chatbot te ayuda',
      description: 'Resuelve tus dudas al instante con nuestro chatbot turístico',
      image: '/images/loqueofrecemos/robotica (1).png',
    },
  ];

  const sections = [
    {
      id: 'seccion2',
      intro: 'Tus lugares favoritos siempre a mano',
      title: 'Guarda tus sitios favoritos',
      description:
        'Guarda los destinos y lugares que más te inspiran para futuras aventuras. Ten siempre a mano tus sitios favoritos y accede rápidamente cuando planifiques tu próxima escapada.',
      image: '/images/loqueofrecemos/360_F_543301935_x7GbHP4insZoPIlyiefioUteakwn4ivh.jpg',
      cta: 'Regístrate para guardar tus sitios favoritos',
    },
    {
      id: 'seccion3',
      intro: 'Comparte tu experiencia',
      title: 'Espacio para tu opinión',
      description:
        'Tu opinión ayuda a otros viajeros. Comparte experiencias, sugerencias y comentarios sobre los destinos que has visitado para enriquecer las aventuras ecológicas de la comunidad.',
      image: '/images/loqueofrecemos/experiencias-de-team-building-al-aire-libre-portada.jpg',
      cta: 'Regístrate para dejar tu reseña',
    },
    {
      id: 'seccion4',
      intro: 'Notificaciones a tu medida',
      title: 'Notificaciones personalizadas',
      description:
        'Recibe alertas adaptadas a tus intereses: nuevos eventos, ofertas especiales y novedades en tus lugares favoritos para que no te pierdas nada.',
      image: '/images/loqueofrecemos/photo-1560483647-6a049edeef29.jpg',
      cta: 'Regístrate para personalización',
    },
    {
      id: 'seccion5',
      intro: 'No te pierdas de nada',
      title: 'Mantente al día',
      description:
        'Entérate de festivales, actividades y experiencias en tus destinos preferidos. Mantén tu agenda ecológica actualizada y disfruta cada momento.',
      image: '/images/loqueofrecemos/calendar-pencil-and-clock-as-tiempo-background-jlwr8f81osug906i.jpg',
      cta: 'Conoce los nuevos eventos',
    },
    {
      id: 'seccion6',
      intro: 'Planes que se adaptan a ti',
      title: 'Recomendaciones personalizadas',
      description:
        'Descubre actividades, destinos y eventos ajustados a tus gustos. Te ayudamos a planear el viaje perfecto, ya sea aventura, relax o cultura.',
      image: '/images/loqueofrecemos/contagiarte_de_ritmos_locales_GettyImages-627027011-scaled.jpg',
      cta: 'Regístrate para tu personalización',
    },
    {
      id: 'seccion7',
      intro: 'Resuelve tus dudas al instante',
      title: 'Nuestro chatbot te ayuda',
      description:
        'Un asistente virtual disponible 24/7 para responder preguntas sobre destinos, actividades o detalles logísticos y guiarte en tu experiencia ecoturística.',
      image: '/images/loqueofrecemos/photo-1515378960530-7c0da6231fb1.jpg',
      cta: 'Habla con el chatbot',
    },
  ];

  return (
    <div className="min-h-screen bg-white text-slate-900">
      {/* Header */}
      <header className="fixed top-0 z-50 w-full bg-white shadow-sm">
        <div className="flex items-center justify-between px-6 py-4 md:px-12">
          <button onClick={onNavigateHome} className="flex items-center gap-2 hover:opacity-80">
            <img src="/images/loqueofrecemos/nature-svgrepo-com.svg" alt="Logo" className="h-8 w-8" />
            <div>
              <h3 className="text-sm font-bold">Conexion</h3>
              <p className="text-xs text-slate-600">EcoRisaralda</p>
            </div>
          </button>

          <div className="flex items-center gap-4">
            <button
              onClick={onNavigateRegister}
              className="hidden h-10 rounded-lg bg-[#267E1B] px-6 text-sm font-semibold text-white transition hover:bg-white hover:text-[#267E1B] hover:border hover:border-[#267E1B] md:block"
            >
              Registrarse
            </button>
            <button
              onClick={onNavigateLogin}
              className="hidden h-10 rounded-lg border-2 border-[#267E1B] px-6 text-sm font-semibold text-[#267E1B] transition hover:bg-[#267E1B] hover:text-white md:block"
            >
              Iniciar Sesión
            </button>
            <button
              onClick={() => setShowSearch((prev) => !prev)}
              className="h-10 w-10 rounded-full bg-white p-2 shadow hover:scale-105 md:hidden"
              aria-label="Buscar"
            >
              <img src="/images/loqueofrecemos/img_drop_down.png" alt="Buscar" className="h-full w-full" />
            </button>
          </div>
        </div>
        {showSearch && (
          <div className="w-full bg-white px-6 pb-6 md:px-12">
            <input
              type="text"
              placeholder="Escribe tu búsqueda..."
              className="mt-2 w-full rounded-lg border-2 border-[#267E1B] px-4 py-3 text-lg text-[#267E1B] focus:outline-none focus:ring-2 focus:ring-[#267E1B]"
            />
          </div>
        )}
      </header>

      {/* Scroll to top */}
      {showScrollTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-5 right-5 z-50 rounded-full bg-white p-2 shadow-lg transition hover:scale-110"
          aria-label="Subir"
        >
          <img src="/images/Coleccion_sitios_ecoturisticos/arrow-up2.svg" alt="Subir" className="h-8 w-8" />
        </button>
      )}

      <main className="pt-24 pb-16">
        <div className="mx-auto max-w-6xl px-6 md:px-10">
          <div className="mb-16 flex flex-col gap-4 text-left">
            <h1 className="text-4xl font-bold text-slate-900 md:text-5xl">Lo que ofrecemos</h1>
            <p className="text-lg text-gray-600 md:text-xl">Experiencias auténticas en armonía con el planeta</p>
          </div>

          {/* Feature grid */}
          <section className="mb-20 grid gap-12 md:grid-cols-3">
            {features.map((feature) => (
              <div key={feature.id} className="flex flex-col gap-3">
                <img src={feature.image} alt={feature.title} className="h-28 w-28" />
                <p className="text-lg font-semibold text-slate-900">{feature.title}</p>
                <p className="text-sm text-gray-600 leading-relaxed">{feature.description}</p>
                <a
                  href={`#${feature.id}`}
                  className="text-sm font-semibold text-gray-700 underline decoration-[#267E1B] decoration-2 underline-offset-4 hover:text-[#267E1B]"
                >
                  Más información
                </a>
              </div>
            ))}
          </section>

          {/* Detail sections */}
          <section className="flex flex-col gap-24">
            {sections.map((section) => (
              <div key={section.id} id={section.id} className="flex flex-col gap-6">
                <h2 className="text-2xl font-bold text-[#267E1B] md:text-3xl">{section.intro}</h2>
                <img
                  src={section.image}
                  alt={section.title}
                  className="h-[380px] w-full rounded-lg object-cover shadow-md"
                />
                <h3 className="text-2xl font-semibold text-slate-900">{section.title}</h3>
                <p className="text-base text-gray-700 leading-relaxed">{section.description}</p>
                <button
                  onClick={onNavigateRegister}
                  className="w-fit rounded-lg bg-[#267E1B] px-6 py-3 text-sm font-semibold text-white transition hover:bg-white hover:text-[#267E1B] hover:outline hover:outline-[#267E1B]"
                >
                  {section.cta}
                </button>
              </div>
            ))}
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-16 border-t border-[#267E1B] bg-gray-200 px-6 py-12 md:px-12">
        <div className="mb-8 grid grid-cols-1 gap-8 md:grid-cols-4">
          <div>
            <h2 className="mb-1 text-xl font-bold text-slate-900">Conexion</h2>
            <p className="mb-4 text-sm text-gray-700">EcoRisaralda</p>
            <div className="flex gap-4 text-lg text-[#267E1B]">
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

export default OfertaPage;
