import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebook, faLinkedin, faYoutube, faInstagram } from '@fortawesome/free-brands-svg-icons';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { getAllPlaces } from './services/placesApi';

export default function ColeccionPage({ onNavigateHome, onNavigateLogin, onNavigatePrivacidad, onNavigateSobreNosotros }) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [scrollToTop, setScrollToTop] = useState(false);
  const [carouselIndex, setCarouselIndex] = useState([0, 0, 0]);
  const [sitiosAPI, setSitiosAPI] = useState([]);
  const [loading, setLoading] = useState(true);

  // Cargar sitios desde la API
  useEffect(() => {
    loadSites();
  }, []);

  const loadSites = async () => {
    try {
      const data = await getAllPlaces();
      setSitiosAPI(data);
    } catch (error) {
      console.error('Error cargando sitios:', error);
    } finally {
      setLoading(false);
    }
  };

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

  // Imágenes del hero (ubica las imágenes adjuntas en estas rutas)
  const heroShots = [
    { id: 'h1', nombre: 'Palmas de cera', imagen: '/images/Coleccion_sitios_ecoturisticos/paisaje_01.jpeg' },
    { id: 'h2', nombre: 'Bandera de Colombia', imagen: '/images/Coleccion_sitios_ecoturisticos/paisaje_02.jpeg' },
    { id: 'h3', nombre: 'Colibrí en juncos', imagen: '/images/Coleccion_sitios_ecoturisticos/paisaje_03.jpeg' },
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
    <div className="min-h-screen coleccion-shell text-slate-900">
      {/* Scroll to Top Button */}
      {scrollToTop && (
        <button
          onClick={scrollToTopHandler}
          className="fixed bottom-6 right-6 z-50 rounded-full bg-emerald-500 px-3 py-3 text-white shadow-lg shadow-emerald-500/40 transition hover:scale-110 hover:bg-emerald-600"
          aria-label="Volver arriba"
        >
          ↑
        </button>
      )}

      <main className="pt-6">
        {/* Sección 1: Hero con trío de imágenes y buscador */}
        <section className="relative w-full py-16 md:py-20 coleccion-hero">
          <div className="relative z-10 flex flex-col items-center gap-12 px-6 md:flex-row md:items-center md:justify-between md:gap-10 md:px-12">
            {/* Izquierda: trío de imágenes verticales */}
            <div className="w-full max-w-3xl md:max-w-2xl flex justify-center">
              <div className="flex w-full max-w-2xl gap-4 md:gap-5">
                {heroShots.map((shot, idx) => (
                  <div key={shot.id} className="flex items-end">
                    <img
                      src={shot.imagen}
                      alt={shot.nombre}
                      className={`object-cover rounded-[22px] shadow-lg w-[120px] h-[280px] md:w-[150px] md:h-[340px] lg:w-[170px] lg:h-[400px] ${idx === 1 ? 'h-[300px] md:h-[360px] lg:h-[430px]' : ''}`}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Derecha: Título y Buscador */}
            <div className="relative z-10 flex-1 max-w-xl md:max-w-lg lg:max-w-xl flex flex-col items-center md:items-start gap-6 md:gap-8">
              <div className="text-center md:text-left space-y-2">
                <h1 className="text-4xl md:text-5xl font-bold text-slate-900">Explora y conecta con la naturaleza</h1>
                <p className="text-slate-700">Busca sitios, actividades y experiencias sostenibles.</p>
              </div>
              <div className="flex w-full max-w-md items-center gap-2">
                <input
                  type="text"
                  placeholder="Buscar destinos..."
                  className="w-full rounded-lg border border-emerald-200 px-3 py-2 outline-none focus:ring-2 focus:ring-emerald-300"
                />
                <button className="rounded-lg bg-emerald-600 px-4 py-2 text-white hover:bg-emerald-700 transition">Buscar</button>
              </div>
            </div>
          </div>
        </section>

        {/* Sección 2: Sitios Creados desde la API */}
        {sitiosAPI.length > 0 && (
          <section className="w-full bg-white py-16 px-0 md:px-0">
            <div className="px-6 md:px-12 mb-8 flex items-center justify-between">
              <h2 className="text-3xl font-bold">Sitios Ecoturísticos</h2>
              {(user?.role === 'admin' || user?.role === 'operator') && (
                <button
                  onClick={() => navigate('/crear-sitio')}
                  className="rounded-full bg-emerald-500 px-6 py-3 font-semibold text-white hover:bg-emerald-600 transition"
                >
                  + Crear Sitio
                </button>
              )}
            </div>

            {loading ? (
              <div className="flex justify-center py-12">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-emerald-400/30 border-t-emerald-400"></div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 px-6 md:px-12">
                {sitiosAPI.map((sitio) => (
                  <article
                    key={sitio.id}
                    className="group cursor-pointer rounded-lg border border-emerald-100 bg-white shadow-sm shadow-emerald-100/50 overflow-hidden hover:shadow-lg transition"
                    onClick={() => navigate(user?.role === 'admin' ? `/admin/sitio/${sitio.id}` : `/sitio/${sitio.id}`)}
                  >
                    <div className="h-48 w-full overflow-hidden">
                      <img
                        src={`http://localhost:8000/storage/${sitio.cover}`}
                        alt={sitio.name}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="text-lg font-semibold text-slate-900 mb-2">{sitio.name}</h3>
                      <p className="text-sm text-slate-600 mb-2">{sitio.slogan}</p>
                      <p className="text-xs text-emerald-600">📍 {sitio.localization.substring(0, 60)}...</p>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>
        )}

        {/* Botón de Crear Sitio si no hay sitios */}
        {sitiosAPI.length === 0 && !loading && (user?.role === 'admin' || user?.role === 'operator') && (
          <section className="w-full bg-white py-16 px-6 md:px-12">
            <div className="max-w-2xl mx-auto text-center space-y-4">
              <h2 className="text-3xl font-bold text-slate-900">Aún no hay sitios creados</h2>
              <p className="text-slate-600">Sé el primero en agregar un sitio ecoturístico</p>
              <button
                onClick={() => navigate('/crear-sitio')}
                className="rounded-full bg-emerald-500 px-8 py-4 font-semibold text-white hover:bg-emerald-600 transition"
              >
                + Crear Primer Sitio
              </button>
            </div>
          </section>
        )}

        {/* Sección 3: Recomendaciones (scroll lateral) */}
        <section className="w-full bg-white py-16 px-0 md:px-0 mb-20">
          <h2 className="mb-8 px-6 md:px-12 text-3xl font-bold">Recomendaciones</h2>

          {/* Carril con scroll horizontal y snap */}
          <div className="overflow-x-auto scrollbar-none px-6 md:px-12">
            <div className="flex gap-6 md:gap-8 snap-x snap-mandatory">
              {recomendaciones.map((rec) => (
                <article
                  key={rec.id}
                  className="group relative shrink-0 snap-start w-[260px] sm:w-[300px] md:w-[340px] aspect-[9/16] rounded-[26px] overflow-hidden shadow-xl cursor-pointer"
                >
                  {/* Imagen */}
                  <img
                    src={rec.imagen}
                    alt={rec.nombre}
                    className="absolute inset-0 h-full w-full object-cover rounded-[26px] origin-center transform transition-transform duration-700 ease-out group-hover:scale-105"
                  />

                  {/* Gradiente y contenido que aparecen en hover */}
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 rounded-[26px]" />

                  <div className="absolute inset-0 flex flex-col justify-between p-5 opacity-0 transition-opacity duration-300 group-hover:opacity-100 rounded-[26px]">
                    <div className="relative z-10 space-y-1 text-white">
                      <p className="text-white/80 text-xs font-semibold">Recomendado</p>
                      <h3 className="text-2xl font-bold leading-tight">{rec.nombre}</h3>
                      <p className="text-sm">Explora este destino increíble</p>
                    </div>
                    <div className="relative z-10 flex items-center justify-between">
                      <div className="rounded-full bg-white/20 text-white text-xs px-3 py-1 backdrop-blur">Más destinos</div>
                      <button className="grid place-items-center h-8 w-8 rounded-full bg-black/40 text-white backdrop-blur hover:bg-black/60 transition">+</button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
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
                <li><button onClick={onNavigateSobreNosotros} className="text-left hover:text-slate-900">Sobre nosotros</button></li>
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
