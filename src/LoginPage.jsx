function LoginPage({ onNavigateHome }) {
  return (
    <div className="min-h-screen bg-white text-slate-900">
      <main className="flex min-h-screen flex-col md:flex-row">
        <div
          className="relative flex h-72 w-full items-center justify-center bg-black md:h-auto md:w-7/12"
          style={{
            backgroundImage:
              "linear-gradient(rgba(0,0,0,0.55), rgba(0,0,0,0.55)), url('/images/inicio_sesion/photo-1532185922611-3410b1898a1c.jpg')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <div className="flex flex-col items-center justify-center text-center text-white">
            <h1 className="text-4xl font-extralight italic leading-[1.05] sm:text-5xl lg:text-6xl">
              Bienvenido de nuevo
            </h1>
            <div className="mt-10 flex flex-col items-center text-left">
              <h2 className="text-3xl font-bold leading-tight">Conexión</h2>
              <p className="text-xl font-light">EcoRisaralda</p>
            </div>
          </div>
        </div>

        <section className="flex w-full flex-col items-center justify-center bg-white px-6 py-10 md:w-5/12 md:px-10">
          <div className="flex w-full max-w-xl flex-col gap-6">
            <h3 className="text-center text-3xl font-bold text-[#267E1B] sm:text-4xl">Iniciar sesión</h3>

            <div className="flex flex-col gap-4">
              <label className="text-sm font-medium text-slate-700" htmlFor="correo">
                Correo electrónico
              </label>
              <input
                id="correo"
                type="email"
                placeholder="Ingrese su correo"
                className="h-11 rounded-lg border border-slate-300 px-3 text-base text-slate-800 outline-none transition focus:border-[#267E1B] focus:ring-2 focus:ring-[#267E1B]/30"
              />
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-slate-700" htmlFor="contrasena">
                  Contraseña
                </label>
                <img
                  src="/images/inicio_sesion/view-svgrepo-com.png"
                  alt="Mostrar contraseña"
                  className="h-5 w-5 cursor-pointer transition hover:scale-105"
                />
              </div>
              <input
                id="contrasena"
                type="password"
                placeholder="Ingrese su contraseña"
                className="h-11 rounded-lg border border-slate-300 px-3 text-base text-slate-800 outline-none transition focus:border-[#267E1B] focus:ring-2 focus:ring-[#267E1B]/30"
              />
              <a href="#" className="text-xs font-semibold text-slate-600 hover:text-slate-800">
                ¿Olvidaste tu contraseña?
              </a>
            </div>

            <div className="flex flex-col gap-3">
              <button
                onClick={onNavigateHome}
                className="flex h-11 items-center justify-center rounded-lg bg-[#267E1B] text-sm font-semibold text-white transition hover:bg-[#1f6517] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#267E1B]"
              >
                Iniciar Sesión
              </button>
              <a href="#" className="text-center text-xs font-semibold text-slate-700 hover:text-slate-900">
                ¿No tienes cuenta?
              </a>
            </div>

            <p className="text-center text-[11px] font-light text-slate-500">
              Al registrarte aceptas nuestros{' '}
              <a href="#" className="font-semibold text-slate-600 hover:text-slate-800">
                términos y condiciones
              </a>{' '}
              y nuestra{' '}
              <a href="#" className="font-semibold text-slate-600 hover:text-slate-800">
                política de privacidad
              </a>
              .
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}

export default LoginPage;
