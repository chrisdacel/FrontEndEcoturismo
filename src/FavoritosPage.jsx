import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { api } from './services/api';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebook, faLinkedin, faYoutube, faInstagram } from '@fortawesome/free-brands-svg-icons';

export default function FavoritosPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [scrollY, setScrollY] = useState(0);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [favoritos, setFavoritos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = async () => {
    try {
      const response = await api.get('/favorites');
      setFavoritos(response.data);
    } catch (err) {
      setError(err.message || 'Error cargando favoritos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
      setShowScrollTop(window.scrollY > 300);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleRemoveFavorite = async (id) => {
    if (!confirm('¿Eliminar este sitio de favoritos?')) return;
    try {
      await api.delete(`/places/${id}/favorite`);
      setFavoritos((prev) => prev.filter((fav) => fav.id !== id));
    } catch (err) {
      setError(err.message || 'Error eliminando favorito');
    }
  };

  const handleNavigateToSite = (id) => {
    const prefix = user?.role === 'admin' ? '/admin' : user?.role === 'operator' ? '/operador' : '/turista';
    navigate(`${prefix}/sitio/${id}`);
  };

  const storageUrl = (path) => (path ? `http://localhost:8000/storage/${path}` : '');

  if (loading) {
    return (
      <div className="relative min-h-screen bg-white grid place-items-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-emerald-400/30 border-t-emerald-500" />
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-white overflow-x-hidden">
      
      {/* Hero Section */}
      <section className="relative pt-24 pb-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
              Mis Favoritos
            </h1>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              {user?.name}, aquí encontrarás todos los sitios que has guardado como favoritos
            </p>
          </div>

          {/* Contador de favoritos */}
          <div className="flex items-center justify-center gap-2 mb-8">
            <svg className="w-6 h-6 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
            </svg>
            <span className="text-slate-600 text-sm">
              {favoritos.length} {favoritos.length === 1 ? 'sitio guardado' : 'sitios guardados'}
            </span>
          </div>

          {/* Grid de Favoritos */}
          {favoritos.length === 0 ? (
            <div className="text-center py-16">
              <svg className="w-24 h-24 mx-auto mb-6 text-emerald-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">
                Aún no tienes favoritos
              </h3>
              <p className="text-slate-600 mb-6">
                Explora nuestra colección y guarda los sitios que más te gusten
              </p>
              <button
                onClick={() => {
                  const prefix = user?.role === 'admin' ? '/admin' : user?.role === 'operator' ? '/operador' : '/turista';
                  navigate(`${prefix}/coleccion`);
                }}
                className="inline-flex items-center gap-2 rounded-full bg-emerald-500 px-6 py-3 text-sm font-semibold text-white shadow-lg hover:bg-emerald-600 transition"
              >
                Explorar colección
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {favoritos.map((fav) => (
                <div
                  key={fav.id}
                  className="group relative bg-white rounded-2xl overflow-hidden ring-1 ring-slate-200 hover:ring-emerald-500 shadow-sm hover:shadow-lg transition-all duration-300 hover:scale-105"
                >
                  {/* Imagen */}
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={storageUrl(fav.cover) || fav.img}
                      alt={fav.name || fav.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    {/* Overlay con botones */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
                      <button
                        onClick={() => handleNavigateToSite(fav.id)}
                        className="inline-flex items-center gap-2 rounded-full bg-white/90 backdrop-blur px-4 py-2 text-sm font-semibold text-slate-900 hover:bg-white transition"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                        Ver detalles
                      </button>
                      <button
                        onClick={() => handleRemoveFavorite(fav.id)}
                        className="inline-flex items-center rounded-full bg-red-500/90 backdrop-blur p-2 text-white hover:bg-red-600 transition"
                        title="Eliminar de favoritos"
                      >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </div>
                  </div>

                  {/* Contenido */}
                  <div className="p-5">
                    <h3 className="text-lg font-semibold text-slate-900 mb-2 line-clamp-1">
                      {fav.name || fav.title}
                    </h3>
                    <div className="flex items-center gap-1 text-emerald-700 text-sm mb-3">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                      </svg>
                      <span className="line-clamp-1">{fav.localization || fav.location}</span>
                    </div>
                    <p className="text-slate-600 text-sm line-clamp-2">
                      {fav.description}
                    </p>
                  </div>

                  {/* Badge de favorito */}
                  <div className="absolute top-3 right-3">
                    <div className="bg-red-500 rounded-full p-2 shadow-lg">
                      <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

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

      {/* Botón scroll to top */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 z-50 rounded-full bg-emerald-500 p-3 text-white shadow-2xl transition hover:bg-emerald-600 hover:scale-110"
          aria-label="Volver arriba"
        >
          <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
          </svg>
        </button>
      )}
    </div>
  );
}
