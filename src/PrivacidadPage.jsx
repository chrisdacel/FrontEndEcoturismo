import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebook, faLinkedin, faYoutube, faInstagram } from '@fortawesome/free-brands-svg-icons';

function PrivacidadPage({ onNavigateHome, onNavigateLogin, onNavigateRegister }) {
  return (
    <div className="flex min-h-screen flex-col bg-white text-slate-900">
      {/* Header */}
      <header className="fixed top-0 z-50 w-full bg-white shadow-sm">
        <div className="flex items-center justify-between px-6 py-4 md:px-12">
          <button onClick={onNavigateHome} className="flex items-center gap-2 hover:opacity-80">
            <img src="/images/Pagina_inicio/nature-svgrepo-com.svg" alt="Logo" className="h-8 w-8" />
            <div>
              <h3 className="text-sm font-bold">Conexion</h3>
              <p className="text-xs text-slate-600">EcoRisaralda</p>
            </div>
          </button>

          <div className="flex items-center gap-4">
            <button
              onClick={onNavigateRegister}
              className="h-10 rounded-lg bg-[#267E1B] px-6 text-sm font-semibold text-white transition hover:bg-white hover:text-[#267E1B] hover:border hover:border-[#267E1B]"
            >
              Registrarse
            </button>
            <button
              onClick={onNavigateLogin}
              className="h-10 rounded-lg border-2 border-[#267E1B] px-6 text-sm font-semibold text-[#267E1B] transition hover:bg-[#267E1B] hover:text-white"
            >
              Iniciar Sesión
            </button>
            <button className="md:hidden">
              <img src="/images/Pagina_inicio/img_drop_down.png" alt="Menu" className="h-8 w-8" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto mt-32 mb-12 flex w-[90%] max-w-5xl flex-1 flex-col gap-12 px-5 md:px-10">
        <div>
          <h1 className="mb-12 text-3xl font-bold text-[#267E1B] md:text-4xl">Política de Privacidad</h1>
          <p className="text-lg text-gray-600 leading-relaxed">
            En Conexión EcoRisaralda valoramos y protegemos tu privacidad. Esta Política de Privacidad
            describe cómo recopilamos, usamos y protegemos los datos personales que nos facilitas al registrarte
            como Turista o Empleado, así como al navegar y utilizar nuestra web de ecoturismo.
          </p>
        </div>

        <div>
          <h2 className="mb-4 text-2xl font-bold text-[#267E1B]">1. Responsable del tratamiento</h2>
          <p className="text-lg text-gray-600 leading-relaxed">
            La entidad responsable del tratamiento de tus datos es EcoRisaralda,
            con domicilio en Calle 21 55 a y correo de contacto conexion@ecorisaralda.co.
          </p>
        </div>

        <div>
          <h2 className="mb-4 text-2xl font-bold text-[#267E1B]">2. Datos que recopilamos</h2>
          <ul className="list-inside list-disc space-y-2 text-lg text-gray-600 leading-relaxed">
            <li>Datos de identificación: nombre, apellidos, dirección de correo electrónico, fecha de nacimiento.</li>
            <li>Datos de acceso: nombre de usuario, contraseña en formato cifrado.</li>
            <li>Datos de perfil (opcional): fotografía, preferencias de viaje, intereses ecológicos.</li>
            <li>Datos de actividad: historial de destinos guardados, opiniones publicadas, eventos consultados.</li>
            <li>Datos técnicos: dirección IP, tipo de dispositivo, sistema operativo, cookies y datos de navegación.</li>
          </ul>
        </div>

        <div>
          <h2 className="mb-4 text-2xl font-bold text-[#267E1B]">3. Finalidades del tratamiento</h2>
          <p className="mb-4 text-lg text-gray-600 leading-relaxed">
            Recogemos y tratamos tus datos para las siguientes finalidades:
          </p>
          <ul className="list-inside list-disc space-y-2 text-lg text-gray-600 leading-relaxed">
            <li>Registro y autenticación: permitir el acceso seguro a tu cuenta de Turista o Empleado.</li>
            <li>Gestión de beneficios: otorgar y personalizar descuentos, notificaciones y recomendaciones adaptadas a turísticas</li>
            <li>Comunicación: enviarte correos electrónicos o notificaciones push sobre eventos, ofertas y cambios en el servicio.</li>
            <li>Mejora del servicio: analizar el uso de la plataforma para optimizar funcionalidades y contenidos.</li>
            <li>Atención al usuario: gestionar consultas, sugerencias y reclamaciones.</li>
          </ul>
        </div>

        <div>
          <h2 className="mb-4 text-2xl font-bold text-[#267E1B]">4. Legitimación</h2>
          <p className="mb-4 text-lg text-gray-600 leading-relaxed">El tratamiento de tus datos se basa en:</p>
          <ul className="list-inside list-disc space-y-2 text-lg text-gray-600 leading-relaxed">
            <li>Tu consentimiento al aceptar esta Política y al marcar las casillas de registro</li>
            <li>La ejecución de un contrato cuando accedes a funciones de pago o beneficios exclusivos.</li>
            <li>El interés legítimo en mejorar y proteger la plataforma, siempre garantizando la mínima intrusión</li>
          </ul>
        </div>

        <div>
          <h2 className="mb-4 text-2xl font-bold text-[#267E1B]">5. Destinatarios de los datos</h2>
          <p className="mb-4 text-lg text-gray-600 leading-relaxed">
            No cederemos ni compartiremos tus datos personales con terceros salvo en los siguientes casos:
          </p>
          <ul className="list-inside list-disc space-y-2 text-lg text-gray-600 leading-relaxed">
            <li>Proveedores de servicios que colaboran en el envío de correos o gestión de datos (hosting, servidores de correo).</li>
            <li>Autoridades competentes, si legalmente se nos requiere.</li>
            <li>Empresas colaboradoras, solo si marcas expresamente tu consentimiento para promociones conjuntas.</li>
          </ul>
        </div>

        <div>
          <h2 className="mb-4 text-2xl font-bold text-[#267E1B]">6. Derechos de los usuarios</h2>
          <p className="mb-4 text-lg text-gray-600 leading-relaxed">Como usuario, tienes derecho a:</p>
          <ul className="list-inside list-disc space-y-2 text-lg text-gray-600 leading-relaxed">
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
          <h2 className="mb-4 text-2xl font-bold text-[#267E1B]">7. Conservación de los datos</h2>
          <ul className="list-inside list-disc space-y-2 text-lg text-gray-600 leading-relaxed">
            <li>Los datos de cuenta y perfil se conservarán mientras mantengas tu usuario activo</li>
            <li>Los datos de navegación y actividad se guardarán, de forma agregada y anónima, hasta 24 meses para fines estadísticos</li>
            <li>Una vez cancelada tu cuenta, tu información personal será bloqueada y eliminada en un plazo máximo de 30 días, salvo obligación legal en contrario.</li>
          </ul>
        </div>

        <div>
          <h2 className="mb-4 text-2xl font-bold text-[#267E1B]">8. Seguridad</h2>
          <p className="text-lg text-gray-600 leading-relaxed">
            Implementamos medidas técnicas y organizativas apropiadas para garantizar la seguridad e
            integridad de tus datos, como cifrado SSL, almacenamiento en servidores seguros y protocolos de control de acceso.
          </p>
        </div>

        <div>
          <h2 className="mb-4 text-2xl font-bold text-[#267E1B]">9. Menores de edad</h2>
          <p className="text-lg text-gray-600 leading-relaxed">
            Nuestro sitio no está dirigido a menores de 16 años. Si eres menor, no
            debes registrarte. Si tenemos conocimiento de que hemos recogido datos de un menor
            sin consentimiento parental, procederemos a su eliminación inmediata
          </p>
        </div>

        <div>
          <h2 className="mb-4 text-2xl font-bold text-[#267E1B]">10. Cookies y tecnologías similares</h2>
          <p className="mb-4 text-lg text-gray-600 leading-relaxed">Utilizamos cookies propias y de terceros para:</p>
          <ul className="list-inside list-disc space-y-2 text-lg text-gray-600 leading-relaxed">
            <li>Mejorar tu experiencia de navegación</li>
            <li>Analizar el uso del sitio.</li>
            <li>
              Mostrarte publicidad relevante (siempre con tu consentimiento).
              Puedes configurar o desactivar las cookies desde tu navegador; sin embargo, algunas funcionalidades podrían verse afectadas.
            </li>
          </ul>
        </div>

        <div>
          <h2 className="mb-4 text-2xl font-bold text-[#267E1B]">11. Modificaciones de la política</h2>
          <p className="text-lg text-gray-600 leading-relaxed">
            Nos reservamos el derecho de actualizar esta Política de Privacidad en cualquier momento.
            Publicaremos la versión vigente con la fecha de la
            última actualización y, si los cambios son sustanciales, te informaremos por correo
          </p>
        </div>

        <div>
          <p className="text-lg text-gray-600 leading-relaxed">
            Si tienes cualquier duda o solicitud relacionada con tus datos personales, no dudes en
            contactarnos en contacto conexion@ecorisaralda.co.
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-[#267E1B] bg-gray-200 px-6 py-12 md:px-12">
        <div className="mb-8 grid grid-cols-1 gap-8 md:grid-cols-4">
          <div>
            <h2 className="mb-1 text-xl font-bold text-slate-900">Conexion</h2>
            <p className="mb-4 text-sm text-gray-700">EcoRisaralda</p>
            <div className="flex gap-4 text-lg text-[#4caf50]">
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
              <li><a href="#" className="hover:underline">Sobre nosotros</a></li>
              <li><a href="#" className="hover:underline">Políticas</a></li>
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

export default PrivacidadPage;
