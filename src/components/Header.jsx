import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';

export default function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [scrollY, setScrollY] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const authPaths = ['/login', '/register', '/forgot-password', '/reset-password', '/confirmar-cuenta', '/email-verified'];
  const isAuthPage = authPaths.includes(location.pathname);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (_) {}
  };

  const goProfile = () => {
    setMenuOpen(false);
    if (user?.role === 'admin') {
      navigate('/admin/profile');
    } else if (user?.role === 'operator') {
      navigate('/operador/profile');
    } else {
      navigate('/turista/profile');
    }
  };

  const goAdminPanel = () => {
    setMenuOpen(false);
    navigate('/admin/dashboard');
  };

  const isScrolled = isAuthPage ? false : scrollY > 20;
  const textColor = isScrolled ? 'text-slate-900' : 'text-white';
  const secondaryTextColor = isScrolled ? 'text-slate-700' : 'text-emerald-100/80';
  const dotColor = isScrolled ? 'bg-emerald-500' : 'bg-emerald-400';

  const baseLink = (isActive) =>
    `px-3 py-2 text-sm font-medium transition ${isActive ? (isScrolled ? 'text-slate-900' : 'text-white') : (isScrolled ? 'text-slate-700 hover:text-slate-900' : 'text-emerald-100/80 hover:text-white')}`;

  return (
    <header
      className={
        isAuthPage
          ? 'absolute top-0 left-0 right-0 z-30 w-full bg-transparent'
          : 'sticky top-0 z-40 w-full transition backdrop-blur supports-[backdrop-filter]:bg-white/5 bg-white/5 ring-1 ring-white/10'
      }
    >
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 md:px-6">
        {/* Logo izquierda */}
        <Link to="/" className="inline-flex items-center gap-2 flex-shrink-0">
          <img src="/images/Pagina_inicio/nature-svgrepo-com.svg" alt="Logo" className="h-6 w-6" />
          <div className="flex flex-col leading-tight">
            <span className={`text-xs font-bold transition ${textColor}`}>Conexion</span>
            <span className={`text-xs font-light transition ${textColor}`}>EcoRisaralda</span>
          </div>
        </Link>

        {/* Nav centro */}
        <nav className="hidden md:flex justify-center gap-6 mx-auto">
          {user?.role === 'admin' ? (
            <>
              <NavLink to="/admin/home" className={({ isActive }) => baseLink(isActive)}>Inicio</NavLink>
              <NavLink to="/admin/coleccion" className={({ isActive }) => baseLink(isActive)}>Colección</NavLink>
              <NavLink to="/admin/que-ofrecemos" className={({ isActive }) => baseLink(isActive)}>Qué ofrecemos</NavLink>
              <NavLink to="/admin/sobre-nosotros" className={({ isActive }) => baseLink(isActive)}>Sobre nosotros</NavLink>
              <NavLink to="/admin/privacidad" className={({ isActive }) => baseLink(isActive)}>Privacidad</NavLink>
            </>
          ) : (
            <>
              <NavLink to="/" className={({ isActive }) => baseLink(isActive)}>Inicio</NavLink>
              <NavLink to="/coleccion" className={({ isActive }) => baseLink(isActive)}>Colección</NavLink>
              {user && user.role !== 'admin' && (
                <NavLink to="/favoritos" className={({ isActive }) => baseLink(isActive)}>Favoritos</NavLink>
              )}
              <NavLink to="/que-ofrecemos" className={({ isActive }) => baseLink(isActive)}>Qué ofrecemos</NavLink>
              <NavLink to="/sobre-nosotros" className={({ isActive }) => baseLink(isActive)}>Sobre nosotros</NavLink>
              <NavLink to="/privacidad" className={({ isActive }) => baseLink(isActive)}>Privacidad</NavLink>
            </>
          )}
        </nav>

        {/* Botones derecha */}
        <div className="flex items-center gap-2 flex-shrink-0">
          {user ? (
            <div className="flex items-center gap-2" ref={menuRef}>
              {/* Dropdown para todos los usuarios */}
              <div className="relative">
                <button
                  onClick={() => setMenuOpen((v) => !v)}
                  className={`hidden md:inline-flex items-center gap-2 rounded-full px-3 py-2 text-sm font-semibold ring-1 transition ${
                    isScrolled
                      ? 'bg-slate-100/50 text-slate-700 ring-slate-200 hover:bg-slate-100'
                      : 'bg-white/10 text-emerald-100 ring-white/10 hover:bg-white/20'
                  }`}
                >
                  <img
                    src={user?.avatar_url || '/images/Pagina_inicio/nature-svgrepo-com.svg'}
                    alt="Avatar"
                    className="h-6 w-6 rounded-full object-cover ring-1 ring-white/20"
                  />
                  <span>{user.name || 'Usuario'}</span>
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {menuOpen && (
                  <div className="absolute right-0 mt-2 w-40 rounded-xl bg-white/90 text-slate-800 shadow-lg ring-1 ring-slate-200/60 backdrop-blur">
                    <button
                      onClick={goProfile}
                      className="w-full px-4 py-2 text-left text-sm hover:bg-slate-100 rounded-t-xl"
                    >
                      Perfil
                    </button>
                    {user.role === 'admin' && (
                      <button
                        onClick={goAdminPanel}
                        className="w-full px-4 py-2 text-left text-sm hover:bg-slate-100"
                      >
                        Panel de Administración
                      </button>
                    )}
                  </div>
                )}
              </div>

              {user.role !== 'admin' && (
                <NavLink
                  to="/preferencias"
                  className={({ isActive }) =>
                    `hidden md:inline-flex items-center rounded-full px-3 py-2 text-sm font-semibold ring-1 transition ${
                      isActive ? 'bg-white/30 text-slate-900 ring-white/40' : 'bg-white/20 text-slate-900 ring-white/30 hover:bg-white/30'
                    }`
                  }
                >
                  Preferencias
                </NavLink>
              )}
              <button
                onClick={handleLogout}
                className="inline-flex items-center rounded-full bg-emerald-500 px-3 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-600"
              >
                Cerrar sesión
              </button>
            </div>
          ) : (
            <>
              <Link
                to="/login"
                className={`hidden md:inline-flex items-center rounded-full px-3 py-2 text-sm font-semibold ring-1 transition ${
                  isScrolled
                    ? 'bg-slate-100/50 text-slate-700 ring-slate-200 hover:bg-slate-100'
                    : 'bg-white/10 text-emerald-100 ring-white/10 hover:bg-white/20'
                }`}
              >
                Iniciar sesión
              </Link>
              <Link
                to="/register"
                className="inline-flex items-center rounded-full bg-emerald-500 px-3 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-600"
              >
                Crear cuenta
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
