import { useState, useEffect, useCallback, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebook, faLinkedin, faYoutube, faInstagram } from '@fortawesome/free-brands-svg-icons';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { getAllPlaces } from './services/placesApi';
import { api, fetchRecommendations } from './services/api';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix para los iconos de Leaflet en Vite/React
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

const greenMarkerSvg = `data:image/svg+xml,${encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" width="25" height="41" viewBox="0 0 25 41">'
  + '<path d="M12.5 0C5.6 0 0 5.6 0 12.5c0 9.4 12.5 28.5 12.5 28.5S25 21.9 25 12.5C25 5.6 19.4 0 12.5 0z" fill="#16a34a" stroke="#0f6b2a" stroke-width="1"/>'
  + '<circle cx="12.5" cy="12.5" r="4.5" fill="#ffffff" fill-opacity="0.9"/>'
  + '</svg>'
)}`;

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: greenMarkerSvg,
  iconRetinaUrl: greenMarkerSvg,
  shadowUrl: markerShadow,
});

export default function ColeccionPage({ onNavigateHome, onNavigateLogin, onNavigatePrivacidad, onNavigateSobreNosotros }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const [scrollToTop, setScrollToTop] = useState(false);
  const [carouselIndex, setCarouselIndex] = useState([0, 0, 0]);
  const [sitiosAPI, setSitiosAPI] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState('');
  const [favoriteIds, setFavoriteIds] = useState(new Set());
  const [recommendations, setRecommendations] = useState([]);
  const [recommendationsLoading, setRecommendationsLoading] = useState(false);
  const [randomRecommendations, setRandomRecommendations] = useState([]);
  const mapRef = useRef(null);
  const mapContainerRef = useRef(null);
  const markersLayerRef = useRef(null);

  const loadSites = useCallback(async (query = searchText) => {
    try {
      setLoading(true);
      const data = await getAllPlaces(query);
      setSitiosAPI(data);
    } catch (error) {
      console.error('Error cargando sitios:', error);
    } finally {
      setLoading(false);
    }
  }, [searchText]);

  // Cargar sitios desde la API
  useEffect(() => {
    loadSites();
  }, [loadSites]);

  useEffect(() => {
    if (location.hash !== '#recomendaciones') return;
    const target = document.getElementById('recomendaciones');
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [location.hash]);

  const handleSearch = async () => {
    setLoading(true);
    await loadSites(searchText);
  };

  const isTourist = user && user.role !== 'admin' && user.role !== 'operator';
  const isAdminOrOperator = user && (user.role === 'admin' || user.role === 'operator');
  const isGuest = !user;
  const shortText = (value, max = 110) => {
    if (!value) return '';
    const text = value.toString().trim();
    return text.length > max ? `${text.slice(0, max - 3)}...` : text;
  };

  const loadFavorites = useCallback(async () => {
    if (!isTourist) return;
    try {
      const response = await api.get('/api/favorites');
      const ids = new Set((response.data || []).map((fav) => fav.id));
      setFavoriteIds(ids);
    } catch (error) {
      console.error('Error cargando favoritos:', error);
    }
  }, [isTourist]);

  useEffect(() => {
    loadFavorites();
  }, [loadFavorites]);

  useEffect(() => {
    const loadRecommendations = async () => {
      if (!isTourist) return;
      try {
        setRecommendationsLoading(true);
        const data = await fetchRecommendations();
        setRecommendations(Array.isArray(data) ? data : []);
      } catch (error) {
        setRecommendations([]);
      } finally {
        setRecommendationsLoading(false);
      }
    };
    loadRecommendations();
  }, [isTourist]);

  useEffect(() => {
    if (isTourist) {
      if (recommendations.length > 0) {
        setRandomRecommendations([]);
        return;
      }

      if (sitiosAPI.length === 0) return;

      const shuffled = [...sitiosAPI].sort(() => Math.random() - 0.5);
      setRandomRecommendations(shuffled);
      return;
    }

    if (!isAdminOrOperator && !isGuest) return;
    if (sitiosAPI.length === 0) {
      setRandomRecommendations([]);
      return;
    }

    const shuffled = [...sitiosAPI].sort(() => Math.random() - 0.5);
    setRandomRecommendations(shuffled);
  }, [isTourist, isAdminOrOperator, isGuest, recommendations, sitiosAPI]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleToggleFavorite = async (event, sitioId) => {
    event.stopPropagation();
    if (!user) {
      onNavigateLogin?.();
      return;
    }
    if (!isTourist) return;

    const isFavorite = favoriteIds.has(sitioId);
    try {
      if (isFavorite) {
        await api.delete(`/api/places/${sitioId}/favorite`);
      } else {
        await api.post(`/api/places/${sitioId}/favorite`);
      }
      setFavoriteIds((prev) => {
        const next = new Set(prev);
        if (isFavorite) {
          next.delete(sitioId);
        } else {
          next.add(sitioId);
        }
        return next;
      });
    } catch (error) {
      console.error('Error actualizando favorito:', error);
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
      imagen: '/images/sitios/Departamento-Risaralda-de-Colombia-10.jpg',
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

  // Inicializar mapa
  useEffect(() => {
    if (isGuest) return;
    if (!mapContainerRef.current || mapRef.current) return;

    const map = L.map(mapContainerRef.current).setView([4.8087, -75.6906], 9);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; OpenStreetMap',
    }).addTo(map);

    mapRef.current = map;
    markersLayerRef.current = L.layerGroup().addTo(map);

    return () => {
      map.remove();
      mapRef.current = null;
      markersLayerRef.current = null;
    };
  }, [isGuest]);

  // Pintar pines en el mapa cuando cambian los sitios
  useEffect(() => {
    if (isGuest) return;
    if (!mapRef.current || !markersLayerRef.current) return;

    const layer = markersLayerRef.current;
    layer.clearLayers();

    const bounds = [];
    sitiosAPI.forEach((sitio) => {
      const lat = parseFloat(sitio.lat);
      const lng = parseFloat(sitio.lng);
      if (Number.isFinite(lat) && Number.isFinite(lng)) {
        const marker = L.marker([lat, lng]);
        const labelNames = Array.isArray(sitio.label)
          ? sitio.label.map((label) => label?.name ?? label)
          : Array.isArray(sitio.labels)
            ? sitio.labels.map((label) => label?.name ?? label)
            : [];
        const labelsText = labelNames.filter(Boolean).slice(0, 3).join(' • ') || 'Sin etiqueta';
        const popupHtml = `
          <div class="popup-card" style="display:flex;flex-direction:column;gap:6px;cursor:pointer;max-width:220px;">
            <strong style="font-size:14px;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;">${sitio.name || 'Sitio'}</strong>
            <span style="font-size:12px;color:#059669;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;">${labelsText}</span>
          </div>
        `;
        marker.bindPopup(popupHtml);
        marker.on('popupopen', (e) => {
          const popupEl = e.popup.getElement();
          const card = popupEl?.querySelector('.popup-card');
          if (card && !card.dataset.bound) {
            card.dataset.bound = 'true';
            card.addEventListener('click', () => {
              if (user?.role === 'admin') {
                navigate(`/admin/sitio/${sitio.id}`);
              } else if (user && user.role !== 'operator') {
                navigate(`/turista/sitio/${sitio.id}`);
              } else {
                navigate(`/sitio/${sitio.id}`);
              }
            });
          }
        });
        marker.addTo(layer);
        bounds.push([lat, lng]);
      }
    });

    if (bounds.length > 0) {
      mapRef.current.fitBounds(bounds, { padding: [30, 30] });
    }
  }, [sitiosAPI, isGuest]);

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

  const baseFallback = recommendations.length === 0 ? randomRecommendations : sitiosAPI;
  const fallbackRecommendations = baseFallback.filter((item) => item?.id && !recommendations.some((rec) => rec.id === item.id));
  const recommendedList = isTourist
    ? [...recommendations, ...fallbackRecommendations].slice(0, 8)
    : ((isAdminOrOperator || isGuest) ? randomRecommendations.slice(0, 8) : recomendaciones);
  const storageUrl = (path) => (path ? `http://localhost:8000/api/files/${path}` : '');

  return (
    <div className="min-h-screen coleccion-shell text-slate-900 overflow-x-hidden pt-14">
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

      <main className="pt-0">
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
                      className={`object-cover rounded-[22px] shadow-lg w-[140px] h-[320px] md:w-[170px] md:h-[380px] lg:w-[200px] lg:h-[440px] ${idx === 1 ? 'h-[340px] md:h-[410px] lg:h-[470px]' : ''}`}
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
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Buscar destinos..."
                  className="w-full rounded-lg border border-emerald-200 px-3 py-2 outline-none focus:ring-2 focus:ring-emerald-300"
                />
                <button onClick={handleSearch} className="rounded-lg bg-emerald-600 px-4 py-2 text-white hover:bg-emerald-700 transition">Buscar</button>
              </div>
            </div>
          </div>
        </section>

        {/* Sección 2: Sitios Creados desde la API */}
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
            ) : sitiosAPI.length === 0 ? (
              searchText.trim() !== '' ? (
                <div className="px-6 md:px-12 py-12 text-center text-slate-600">No se encontraron sitios para "{searchText}"</div>
              ) : null
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 px-6 md:px-12">
                {sitiosAPI.map((sitio, index) => (
                  <article
                    key={sitio.id}
                    className="group cursor-pointer rounded-lg border border-emerald-100 bg-white shadow-sm shadow-emerald-100/50 overflow-hidden hover:shadow-lg transition relative stagger-item"
                    style={{ '--stagger-delay': `${Math.min(index, 12) * 40}ms` }}
                    onClick={() => {
                      if (user?.role === 'admin') {
                        navigate(`/admin/sitio/${sitio.id}`);
                      } else if (user && user.role !== 'operator') {
                        navigate(`/turista/sitio/${sitio.id}`);
                      } else {
                        navigate(`/sitio/${sitio.id}`);
                      }
                    }}
                  >
                    {/* Estado de aprobación para admin */}
                    {(user?.role === 'admin' || (user?.role === 'operator' && sitio.user_id === user.id)) && (
                      <span
                        className={`absolute right-3 top-3 z-20 inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold shadow transition
                          ${
                            sitio.approval_status === 'approved'
                              ? 'bg-emerald-500/90 text-white shadow-emerald-500/30'
                              : sitio.approval_status === 'rejected'
                                ? 'bg-rose-500/90 text-white shadow-rose-500/30'
                                : 'bg-yellow-400/90 text-yellow-900 shadow-yellow-400/30'
                          }
                        `}
                        title={`Estado: ${
                          sitio.approval_status === 'approved'
                            ? 'Aprobado'
                            : sitio.approval_status === 'rejected'
                              ? 'Rechazado'
                              : 'Pendiente'
                        }`}
                      >
                        {sitio.approval_status === 'approved'
                          ? 'Aprobado'
                          : sitio.approval_status === 'rejected'
                            ? 'Rechazado'
                            : 'Pendiente'}
                      </span>
                    )}
                    {user?.role === 'operator' && sitio.user_id === user.id && (
                      <span className="absolute left-3 top-3 z-10 inline-flex items-center gap-1 rounded-full bg-emerald-600 px-3 py-1 text-xs font-semibold text-white shadow-sm">
                        <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M12 3l2.5 5 5.5.8-4 3.9.9 5.6-4.9-2.6-4.9 2.6.9-5.6-4-3.9 5.5-.8L12 3z" />
                        </svg>
                        Tu sitio
                      </span>
                    )}
                    {isTourist && (
                      <button
                        type="button"
                        onClick={(event) => handleToggleFavorite(event, sitio.id)}
                        className={`absolute right-3 top-3 z-10 inline-flex h-10 w-10 items-center justify-center rounded-full ring-1 transition ${
                          favoriteIds.has(sitio.id)
                            ? 'bg-emerald-600 text-white ring-emerald-200'
                            : 'bg-white/90 text-emerald-700 ring-emerald-100 hover:bg-emerald-50'
                        }`}
                        aria-label="Guardar en favoritos"
                        title="Guardar en favoritos"
                      >
                        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z" />
                        </svg>
                      </button>
                    )}
                    <div className="h-48 w-full overflow-hidden">
                      <img
                        src={`http://localhost:8000/api/files/${sitio.cover}`}
                        alt={sitio.name}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="text-lg font-semibold text-slate-900 mb-2">{shortText(sitio.name, 44)}</h3>
                      {isGuest ? (
                        <>
                          <p className="text-sm text-slate-600 mb-2">{shortText(sitio.description || sitio.slogan, 120)}</p>
                          <p className="text-xs text-emerald-600">Registrate para ver mas detalles.</p>
                        </>
                      ) : (
                        <>
                          <p className="text-sm text-slate-600 mb-2">{shortText(sitio.slogan, 90)}</p>
                          <p className="text-xs text-emerald-600">📍 {shortText(sitio.localization, 70)}</p>
                        </>
                      )}
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>
        

        {/* Botón de Crear Sitio si no hay sitios */}
        {sitiosAPI.length === 0 && !loading && searchText.trim() === '' && (user?.role === 'admin' || user?.role === 'operator') && (
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
        <section id="recomendaciones" className="w-full bg-white py-16 pb-20 px-0 md:px-0">
          <h2 className="mb-8 px-6 md:px-12 text-3xl font-bold">Recomendaciones</h2>

          {/* Carril con scroll horizontal y snap */}
          <div className="overflow-x-auto scrollbar-none px-6 md:px-12">
            <div className="flex gap-6 md:gap-8 snap-x snap-mandatory">
              {recommendationsLoading ? (
                <div className="text-sm text-slate-600">Cargando recomendaciones...</div>
              ) : recommendedList.length === 0 ? (
                <div className="text-sm text-slate-600">No hay recomendaciones disponibles.</div>
              ) : (
                recommendedList.map((rec, index) => (
                  <article
                    key={rec.id}
                    className="group relative shrink-0 snap-start w-[260px] sm:w-[300px] md:w-[340px] aspect-[9/16] rounded-[26px] overflow-hidden shadow-xl cursor-pointer stagger-item"
                    style={{ '--stagger-delay': `${Math.min(index, 10) * 50}ms` }}
                    onClick={() => {
                      if (user?.role === 'admin') {
                        navigate(`/admin/sitio/${rec.id}`);
                      } else if (user && user.role !== 'operator') {
                        navigate(`/turista/sitio/${rec.id}`);
                      } else {
                        navigate(`/sitio/${rec.id}`);
                      }
                    }}
                  >
                    {/* Imagen */}
                    <img
                      src={rec.imagen || storageUrl(rec.cover)}
                      alt={rec.nombre || rec.name}
                      className="absolute inset-0 h-full w-full object-cover rounded-[26px] origin-center transform transition-transform duration-700 ease-out group-hover:scale-105"
                    />

                    {/* Gradiente y contenido que aparecen en hover */}
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 rounded-[26px]" />

                    <div className="absolute inset-0 flex flex-col justify-between p-5 opacity-0 transition-opacity duration-300 group-hover:opacity-100 rounded-[26px]">
                      <div className="relative z-10 space-y-1 text-white">
                        <p className="text-white/80 text-xs font-semibold">Recomendado</p>
                        <h3 className="text-2xl font-bold leading-tight">{shortText(rec.nombre || rec.name, 38)}</h3>
                        <p className="text-sm">{shortText(rec.slogan || 'Explora este destino increíble', 84)}</p>
                      </div>
                      <div className="relative z-10 flex items-center justify-between">
                        <div className="flex flex-wrap gap-2">
                          {(Array.isArray(rec.label) && rec.label.length > 0 ? rec.label : [{ id: 'none', name: 'Sin etiquetas' }])
                            .slice(0, 3)
                            .map((label, idx) => (
                              <span
                                key={label.id ?? `${rec.id}-label-${idx}`}
                                className="rounded-full bg-white/20 text-white text-xs px-3 py-1 backdrop-blur"
                              >
                                {label.name || 'Etiqueta'}
                              </span>
                            ))}
                        </div>
                        <button className="grid place-items-center h-8 w-8 rounded-full bg-black/40 text-white backdrop-blur hover:bg-black/60 transition">+</button>
                      </div>
                    </div>
                  </article>
                ))
              )}
            </div>
          </div>
        </section>

        {/* Sección 4: Mapa de sitios turísticos */}
        {!isGuest ? (
          <section className="w-full bg-white pb-20">
            <div className="px-6 md:px-12 mb-6">
              <h2 className="text-3xl font-bold">Mapa de sitios turísticos</h2>
              <p className="text-slate-600 mt-2">Explora los sitios agregados en tiempo real.</p>
            </div>
            <div className="px-6 md:px-12">
              <div ref={mapContainerRef} className="w-full h-[520px] rounded-2xl ring-1 ring-emerald-100 shadow-lg" />
            </div>
          </section>
        ) : (
          <section className="w-full bg-white pb-20">
            <div className="px-6 md:px-12">
              <div className="rounded-2xl border border-emerald-100 bg-emerald-50/60 p-6 text-center">
                <h3 className="text-xl font-semibold text-emerald-700 mb-2">Registrate para ver el mapa completo</h3>
                <p className="text-sm text-slate-600">Accede a ubicaciones exactas y rutas sugeridas.</p>
              </div>
            </div>
          </section>
        )}
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
