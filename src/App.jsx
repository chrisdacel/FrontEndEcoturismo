import { AuthProvider } from './context/AuthContext';
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
import OfertaPage from './OfertaPage';
import PrivacidadPage from './PrivacidadPage';
import SobreNosotrosPage from './SobreNosotrosPage';
import PreferencesPage from './PreferencesPage';
import FavoritosPage from './FavoritosPage';
import Header from './components/Header';
import ProtectedRoute from './components/ProtectedRoute';
import SitioPage from './SitioPage';

function AppRoutes() {
  const navigate = useNavigate();
  return (
    <Routes>
      <Route
        path="/"
        element={
          <HomePage
            onNavigateLogin={() => navigate('/login')}
            onNavigateRegister={() => navigate('/register')}
            onNavigateColeccion={() => navigate('/coleccion')}
            onNavigateOferta={() => navigate('/oferta')}
            onNavigatePrivacidad={() => navigate('/privacidad')}
            onNavigateSobreNosotros={() => navigate('/sobre-nosotros')}
          />
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
          <ProtectedRoute>
            <PreferencesPage onNavigateHome={() => navigate('/')} onNavigateLogin={() => navigate('/login')} />
          </ProtectedRoute>
        }
      />
      <Route
        path="/favoritos"
        element={
          <ProtectedRoute>
            <FavoritosPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/coleccion"
        element={
          <ColeccionPage
            onNavigateHome={() => navigate('/')}
            onNavigateLogin={() => navigate('/login')}
            onNavigatePrivacidad={() => navigate('/privacidad')}
            onNavigateSobreNosotros={() => navigate('/sobre-nosotros')}
          />
        }
      />
      <Route
        path="/oferta"
        element={
          <OfertaPage
            onNavigateHome={() => navigate('/')}
            onNavigateLogin={() => navigate('/login')}
            onNavigateRegister={() => navigate('/register')}
            onNavigatePrivacidad={() => navigate('/privacidad')}
            onNavigateSobreNosotros={() => navigate('/sobre-nosotros')}
          />
        }
      />
      <Route
        path="/privacidad"
        element={
          <PrivacidadPage
            onNavigateHome={() => navigate('/')}
            onNavigateLogin={() => navigate('/login')}
            onNavigateRegister={() => navigate('/register')}
          />
        }
      />
      <Route
        path="/sobre-nosotros"
        element={
          <SobreNosotrosPage
            onNavigateHome={() => navigate('/')}
            onNavigateLogin={() => navigate('/login')}
            onNavigateRegister={() => navigate('/register')}
            onNavigatePrivacidad={() => navigate('/privacidad')}
          />
        }
      />
      <Route
        path="/sitio"
        element={
          <SitioPage
            onNavigateHome={() => navigate('/')}
            onNavigateLogin={() => navigate('/login')}
            onNavigateRegister={() => navigate('/register')}
            onNavigateSobreNosotros={() => navigate('/sobre-nosotros')}
            onNavigatePrivacidad={() => navigate('/privacidad')}
          />
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
