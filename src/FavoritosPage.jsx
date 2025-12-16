import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

export default function FavoritosPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [scrollY, setScrollY] = useState(0);
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Mock data de favoritos (más adelante conectar con backend)
  const [favoritos, setFavoritos] = useState([
    { 
      id: 1, 
      img: '/images/Pagina_inicio/Paisaje_1.jpg', 
      title: 'Santuario Otún Quimbaya', 
      location: 'Municipio de Santa Rosa de Cabal',
      description: 'Reserva natural con biodiversidad única'
    },
    { 
      id: 2, 
      img: '/images/Pagina_inicio/Paisaje_2.jpg', 
      title: 'Cascadas de Santa Rosa', 
      location: 'Municipio de Santa Rosa de Cabal',
      description: 'Impresionantes caídas de agua rodeadas de naturaleza'
    },
    { 
      id: 3, 
      img: '/images/Pagina_inicio/Paisaje_3.jpg', 
      title: 'Parque Natural La Marcada', 
      location: 'Municipio de Dosquebradas',
      description: 'Senderos ecológicos y miradores naturales'
    },
  ]);

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

  const handleRemoveFavorite = (id) => {
    setFavoritos(favoritos.filter(fav => fav.id !== id));
  };

  const handleNavigateToSite = (id) => {
    navigate(`/sitio/${id}`);
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-[#0b2f2a] via-[#0f3f38] to-[#0b2f2a] text-white overflow-x-hidden">
      
      {/* Hero Section */}
      <section className="relative pt-24 pb-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Mis Favoritos
            </h1>
            <p className="text-lg text-emerald-100/80 max-w-2xl mx-auto">
              {user?.name}, aquí encontrarás todos los sitios que has guardado como favoritos
            </p>
          </div>

          {/* Contador de favoritos */}
          <div className="flex items-center justify-center gap-2 mb-8">
            <svg className="w-6 h-6 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
            </svg>
            <span className="text-emerald-100/80 text-sm">
              {favoritos.length} {favoritos.length === 1 ? 'sitio guardado' : 'sitios guardados'}
            </span>
          </div>

          {/* Grid de Favoritos */}
          {favoritos.length === 0 ? (
            <div className="text-center py-16">
              <svg className="w-24 h-24 mx-auto mb-6 text-emerald-400/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              <h3 className="text-xl font-semibold text-white mb-2">
                Aún no tienes favoritos
              </h3>
              <p className="text-emerald-100/60 mb-6">
                Explora nuestra colección y guarda los sitios que más te gusten
              </p>
              <button
                onClick={() => navigate('/coleccion')}
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
                  className="group relative bg-white/5 backdrop-blur rounded-2xl overflow-hidden ring-1 ring-white/10 hover:ring-emerald-400/50 transition-all duration-300 hover:scale-105"
                >
                  {/* Imagen */}
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={fav.img}
                      alt={fav.title}
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
                    <h3 className="text-lg font-semibold text-white mb-2 line-clamp-1">
                      {fav.title}
                    </h3>
                    <div className="flex items-center gap-1 text-emerald-300/80 text-sm mb-3">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                      </svg>
                      <span className="line-clamp-1">{fav.location}</span>
                    </div>
                    <p className="text-emerald-100/60 text-sm line-clamp-2">
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

      {/* Footer */}
      <footer className="border-t border-white/10 bg-[#0a2621] py-12 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <img src="/images/Pagina_inicio/nature-svgrepo-com.svg" alt="Logo" className="h-8 w-8" />
            <div className="flex flex-col leading-tight">
              <span className="text-sm font-bold text-white">Conexion</span>
              <span className="text-sm font-light text-emerald-100/80">EcoRisaralda</span>
            </div>
          </div>
          <p className="text-emerald-100/60 text-sm">
            © 2025 Conexion EcoRisaralda. Todos los derechos reservados.
          </p>
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
