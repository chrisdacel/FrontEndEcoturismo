import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebook, faLinkedin, faYoutube, faInstagram } from '@fortawesome/free-brands-svg-icons';

function TerminosCondicionesPage({ onNavigateHome, onNavigateLogin, onNavigateRegister }) {
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
          <h1 className="mb-12 text-3xl font-bold text-[#267E1B] md:text-4xl">Términos y condiciones</h1>
          <p className="text-lg text-gray-500 leading-relaxed">
            Bienvenido a nuestra plataforma de ecoturismo.
            Al acceder y utilizar nuestro sitio web, aceptas cumplir con los siguientes términos y condiciones.
            Si no estás de acuerdo con alguno de estos términos, te pedimos que no utilices nuestros servicios.
          </p>
        </div>

        <div>
          <h2 className="mb-4 text-2xl font-bold text-[#267E1B]">1. Registro y acceso</h2>
          <p className="text-lg text-gray-500 leading-relaxed">
            Para acceder a ciertas funciones del sitio, como recibir beneficios
            exclusivos o registrarte como empleado, es necesario crear una cuenta. Puedes registrarte como Empleado o Turista,
            y proporcionar información precisa durante el proceso de registro.
          </p>
        </div>

        <div>
          <p className="text-lg text-gray-500 leading-relaxed">
            <strong>Turistas:</strong>
            <br />
            Al registrarte como turista, obtendrás acceso a beneficios
            dentro de la página, incluyendo recomendaciones personalizadas, notificaciones sobre
            nuevos eventos y ofertas exclusivas. El acceso a estos beneficios es solo para usuarios
            registrados.
          </p>
        </div>

        <div>
          <p className="text-lg text-gray-500 leading-relaxed">
            <strong>Empleados:</strong>
            <br />
            Los empleados registrados podrán gestionar información relacionada con su empresa, ofrecer productos
            o servicios turísticos y beneficiarse de una visibilidad incrementada dentro de nuestra plataforma.
          </p>
        </div>

        <div>
          <h2 className="mb-4 text-2xl font-bold text-[#267E1B]">2. Privacidad y protección de datos</h2>
          <p className="text-lg text-gray-500 leading-relaxed">
            Tu privacidad es nuestra prioridad. Todos los datos personales proporcionados durante el registro
            serán tratados con la máxima confidencialidad y utilizados exclusivamente para los fines
            relacionados con el servicio de ecoturismo que ofrecemos.
            Para más detalles, consulta nuestra política de privacidad.
          </p>
        </div>

        <div>
          <h2 className="mb-4 text-2xl font-bold text-[#267E1B]">3. Beneficios para turistas</h2>
          <p className="text-lg text-gray-500 leading-relaxed">
            Los turistas registrados en nuestra plataforma pueden disfrutar de una serie de
            beneficios, como acceso a eventos exclusivos, descuentos
            especiales, recomendaciones personalizadas basadas en sus intereses y más.
            Estos beneficios son susceptibles a cambios sin previo aviso, y pueden estar sujetos
            a términos adicionales según el evento o actividad.
          </p>
        </div>

        <div>
          <h2 className="mb-4 text-2xl font-bold text-[#267E1B]">4. Responsabilidad del usuario</h2>
          <p className="text-lg text-gray-500 leading-relaxed">
            Al registrarte en nuestra plataforma, te comprometes a utilizarla de manera responsable y respetuosa.
            No debes utilizar el sitio web para realizar actividades ilegales, fraudulentas o que
            puedan dañar la imagen de nuestra plataforma.
          </p>
        </div>

        <div>
          <h2 className="mb-4 text-2xl font-bold text-[#267E1B]">5. Propiedad intelectual</h2>
          <p className="text-lg text-gray-500 leading-relaxed">
            Todo el contenido de la página web, incluidos textos, imágenes, logotipos, gráficos, etc., es propiedad
            exclusiva de nuestra empresa o de sus licenciantes. Queda prohibido el uso no autorizado de
            cualquier contenido de la plataforma sin el consentimiento expreso de la empresa.
          </p>
        </div>

        <div>
          <h2 className="mb-4 text-2xl font-bold text-[#267E1B]">6. Modificaciones de los términos y condiciones</h2>
          <p className="text-lg text-gray-500 leading-relaxed">
            Nos reservamos el derecho de modificar estos términos y condiciones en cualquier
            momento. Los cambios serán notificados en la página web, y se considerarán aceptados
            por los usuarios al continuar utilizando el sitio tras su publicación
          </p>
        </div>

        <div>
          <h2 className="mb-4 text-2xl font-bold text-[#267E1B]">7. Limitación de responsabilidades</h2>
          <p className="text-lg text-gray-500 leading-relaxed">
            No nos hacemos responsables por cualquier daño directo, indirecto o consecuente
            derivado del uso del sitio web, incluidos los errores en la información o el acceso
            no autorizado a cuentas de usuario.
          </p>
        </div>

        <div>
          <h2 className="mb-4 text-2xl font-bold text-[#267E1B]">8. Ley aplicable</h2>
          <p className="text-lg text-gray-500 leading-relaxed">
            Estos términos y condiciones se rigen por las leyes locales e internacionales aplicables en materia de
            comercio electrónico y servicios de ecoturismo.
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

export default TerminosCondicionesPage;
