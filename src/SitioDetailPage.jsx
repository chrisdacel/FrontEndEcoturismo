import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getPlaceById } from './services/placesApi';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

export default function SitioDetailPage({
  onNavigateHome,
  onNavigateLogin,
  onNavigateRegister,
  onNavigateSobreNosotros,
  onNavigatePrivacidad,
}) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [sitio, setSitio] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getPlaceById(id);
        setSitio(data.place || data);
      } catch (err) {
        setError(err.message || 'Error cargando el sitio');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  // Inicializar mapa cuando sitio esté cargado
  useEffect(() => {
    if (sitio && sitio.lat && sitio.lng && mapRef.current && !mapInstanceRef.current) {
      // Inicializar mapa
      mapInstanceRef.current = L.map(mapRef.current).setView([sitio.lat, sitio.lng], 13);

      // Agregar capa de tiles
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(mapInstanceRef.current);

      // Agregar marcador
      L.marker([sitio.lat, sitio.lng]).addTo(mapInstanceRef.current)
        .bindPopup(`<b>${sitio.name}</b><br>${sitio.localization.substring(0, 50)}...`)
        .openPopup();
    }

    // Cleanup
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [sitio]);

  const storageUrl = (path) => (path ? `http://localhost:8000/storage/${path}` : '');

  if (loading) {
    return (
      <div className="min-h-screen bg-white grid place-items-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-emerald-400/30 border-t-emerald-500" />
      </div>
    );
  }
  if (error) {
    return (
      <div className="min-h-screen bg-white grid place-items-center p-6">
        <div className="max-w-md text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-2">No se pudo cargar el sitio</h2>
          <p className="text-slate-600 mb-4">{error}</p>
          <button onClick={() => navigate('/coleccion')} className="rounded-full bg-emerald-600 px-6 py-3 text-white">Volver a Colección</button>
        </div>
      </div>
    );
  }
  if (!sitio) {
    return null;
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-white text-slate-900">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(76,175,80,0.08),transparent_35%)]" />

      <main>
        {/* Hero Section */}
        <section
          className="relative min-h-[70vh] bg-cover bg-center flex items-center"
          style={{ backgroundImage: `url('${storageUrl(sitio.cover)}')` }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-black/30 to-transparent"></div>
          <div className="relative z-10 w-full">
            <div className="mx-auto max-w-7xl px-6 py-16">
              <div className="max-w-2xl">
                <span className="inline-flex items-center gap-3 rounded-full bg-emerald-50/20 px-4 py-2 text-sm text-emerald-100 ring-1 ring-white/20">
                  Ecoturismo
                </span>
                <h1 className="mt-4 text-4xl md:text-5xl font-bold leading-tight text-white">{sitio.name}</h1>
                <p className="mt-3 text-lg md:text-xl text-emerald-100/90 max-w-xl">
                  {sitio.slogan}
                </p>
                <div className="mt-6">
                  <button 
                    className="rounded-full bg-emerald-600 px-6 py-3 font-semibold text-white shadow-lg shadow-emerald-500/20 transition hover:-translate-y-0.5 hover:bg-emerald-700"
                    onClick={() => navigate('/coleccion')}
                  >
                    Volver a Colección
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Description Section */}
        <section className="py-16 px-6 bg-white">
          <div className="max-w-4xl mx-auto text-center">
            <p className="text-lg text-slate-600 leading-relaxed">
              {sitio.description}
            </p>
          </div>
        </section>

        {/* Localización Section */}
        <section className="py-16 px-6 bg-emerald-50/30">
          <div className="max-w-7xl mx-auto">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div className="order-2 md:order-1">
                <h2 className="text-3xl font-semibold text-emerald-700 mb-4">Localización</h2>
                <p className="text-slate-600 leading-relaxed">
                  {sitio.localization}
                </p>
              </div>
              <div className="order-1 md:order-2">
                {sitio.lat && sitio.lng ? (
                  <div 
                    ref={mapRef}
                    className="w-full h-80 rounded-lg border border-emerald-100 shadow-sm shadow-emerald-100/50 overflow-hidden"
                  ></div>
                ) : (
                  <div className="w-full h-80 grid place-items-center rounded-lg border border-emerald-100 bg-emerald-50/50 text-slate-500">
                    Mapa no disponible
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Clima Section */}
        <section className="py-16 px-6 bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div className="order-1">
                <img
                  src={storageUrl(sitio.Weather_img)}
                  alt="Vegetación y clima"
                  className="w-full h-80 object-cover rounded-lg border border-emerald-100 shadow-sm shadow-emerald-100/50"
                />
              </div>
              <div className="order-2">
                <h2 className="text-3xl font-semibold text-emerald-700 mb-4">Clima</h2>
                <p className="text-slate-600 leading-relaxed">
                  {sitio.Weather}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Características Section */}
        <section className="py-16 px-6 bg-emerald-50/30">
          <div className="max-w-7xl mx-auto">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div className="order-2 md:order-1">
                <h2 className="text-3xl font-semibold text-emerald-700 mb-4">Características</h2>
                <p className="text-slate-600 leading-relaxed">
                  {sitio.features}
                </p>
              </div>
              <div className="order-1 md:order-2">
                <img
                  src={storageUrl(sitio.features_img)}
                  alt="Vista de montaña y reserva natural"
                  className="w-full h-80 object-cover rounded-lg border border-emerald-100 shadow-sm shadow-emerald-100/50"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Flora y Fauna Section */}
        <section className="py-16 px-6 bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div className="order-1">
                <img
                  src={storageUrl(sitio.flora_img)}
                  alt="Flora y fauna del parque"
                  className="w-full h-80 object-cover rounded-lg border border-emerald-100 shadow-sm shadow-emerald-100/50"
                />
              </div>
              <div className="order-2">
                <h2 className="text-3xl font-semibold text-emerald-700 mb-4">Flora y Fauna</h2>
                <p className="text-slate-600 leading-relaxed">
                  {sitio.flora}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Infraestructura Section */}
        <section className="py-16 px-6 bg-emerald-50/30">
          <div className="max-w-7xl mx-auto">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div className="order-2 md:order-1">
                <h2 className="text-3xl font-semibold text-emerald-700 mb-4">Infraestructura</h2>
                <p className="text-slate-600 leading-relaxed">
                  {sitio.estructure}
                </p>
              </div>
              <div className="order-1 md:order-2">
                <img
                  src={storageUrl(sitio.estructure_img)}
                  alt="Infraestructura del parque"
                  className="w-full h-80 object-cover rounded-lg border border-emerald-100 shadow-sm shadow-emerald-100/50"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Recomendaciones Section */}
        <section className="py-16 px-6 bg-white">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-semibold text-emerald-700 mb-6">Recomendaciones</h2>
            <p className="text-slate-600 leading-relaxed">
              {sitio.tips}
            </p>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-emerald-100 bg-emerald-50/50 py-12 px-6 text-slate-700">
        <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-8">
          {/* Column 1 */}
          <div>
            <h2 className="text-2xl font-bold mb-2 text-slate-900">Conexion</h2>
            <p className="text-slate-700 mb-4">EcoRisaralda</p>
            <div className="flex gap-4 mb-4 text-emerald-600">
              <a href="#" className="hover:text-emerald-800 transition">
                <i className="fab fa-facebook text-xl"></i>
              </a>
              <a href="#" className="hover:text-emerald-800 transition">
                <i className="fab fa-linkedin text-xl"></i>
              </a>
              <a href="#" className="hover:text-emerald-800 transition">
                <i className="fab fa-youtube text-xl"></i>
              </a>
              <a href="#" className="hover:text-emerald-800 transition">
                <i className="fab fa-instagram text-xl"></i>
              </a>
            </div>
            <div className="flex items-center gap-2">
              <span>🌐</span>
              <select className="bg-white text-slate-700 px-2 py-1 rounded border border-emerald-200">
                <option>Español</option>
                <option>English</option>
              </select>
            </div>
          </div>

          {/* Column 2 */}
          <div>
            <h4 className="text-lg font-bold mb-4 text-slate-900">Información</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="text-slate-700 hover:text-slate-900">Conexión EcoRisaralda</a></li>
              <li><a href="#" className="text-slate-700 hover:text-slate-900">Descripción</a></li>
              <li><a href="#" className="text-slate-700 hover:text-slate-900">Lema</a></li>
            </ul>
          </div>

          {/* Column 3 */}
          <div>
            <h4 className="text-lg font-bold mb-4 text-slate-900">Navegación rápida</h4>
            <ul className="space-y-2 text-sm text-slate-700">
              <li><button onClick={onNavigateHome} className="text-left hover:text-slate-900">Inicio</button></li>
              <li><button onClick={onNavigateSobreNosotros} className="text-left hover:text-slate-900">Sobre nosotros</button></li>
              <li><button onClick={onNavigatePrivacidad} className="text-left hover:text-slate-900">Políticas</button></li>
            </ul>
          </div>

          {/* Column 4 */}
          <div>
            <h4 className="text-lg font-bold mb-4 text-slate-900">Contacto y soporte</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="mailto:ecorisaralda@contacto.com" className="text-slate-700 hover:text-slate-900">ecorisaralda@contacto.com</a></li>
              <li><a href="#" className="text-slate-700 hover:text-slate-900">300 445 80055</a></li>
              <li><a href="#" className="text-slate-700 hover:text-slate-900">Preguntas</a></li>
            </ul>
          </div>
        </div>

        {/* Footer bottom */}
        <div className="max-w-7xl mx-auto mt-12 border-t border-emerald-100 pt-6 text-center text-sm text-slate-600">
          <p className="mb-2"><em>Conectando viajeros con la naturaleza. Explora, guarda y comparte experiencias únicas.</em></p>
          <p>© 2025 Conexión EcoRisaralda – Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  );
}
