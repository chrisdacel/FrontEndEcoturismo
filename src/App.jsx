import { useState } from 'react';
import HomePage from './HomePage';
import LoginPage from './LoginPage';
import RolesPage from './RolesPage';
import RegistroOperador1 from './RegistroOperador1';
import RegistroOperador2 from './RegistroOperador2';
import RegistroTurista1 from './RegistroTurista1';
import RegistroTurista2 from './RegistroTurista2';
import ColeccionPage from './ColeccionPage';
import OfertaPage from './OfertaPage';
import PrivacidadPage from './PrivacidadPage';
import SobreNosotrosPage from './SobreNosotrosPage';

function App() {
  const [currentPage, setCurrentPage] = useState('home');

  return currentPage === 'home' ? (
    <HomePage 
      onNavigateLogin={() => setCurrentPage('login')} 
      onNavigateRegister={() => setCurrentPage('roles')}
      onNavigateColeccion={() => setCurrentPage('coleccion')}
      onNavigateOferta={() => setCurrentPage('oferta')}
      onNavigatePrivacidad={() => setCurrentPage('privacidad')}
      onNavigateSobreNosotros={() => setCurrentPage('sobreNosotros')}
    />
  ) : currentPage === 'login' ? (
    <LoginPage onNavigateHome={() => setCurrentPage('home')} />
  ) : currentPage === 'roles' ? (
    <RolesPage 
      onNavigateHome={() => setCurrentPage('home')} 
      onNavigateLogin={() => setCurrentPage('login')}
      onNavigateRegistroOp={() => setCurrentPage('registroOp1')}
      onNavigateRegistroTur={() => setCurrentPage('registroTur1')}
    />
  ) : currentPage === 'registroOp1' ? (
    <RegistroOperador1 
      onNavigateHome={() => setCurrentPage('home')} 
      onNavigateLogin={() => setCurrentPage('login')}
      onNavigateNext={() => setCurrentPage('registroOp2')}
    />
  ) : currentPage === 'registroOp2' ? (
    <RegistroOperador2 
      onNavigateHome={() => setCurrentPage('home')} 
      onNavigateLogin={() => setCurrentPage('login')}
      onNavigatePreferencias={() => setCurrentPage('home')}
    />
  ) : currentPage === 'registroTur1' ? (
    <RegistroTurista1 
      onNavigateHome={() => setCurrentPage('home')} 
      onNavigateLogin={() => setCurrentPage('login')}
      onNavigateNext={() => setCurrentPage('registroTur2')}
    />
  ) : currentPage === 'registroTur2' ? (
    <RegistroTurista2 
      onNavigateHome={() => setCurrentPage('home')} 
      onNavigateLogin={() => setCurrentPage('login')}
      onNavigatePreferencias={() => setCurrentPage('home')}
    />
  ) : currentPage === 'coleccion' ? (
    <ColeccionPage 
      onNavigateHome={() => setCurrentPage('home')} 
      onNavigateLogin={() => setCurrentPage('login')}
      onNavigatePrivacidad={() => setCurrentPage('privacidad')}
      onNavigateSobreNosotros={() => setCurrentPage('sobreNosotros')}
    />
  ) : currentPage === 'privacidad' ? (
    <PrivacidadPage 
      onNavigateHome={() => setCurrentPage('home')} 
      onNavigateLogin={() => setCurrentPage('login')}
      onNavigateRegister={() => setCurrentPage('roles')}
    />
  ) : currentPage === 'sobreNosotros' ? (
    <SobreNosotrosPage 
      onNavigateHome={() => setCurrentPage('home')} 
      onNavigateLogin={() => setCurrentPage('login')}
      onNavigateRegister={() => setCurrentPage('roles')}
      onNavigatePrivacidad={() => setCurrentPage('privacidad')}
    />
  ) : (
    <OfertaPage 
      onNavigateHome={() => setCurrentPage('home')} 
      onNavigateLogin={() => setCurrentPage('login')}
      onNavigateRegister={() => setCurrentPage('roles')}
      onNavigatePrivacidad={() => setCurrentPage('privacidad')}
      onNavigateSobreNosotros={() => setCurrentPage('sobreNosotros')}
    />
  );
}

export default App;
