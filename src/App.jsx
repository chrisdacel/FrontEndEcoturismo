import { useEffect, Suspense, lazy } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';

import Header from './components/Header';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';
import AdminOperatorRoute from './components/AdminOperatorRoute';
import AccessibilityButton from './components/AccessibilityButton';

// Lazy loaded pages
const PreguntasFrecuentesPage = lazy(() => import('./PreguntasFrecuentesPage'));
const AdminEventsPage = lazy(() => import('./AdminEventsPage'));
const HomePage = lazy(() => import('./HomePage'));
const LoginPage = lazy(() => import('./LoginPage'));
const RegisterPage = lazy(() => import('./RegisterPage'));
const ForgotPasswordPage = lazy(() => import('./ForgotPasswordPage'));
const ResetPasswordPage = lazy(() => import('./ResetPasswordPage'));
const ConfirmAccountPage = lazy(() => import('./ConfirmAccountPage'));
const EmailVerifiedPage = lazy(() => import('./EmailVerifiedPage'));
const RolesPage = lazy(() => import('./RolesPage'));
const RegistroOperador1 = lazy(() => import('./RegistroOperador1'));
const RegistroOperador2 = lazy(() => import('./RegistroOperador2'));
const RegistroTurista1 = lazy(() => import('./RegistroTurista1'));
const RegistroTurista2 = lazy(() => import('./RegistroTurista2'));
const ColeccionPage = lazy(() => import('./ColeccionPage'));
const QueOfrecemosPage = lazy(() => import('./QueOfrecemosPage'));
const PrivacidadPage = lazy(() => import('./PrivacidadPage'));
const SobreNosotrosPage = lazy(() => import('./SobreNosotrosPage'));
const AdminDashboardPage = lazy(() => import('./AdminDashboardPage'));
const AdminUsersPage = lazy(() => import('./AdminUsersPage'));
const AdminOperatorsPage = lazy(() => import('./AdminOperatorsPage'));
const AdminProfilePage = lazy(() => import('./AdminProfilePage'));
const AdminSitesPage = lazy(() => import('./AdminSitesPage'));
const AdminCommentsPage = lazy(() => import('./AdminCommentsPage'));
const AdminLabelsPage = lazy(() => import('./AdminLabelsPage'));
const ProfilePageOperador = lazy(() => import('./ProfilePageOperador'));
const ProfilePageTurista = lazy(() => import('./ProfilePageTurista'));
const FavoritosPage = lazy(() => import('./FavoritosPage'));
const PreferencesPage = lazy(() => import('./PreferencesPage'));
const HistorialPage = lazy(() => import('./HistorialPage'));
const NotificationsPage = lazy(() => import('./NotificationsPage'));
const OperatorSitesPage = lazy(() => import('./OperatorSitesPage'));
const OperatorStatsPage = lazy(() => import('./OperatorStatsPage'));
const OperatorEventsPage = lazy(() => import('./OperatorEventsPage'));
const OperatorCommentsPage = lazy(() => import('./OperatorCommentsPage'));
const EditEventPage = lazy(() => import('./EditEventPage'));
const CreateEventPage = lazy(() => import('./CreateEventPage'));
const EventDetailPage = lazy(() => import('./EventDetailPage'));
const SitioPage = lazy(() => import('./SitioPage'));
const SitioDetailPage = lazy(() => import('./SitioDetailPage'));
const CreateSitioPage = lazy(() => import('./CreateSitioPageLeaflet'));

const GuestRoute = ({ children }) => {
  const { user } = useAuth();
  if (user) {
    if (user.role === 'admin') return <Navigate to="/admin/dashboard" replace />;
    if (user.role === 'operator') return <Navigate to="/operador/home" replace />;
    return <Navigate to="/turista/home" replace />;
  }
  return children;
};

// Loading fallback para suspense
const PageLoader = () => (
  <div className="flex min-h-screen items-center justify-center bg-white">
    <div className="h-10 w-10 animate-spin rounded-full border-4 border-emerald-200 border-t-emerald-600"></div>
  </div>
);

function AppRoutes() {
  const { user } = useAuth();
  const navigate = useNavigate();
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
      <Route
        path="/admin/events"
        element={<AdminEventsPage />}
      />
      <Route
        path="/"
        element={
          user?.role === 'admin' ? (
            <Navigate to="/admin/dashboard" replace />
          ) : user?.role && user?.role !== 'operator' ? (
            <Navigate to="/turista/home" replace />
          ) : (
            <HomePage
              onNavigateLogin={() => navigate('/login')}
              onNavigateRegister={() => navigate('/register')}
              onNavigateColeccion={() => navigate('/coleccion')}
              onNavigateOferta={() => navigate('/que-ofrecemos')}
              onNavigatePrivacidad={() => navigate('/privacidad')}
              onNavigateSobreNosotros={() => navigate('/sobre-nosotros')}
            />
          )
        }
      />
      <Route
        path="/login"
        element={
          <GuestRoute>
            <LoginPage
              onNavigateHome={() => navigate('/')}
              onNavigateRegister={() => navigate('/register')}
              onNavigateForgot={() => navigate('/forgot-password')}
            />
          </GuestRoute>
        }
      />
      <Route
        path="/register"
        element={
          <GuestRoute>
            <RegisterPage
              onNavigateHome={() => navigate('/')}
              onNavigatePreferences={() => navigate('/preferencias')}
              onNavigateLogin={() => navigate('/login')}
              onNavigateConfirm={(email) => navigate('/confirmar-cuenta', { state: { email } })}
            />
          </GuestRoute>
        }
      />
      <Route
        path="/forgot-password"
        element={
          <GuestRoute>
            <ForgotPasswordPage
              onNavigateLogin={() => navigate('/login')}
              onNavigateRegister={() => navigate('/register')}
            />
          </GuestRoute>
        }
      />
      <Route
        path="/reset-password"
        element={
          <GuestRoute>
            <ResetPasswordPage onNavigateLogin={() => navigate('/login')} />
          </GuestRoute>
        }
      />
      <Route
        path="/confirmar-cuenta"
        element={
          <ConfirmAccountPage
            onNavigateHome={() => navigate('/')}
            onNavigateLogin={() => navigate('/login')}
          />
        }
      />
      <Route
        path="/email-verified"
        element={<EmailVerifiedPage onNavigateHome={() => navigate('/')} onNavigateLogin={() => navigate('/login')} />}
      />
      {/** Preferencias feature removed **/}
      {/** Favoritos deshabilitado temporalmente en cliente **/}
      <Route
        path="/admin/dashboard"
        element={
          <AdminRoute>
            <AdminDashboardPage />
          </AdminRoute>
        }
      />
      <Route
        path="/admin/users"
        element={
          <AdminRoute>
            <AdminUsersPage />
          </AdminRoute>
        }
      />
      <Route
        path="/admin/operators"
        element={
          <AdminRoute>
            <AdminOperatorsPage />
          </AdminRoute>
        }
      />
      <Route
        path="/admin/sites"
        element={
          <AdminRoute>
            <AdminSitesPage />
          </AdminRoute>
        }
      />
      <Route
        path="/admin/comentarios"
        element={
          <AdminRoute>
            <AdminCommentsPage />
          </AdminRoute>
        }
      />
      <Route
        path="/admin/etiquetas"
        element={
          <AdminRoute>
            <AdminLabelsPage />
          </AdminRoute>
        }
      />
      <Route
        path="/crear-sitio"
        element={
          <AdminOperatorRoute>
            <CreateSitioPage />
          </AdminOperatorRoute>
        }
      />
      <Route
        path="/admin/profile"
        element={
          <AdminRoute>
            <AdminProfilePage />
          </AdminRoute>
        }
      />
      <Route
        path="/operador/profile"
        element={
          <ProtectedRoute>
            <ProfilePageOperador />
          </ProtectedRoute>
        }
      />
      <Route
        path="/turista/profile"
        element={
          <ProtectedRoute>
            <ProfilePageTurista />
          </ProtectedRoute>
        }
      />
      <Route
        path="/turista/favoritos"
        element={
          <ProtectedRoute>
            <FavoritosPage
              onNavigateSobreNosotros={() => navigate('/turista/sobre-nosotros')}
              onNavigatePrivacidad={() => navigate('/turista/privacidad')}
            />
          </ProtectedRoute>
        }
      />
      <Route
        path="/turista/preferencias"
        element={
          <ProtectedRoute>
            <PreferencesPage
              onNavigateHome={() => navigate('/turista/home')}
              onNavigateLogin={() => navigate('/login')}
            />
          </ProtectedRoute>
        }
      />
      <Route
        path="/turista/historial"
        element={
          <ProtectedRoute>
            <HistorialPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/turista/notificaciones"
        element={
          <ProtectedRoute>
            <NotificationsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/preferencias"
        element={
          <ProtectedRoute>
            <PreferencesPage
              onNavigateHome={() => navigate(user?.role === 'admin' ? '/admin/home' : user?.role === 'operator' ? '/operador/home' : '/turista/home')}
              onNavigateLogin={() => navigate('/login')}
            />
          </ProtectedRoute>
        }
      />
      <Route
        path="/coleccion"
        element={
          <ColeccionPage
            onNavigateHome={() => navigate(user?.role === 'admin' ? '/admin/home' : '/')}
            onNavigateLogin={() => navigate('/login')}
            onNavigatePrivacidad={() => navigate(user?.role === 'admin' ? '/admin/privacidad' : '/privacidad')}
            onNavigateSobreNosotros={() => navigate(user?.role === 'admin' ? '/admin/sobre-nosotros' : '/sobre-nosotros')}
          />
        }
      />
      <Route
        path="/que-ofrecemos"
        element={
          user?.role === 'admin' ? (
            <Navigate to="/admin/que-ofrecemos" replace />
          ) : (
            <QueOfrecemosPage
              onNavigateRegister={() => navigate('/register')}
            />
          )
        }
      />
      <Route
        path="/privacidad"
        element={
          user?.role === 'admin' ? (
            <Navigate to="/admin/privacidad" replace />
          ) : (
            <PrivacidadPage
              onNavigateHome={() => navigate('/')}
              onNavigateLogin={() => navigate('/login')}
              onNavigateRegister={() => navigate('/register')}
            />
          )
        }
      />
      <Route
        path="/sobre-nosotros"
        element={
          user?.role === 'admin' ? (
            <Navigate to="/admin/sobre-nosotros" replace />
          ) : (
            <SobreNosotrosPage
              onNavigateHome={() => navigate('/')}
              onNavigateLogin={() => navigate('/login')}
              onNavigateRegister={() => navigate('/register')}
              onNavigatePrivacidad={() => navigate('/privacidad')}
            />
          )
        }
      />
      <Route
        path="/sitio/:id"
        element={
          user?.role === 'admin' ? (
            <Navigate to={`/admin/sitio/${window.location.pathname.split('/').pop()}`} replace />
          ) : (
            <SitioDetailPage
              onNavigateHome={() => navigate('/')}
              onNavigateLogin={() => navigate('/login')}
              onNavigateRegister={() => navigate('/register')}
              onNavigateSobreNosotros={() => navigate('/sobre-nosotros')}
              onNavigatePrivacidad={() => navigate('/privacidad')}
            />
          )
        }
      />

      {/* Rutas turista (usuarios logueados no admin ni operator) */}
      <Route
        path="/turista/home"
        element={
          <HomePage
            onNavigateLogin={() => navigate('/login')}
            onNavigateRegister={() => navigate('/register')}
            onNavigateColeccion={() => navigate('/turista/coleccion')}
            onNavigateOferta={() => navigate('/turista/que-ofrecemos')}
            onNavigatePrivacidad={() => navigate('/turista/privacidad')}
            onNavigateSobreNosotros={() => navigate('/turista/sobre-nosotros')}
          />
        }
      />
      <Route
        path="/turista/coleccion"
        element={
          <ColeccionPage
            onNavigateHome={() => navigate('/turista/home')}
            onNavigateLogin={() => navigate('/login')}
            onNavigatePrivacidad={() => navigate('/turista/privacidad')}
            onNavigateSobreNosotros={() => navigate('/turista/sobre-nosotros')}
          />
        }
      />
      <Route
        path="/turista/que-ofrecemos"
        element={
          <QueOfrecemosPage
            onNavigateRegister={() => navigate('/register')}
          />
        }
      />
      <Route
        path="/turista/privacidad"
        element={
          <PrivacidadPage
            onNavigateHome={() => navigate('/turista/home')}
            onNavigateLogin={() => navigate('/login')}
            onNavigateRegister={() => navigate('/register')}
          />
        }
      />
      <Route
        path="/turista/sobre-nosotros"
        element={
          <SobreNosotrosPage
            onNavigateHome={() => navigate('/turista/home')}
            onNavigateLogin={() => navigate('/login')}
            onNavigateRegister={() => navigate('/register')}
            onNavigatePrivacidad={() => navigate('/turista/privacidad')}
          />
        }
      />
      <Route
        path="/turista/sitio/:id"
        element={
          <SitioDetailPage
            onNavigateHome={() => navigate('/turista/home')}
            onNavigateLogin={() => navigate('/login')}
            onNavigateRegister={() => navigate('/register')}
            onNavigateSobreNosotros={() => navigate('/turista/sobre-nosotros')}
            onNavigatePrivacidad={() => navigate('/turista/privacidad')}
          />
        }
      />
      <Route
        path="/turista/evento/:id"
        element={
          <ProtectedRoute>
            <EventDetailPage />
          </ProtectedRoute>
        }
      />

      {/* Rutas admin para ver las vistas públicas con prefijo admin */}
      <Route
        path="/admin/home"
        element={
          <AdminRoute>
            <HomePage
              onNavigateLogin={() => navigate('/login')}
              onNavigateRegister={() => navigate('/register')}
              onNavigateColeccion={() => navigate('/admin/coleccion')}
              onNavigateOferta={() => navigate('/admin/que-ofrecemos')}
              onNavigatePrivacidad={() => navigate('/admin/privacidad')}
              onNavigateSobreNosotros={() => navigate('/admin/sobre-nosotros')}
            />
          </AdminRoute>
        }
      />
      <Route
        path="/admin/coleccion"
        element={
          <AdminRoute>
            <ColeccionPage
              onNavigateHome={() => navigate('/admin/home')}
              onNavigateLogin={() => navigate('/login')}
              onNavigatePrivacidad={() => navigate('/admin/privacidad')}
              onNavigateSobreNosotros={() => navigate('/admin/sobre-nosotros')}
            />
          </AdminRoute>
        }
      />
      <Route
        path="/admin/que-ofrecemos"
        element={
          <AdminRoute>
            <QueOfrecemosPage
              onNavigateRegister={() => navigate('/register')}
            />
          </AdminRoute>
        }
      />
      <Route
        path="/admin/privacidad"
        element={
          <AdminRoute>
            <PrivacidadPage
              onNavigateHome={() => navigate('/admin/home')}
              onNavigateLogin={() => navigate('/login')}
              onNavigateRegister={() => navigate('/register')}
            />
          </AdminRoute>
        }
      />
      <Route
        path="/admin/sobre-nosotros"
        element={
          <AdminRoute>
            <SobreNosotrosPage
              onNavigateHome={() => navigate('/admin/home')}
              onNavigateLogin={() => navigate('/login')}
              onNavigateRegister={() => navigate('/register')}
              onNavigatePrivacidad={() => navigate('/admin/privacidad')}
            />
          </AdminRoute>
        }
      />
      <Route
        path="/admin/sitio/preview"
        element={
          <AdminRoute>
            <SitioPage
              onNavigateHome={() => navigate('/admin/home')}
              onNavigateLogin={() => navigate('/login')}
              onNavigateRegister={() => navigate('/register')}
              onNavigateSobreNosotros={() => navigate('/admin/sobre-nosotros')}
              onNavigatePrivacidad={() => navigate('/admin/privacidad')}
            />
          </AdminRoute>
        }
      />
      <Route
        path="/admin/sitio/:id"
        element={
          <AdminRoute>
            <SitioDetailPage
              onNavigateHome={() => navigate('/admin/home')}
              onNavigateLogin={() => navigate('/login')}
              onNavigateRegister={() => navigate('/register')}
              onNavigateSobreNosotros={() => navigate('/admin/sobre-nosotros')}
              onNavigatePrivacidad={() => navigate('/admin/privacidad')}
            />
          </AdminRoute>
        }
      />
      <Route
        path="/admin/sitio/:id/editar"
        element={
          <AdminRoute>
            <CreateSitioPage />
          </AdminRoute>
        }
      />
      <Route
        path="/admin/evento/:id/editar"
        element={
          <AdminRoute>
            <EditEventPage />
          </AdminRoute>
        }
      />
      <Route
        path="/admin/sitio/:id/evento/crear"
        element={
          <AdminRoute>
            <CreateEventPage />
          </AdminRoute>
        }
      />

      {/* Rutas operador (usuarios con rol operator) */}
      <Route
        path="/operador/home"
        element={
          <AdminOperatorRoute>
            <HomePage
              onNavigateLogin={() => navigate('/login')}
              onNavigateRegister={() => navigate('/register')}
              onNavigateColeccion={() => navigate('/operador/coleccion')}
              onNavigateOferta={() => navigate('/operador/que-ofrecemos')}
              onNavigatePrivacidad={() => navigate('/operador/privacidad')}
              onNavigateSobreNosotros={() => navigate('/operador/sobre-nosotros')}
            />
          </AdminOperatorRoute>
        }
      />
      <Route
        path="/operador/coleccion"
        element={
          <AdminOperatorRoute>
            <ColeccionPage
              onNavigateHome={() => navigate('/operador/home')}
              onNavigateLogin={() => navigate('/login')}
              onNavigatePrivacidad={() => navigate('/operador/privacidad')}
              onNavigateSobreNosotros={() => navigate('/operador/sobre-nosotros')}
            />
          </AdminOperatorRoute>
        }
      />
      <Route
        path="/operador/que-ofrecemos"
        element={
          <AdminOperatorRoute>
            <QueOfrecemosPage
              onNavigateRegister={() => navigate('/register')}
            />
          </AdminOperatorRoute>
        }
      />
      <Route
        path="/operador/privacidad"
        element={
          <AdminOperatorRoute>
            <PrivacidadPage
              onNavigateHome={() => navigate('/operador/home')}
              onNavigateLogin={() => navigate('/login')}
              onNavigateRegister={() => navigate('/register')}
            />
          </AdminOperatorRoute>
        }
      />
      <Route
        path="/operador/sobre-nosotros"
        element={
          <AdminOperatorRoute>
            <SobreNosotrosPage
              onNavigateHome={() => navigate('/operador/home')}
              onNavigateLogin={() => navigate('/login')}
              onNavigateRegister={() => navigate('/register')}
              onNavigatePrivacidad={() => navigate('/operador/privacidad')}
            />
          </AdminOperatorRoute>
        }
      />
      <Route
        path="/operador/sitio/:id"
        element={
          <AdminOperatorRoute>
            <SitioDetailPage
              onNavigateHome={() => navigate('/operador/home')}
              onNavigateLogin={() => navigate('/login')}
              onNavigateRegister={() => navigate('/register')}
              onNavigateSobreNosotros={() => navigate('/operador/sobre-nosotros')}
              onNavigatePrivacidad={() => navigate('/operador/privacidad')}
            />
          </AdminOperatorRoute>
        }
      />
      <Route
        path="/operador/mis-sitios"
        element={
          <AdminOperatorRoute>
            <OperatorSitesPage />
          </AdminOperatorRoute>
        }
      />
      <Route
        path="/operador/comentarios"
        element={
          <AdminOperatorRoute>
            <OperatorCommentsPage />
          </AdminOperatorRoute>
        }
      />
      <Route
        path="/operador/mis-eventos"
        element={
          <AdminOperatorRoute>
            <OperatorEventsPage />
          </AdminOperatorRoute>
        }
      />
      <Route
        path="/operador/estadisticas"
        element={
          <AdminOperatorRoute>
            <OperatorStatsPage />
          </AdminOperatorRoute>
        }
      />
      <Route
        path="/operador/sitio/:id/editar"
        element={
          <AdminOperatorRoute>
            <CreateSitioPage />
          </AdminOperatorRoute>
        }
      />
      <Route
        path="/operador/evento/:id/editar"
        element={
          <AdminOperatorRoute>
            <EditEventPage />
          </AdminOperatorRoute>
        }
      />
      <Route
        path="/operador/sitio/:id/evento/crear"
        element={
          <AdminOperatorRoute>
            <CreateEventPage />
          </AdminOperatorRoute>
        }
      />
      <Route path="/preguntas-frecuentes" element={<PreguntasFrecuentesPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
    </Suspense>
  );
}

function ScrollToTop() {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, [location.pathname]);

  return null;
}

function PageTransition({ children }) {
  const location = useLocation();

  return (
    <div key={location.pathname} className="page-enter">
      {children}
    </div>
  );
}

function ScrollReveal() {
  const location = useLocation();

  useEffect(() => {
    const targets = Array.from(document.querySelectorAll('main section, main article'));
    if (targets.length === 0) return undefined;

    targets.forEach((el) => {
      if (!el.classList.contains('scroll-reveal')) {
        el.classList.add('scroll-reveal');
      }
    });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -10% 0px' }
    );

    targets.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, [location.pathname]);

  return null;
}

function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-gradient-to-b from-[#0b2f2a] via-[#0f3f38] to-[#0b2f2a] text-white">
        <ScrollToTop />
        <ScrollReveal />
        <Header />
        <PageTransition>
          <AppRoutes />
        </PageTransition>
        <AccessibilityButton />
      </div>
    </AuthProvider>
  );
}

export default App;
