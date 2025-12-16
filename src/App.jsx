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
import PreferencesPage from './PreferencesPage';
import FavoritosPage from './FavoritosPage';
import AdminDashboardPage from './AdminDashboardPage';
import AdminCreateOperatorPage from './AdminCreateOperatorPage';
import AdminUsersPage from './AdminUsersPage';
import AdminOperatorsPage from './AdminOperatorsPage';
import AdminProfilePage from './AdminProfilePage';
import ProfilePageOperador from './ProfilePageOperador';
import ProfilePageTurista from './ProfilePageTurista';
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
            onNavigatePreferences={() => navigate('/preferencias')}
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
      <Route
        path="/preferencias"
        element={
          user?.role === 'admin' ? (
            <Navigate to="/admin/dashboard" replace />
          ) : (
            <ProtectedRoute>
              <PreferencesPage onNavigateHome={() => navigate('/')} onNavigateLogin={() => navigate('/login')} />
            </ProtectedRoute>
          )
        }
      />
      <Route
        path="/favoritos"
        element={
          user?.role === 'admin' ? (
            <Navigate to="/admin/dashboard" replace />
          ) : (
            <ProtectedRoute>
              <FavoritosPage />
            </ProtectedRoute>
          )
        }
      />
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
          user?.role === 'admin' ? (
            <Navigate to="/admin/coleccion" replace />
          ) : (
            <ColeccionPage
              onNavigateHome={() => navigate('/')}
              onNavigateLogin={() => navigate('/login')}
              onNavigatePrivacidad={() => navigate('/privacidad')}
              onNavigateSobreNosotros={() => navigate('/sobre-nosotros')}
            />
          )
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
