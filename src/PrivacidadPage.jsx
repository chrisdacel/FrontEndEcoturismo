import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebook, faLinkedin, faYoutube, faInstagram } from '@fortawesome/free-brands-svg-icons';

function PrivacidadPage({ onNavigateHome, onNavigateLogin, onNavigateRegister }) {
  const [heroVisible, setHeroVisible] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setHeroVisible(true), 50);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const onScroll = () => setShowScrollTop(window.scrollY > 100);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  return (
    <div className="flex min-h-screen flex-col bg-white text-slate-900 overflow-x-hidden">
      {/* Hero: más alto, texto inferior izquierda, overlay con crossfade */}
      <section className="relative min-h-[70vh] w-full overflow-hidden bg-cover bg-center" style={{ backgroundImage: "url('/images/Sobre_Nosotros/fondo ciudad.jpg')" }}>
        <div className={`absolute inset-0 bg-gradient-to-r from-white via-white/70 to-transparent md:from-white md:via-white/50 md:to-black/10 transition-opacity duration-500 ${heroVisible ? 'opacity-100' : 'opacity-0'}`} />
        <div className={`absolute bottom-8 left-6 md:bottom-12 md:left-12 z-10 transition-all duration-700 ${heroVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900">Política de Privacidad</h1>
          <p className="mt-3 max-w-2xl text-base md:text-lg text-slate-700 leading-relaxed">Cómo protegemos tus datos y qué derechos tienes.</p>
        </div>
      </section>

      {/* Scroll to top */}
      {showScrollTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-6 right-6 z-50 rounded-full bg-emerald-500 px-3 py-3 text-white shadow-lg shadow-emerald-500/40 transition hover:scale-110 hover:bg-emerald-600"
          aria-label="Volver arriba"
        >
          ↑
        </button>
      )}

      {/* Main Content */}
      <main className="mx-auto mb-12 mt-10 md:mt-14 flex w-[90%] max-w-5xl flex-1 flex-col gap-12 px-5 md:px-10">
        <div>
          <h2 className="mb-4 text-3xl md:text-4xl font-semibold text-slate-900">Introducción</h2>
          <p className="text-base md:text-lg text-slate-700 leading-relaxed">
            En Conexión EcoRisaralda valoramos y protegemos tu privacidad. Esta Política de Privacidad
            describe cómo recopilamos, usamos y protegemos los datos personales que nos facilitas al registrarte
            como Turista o Empleado, así como al navegar y utilizar nuestra web de ecoturismo.
          </p>
        </div>

        <div>
          <h2 className="mb-4 text-2xl md:text-3xl font-semibold text-slate-900">1. Responsable del tratamiento</h2>
          <p className="text-base md:text-lg text-slate-700 leading-relaxed">
            La entidad responsable del tratamiento de tus datos es EcoRisaralda,
            con domicilio en Calle 21 55 a y correo de contacto conexion@ecorisaralda.co.
          </p>
        </div>

        <div>
          <h2 className="mb-4 text-2xl md:text-3xl font-semibold text-slate-900">2. Datos que recopilamos</h2>
          <ul className="list-inside list-disc space-y-2 text-base md:text-lg text-slate-700 leading-relaxed">
            <li>Datos de identificación: nombre, apellidos, dirección de correo electrónico, fecha de nacimiento.</li>
            <li>Datos de acceso: nombre de usuario, contraseña en formato cifrado.</li>
            <li>Datos de perfil (opcional): fotografía, preferencias de viaje, intereses ecológicos.</li>
            <li>Datos de actividad: historial de destinos guardados, opiniones publicadas, eventos consultados.</li>
            <li>Datos técnicos: dirección IP, tipo de dispositivo, sistema operativo, cookies y datos de navegación.</li>
          </ul>
        </div>

        <div>
          <h2 className="mb-4 text-2xl md:text-3xl font-semibold text-slate-900">3. Finalidades del tratamiento</h2>
          <p className="mb-4 text-base md:text-lg text-slate-700 leading-relaxed">
            Recogemos y tratamos tus datos para las siguientes finalidades:
          </p>
          <ul className="list-inside list-disc space-y-2 text-base md:text-lg text-slate-700 leading-relaxed">
            <li>Registro y autenticación: permitir el acceso seguro a tu cuenta de Turista o Empleado.</li>
            <li>Gestión de beneficios: otorgar y personalizar descuentos, notificaciones y recomendaciones adaptadas a turísticas</li>
            <li>Comunicación: enviarte correos electrónicos o notificaciones push sobre eventos, ofertas y cambios en el servicio.</li>
            <li>Mejora del servicio: analizar el uso de la plataforma para optimizar funcionalidades y contenidos.</li>
            <li>Atención al usuario: gestionar consultas, sugerencias y reclamaciones.</li>
          </ul>
        </div>

        <div>
          <h2 className="mb-4 text-2xl md:text-3xl font-semibold text-slate-900">4. Legitimación</h2>
          <p className="mb-4 text-base md:text-lg text-slate-700 leading-relaxed">El tratamiento de tus datos se basa en:</p>
          <ul className="list-inside list-disc space-y-2 text-base md:text-lg text-slate-700 leading-relaxed">
            <li>Tu consentimiento al aceptar esta Política y al marcar las casillas de registro</li>
            <li>La ejecución de un contrato cuando accedes a funciones de pago o beneficios exclusivos.</li>
            <li>El interés legítimo en mejorar y proteger la plataforma, siempre garantizando la mínima intrusión</li>
          </ul>
        </div>

        <div>
          <h2 className="mb-4 text-2xl md:text-3xl font-semibold text-slate-900">5. Destinatarios de los datos</h2>
          <p className="mb-4 text-base md:text-lg text-slate-700 leading-relaxed">
            No cederemos ni compartiremos tus datos personales con terceros salvo en los siguientes casos:
          </p>
          <ul className="list-inside list-disc space-y-2 text-base md:text-lg text-slate-700 leading-relaxed">
            <li>Proveedores de servicios que colaboran en el envío de correos o gestión de datos (hosting, servidores de correo).</li>
            <li>Autoridades competentes, si legalmente se nos requiere.</li>
            <li>Empresas colaboradoras, solo si marcas expresamente tu consentimiento para promociones conjuntas.</li>
          </ul>
        </div>

        <div>
          <h2 className="mb-4 text-2xl md:text-3xl font-semibold text-slate-900">6. Derechos de los usuarios</h2>
          <p className="mb-4 text-base md:text-lg text-slate-700 leading-relaxed">Como usuario, tienes derecho a:</p>
          <ul className="list-inside list-disc space-y-2 text-base md:text-lg text-slate-700 leading-relaxed">
            <li>Acceder a tus datos y conocer qué tratamos.</li>
            <li>Rectificar información inexacta o incompleta</li>
            <li>Suprimir tus datos ("derecho al olvido").</li>
            <li>Oponerte al tratamiento de tus datos en determinadas circunstancias.</li>
            <li>
              Solicitar la limitación del tratamiento o la portabilidad de la información.
              Para ejercer tus derechos, envía un correo a contacto conexion@ecorisaralda.co con "Protección de Datos" en el asunto, indicando tu nombre y la solicitud.
            </li>
          </ul>
        </div>

        <div>
          <h2 className="mb-4 text-2xl md:text-3xl font-semibold text-slate-900">7. Conservación de los datos</h2>
          <ul className="list-inside list-disc space-y-2 text-base md:text-lg text-slate-700 leading-relaxed">
            <li>Los datos de cuenta y perfil se conservarán mientras mantengas tu usuario activo</li>
            <li>Los datos de navegación y actividad se guardarán, de forma agregada y anónima, hasta 24 meses para fines estadísticos</li>
            <li>Una vez cancelada tu cuenta, tu información personal será bloqueada y eliminada en un plazo máximo de 30 días, salvo obligación legal en contrario.</li>
          </ul>
        </div>

        <div>
          <h2 className="mb-4 text-2xl md:text-3xl font-semibold text-slate-900">8. Seguridad</h2>
          <p className="text-base md:text-lg text-slate-700 leading-relaxed">
            Implementamos medidas técnicas y organizativas apropiadas para garantizar la seguridad e
            integridad de tus datos, como cifrado SSL, almacenamiento en servidores seguros y protocolos de control de acceso.
          </p>
        </div>

        <div>
          <h2 className="mb-4 text-2xl md:text-3xl font-semibold text-slate-900">9. Menores de edad</h2>
          <p className="text-base md:text-lg text-slate-700 leading-relaxed">
            Nuestro sitio no está dirigido a menores de 16 años. Si eres menor, no
            debes registrarte. Si tenemos conocimiento de que hemos recogido datos de un menor
            sin consentimiento parental, procederemos a su eliminación inmediata
          </p>
        </div>

        <div>
          <h2 className="mb-4 text-2xl md:text-3xl font-semibold text-slate-900">10. Cookies y tecnologías similares</h2>
          <p className="mb-4 text-base md:text-lg text-slate-700 leading-relaxed">Utilizamos cookies propias y de terceros para:</p>
          <ul className="list-inside list-disc space-y-2 text-base md:text-lg text-slate-700 leading-relaxed">
            <li>Mejorar tu experiencia de navegación</li>
            <li>Analizar el uso del sitio.</li>
            <li>
              Mostrarte publicidad relevante (siempre con tu consentimiento).
              Puedes configurar o desactivar las cookies desde tu navegador; sin embargo, algunas funcionalidades podrían verse afectadas.
            </li>
          </ul>
        </div>

        <div>
          <h2 className="mb-4 text-2xl md:text-3xl font-semibold text-slate-900">11. Modificaciones de la política</h2>
          <p className="text-base md:text-lg text-slate-700 leading-relaxed">
            Nos reservamos el derecho de actualizar esta Política de Privacidad en cualquier momento.
            Publicaremos la versión vigente con la fecha de la
            última actualización y, si los cambios son sustanciales, te informaremos por correo
          </p>
        </div>

        <div>
          <p className="text-base md:text-lg text-slate-700 leading-relaxed">
            Si tienes cualquier duda o solicitud relacionada con tus datos personales, no dudes en
            contactarnos en contacto conexion@ecorisaralda.co.
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
                <li><button className="text-left hover:text-slate-900">Políticas</button></li>
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

export default PrivacidadPage;
