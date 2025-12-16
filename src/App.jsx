import { AuthProvider, useAuth } from './context/AuthContext';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import HomePage from './HomePage';
import LoginPage from './LoginPage';
import RegisterPage from './RegisterPage';
import ForgotPasswordPage from './ForgotPasswordPage';
import ResetPasswordPage from './ResetPasswordPage';
import ConfirmAccountPage from './ConfirmAccountPage';
import EmailVerifiedPage from './EmailVerifiedPage';
import RolesPage from './RolesPage';
import RegistroOperador1 from './RegistroOperador1';
import RegistroOperador2 from './RegistroOperador2';
import RegistroTurista1 from './RegistroTurista1';
import RegistroTurista2 from './RegistroTurista2';
import ColeccionPage from './ColeccionPage';
import QueOfrecemosPage from './QueOfrecemosPage';
import PrivacidadPage from './PrivacidadPage';
import SobreNosotrosPage from './SobreNosotrosPage';
import AdminDashboardPage from './AdminDashboardPage';
import AdminCreateOperatorPage from './AdminCreateOperatorPage';
import AdminUsersPage from './AdminUsersPage';
import AdminOperatorsPage from './AdminOperatorsPage';
import AdminProfilePage from './AdminProfilePage';
import AdminSitesPage from './AdminSitesPage';
import AdminCommentsPage from './AdminCommentsPage';
import ProfilePageOperador from './ProfilePageOperador';
import ProfilePageTurista from './ProfilePageTurista';
import OperatorSitesPage from './OperatorSitesPage';
import Header from './components/Header';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';
import AdminOperatorRoute from './components/AdminOperatorRoute';
import SitioPage from './SitioPage';
import SitioDetailPage from './SitioDetailPage';
import CreateSitioPage from './CreateSitioPageLeaflet'; // Versión con Leaflet (OpenStreetMap)

function AppRoutes() {
  const { user } = useAuth();
  const navigate = useNavigate();
  return (
    <Routes>
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
          <LoginPage
            onNavigateHome={() => navigate('/')}
            onNavigateRegister={() => navigate('/register')}
            onNavigateForgot={() => navigate('/forgot-password')}
          />
        }
      />
      <Route
        path="/register"
        element={
          <RegisterPage
            onNavigateHome={() => navigate('/')}
            onNavigatePreferences={() => navigate('/preferencias')}
            onNavigateLogin={() => navigate('/login')}
            onNavigateConfirm={() => navigate('/confirmar-cuenta')}
          />
        }
      />
      <Route
        path="/forgot-password"
        element={
          <ForgotPasswordPage
            onNavigateLogin={() => navigate('/login')}
            onNavigateRegister={() => navigate('/register')}
          />
        }
      />
      <Route
        path="/reset-password"
        element={<ResetPasswordPage onNavigateLogin={() => navigate('/login')} />}
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
        path="/admin/create-operator"
        element={
          <AdminRoute>
            <AdminCreateOperatorPage />
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
        path="/operador/sitio/:id/editar"
        element={
          <AdminOperatorRoute>
            <CreateSitioPage />
          </AdminOperatorRoute>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-gradient-to-b from-[#0b2f2a] via-[#0f3f38] to-[#0b2f2a] text-white">
        <Header />
        <AppRoutes />
      </div>
    </AuthProvider>
  );
}

export default App;
