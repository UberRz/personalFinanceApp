import { useState, useEffect } from 'react';
import { Home } from '@/app/pages/Home';
import { ExpensesPage } from '@/app/pages/ExpensesPage';
import { LoginPage } from '@/app/pages/LoginPage';
import { RegisterPage } from '@/app/pages/RegisterPage';
import { isAuthenticated } from '@/app/services/authService';

type PageType = 'login' | 'register' | 'home' | 'expenses';

export default function App() {
  const [currentPage, setCurrentPage] = useState<PageType>('login');
  const [isAuth, setIsAuth] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Verificar autenticación al cargar la app
  useEffect(() => {
    const checkAuth = () => {
      const authenticated = isAuthenticated();
      setIsAuth(authenticated);
      
      if (authenticated) {
        setCurrentPage('home');
      } else {
        setCurrentPage('login');
      }
      
      setIsLoading(false);
    };

    checkAuth();

    // Escuchar cambios en el localStorage (logout desde otra pestaña)
    const handleStorageChange = () => {
      checkAuth();
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const handleNavigate = (page: PageType) => {
    // Verificar autenticación actual
    const currentAuth = isAuthenticated();
    
    // Si intenta ir a una página protegida sin autenticación, redirigir a login
    if (!currentAuth && (page === 'home' || page === 'expenses')) {
      setCurrentPage('login');
      setIsAuth(false);
      return;
    }
    
    // Update auth state
    if (page === 'login' || page === 'register') {
      setIsAuth(false);
    } else {
      setIsAuth(true);
    }
    
    setCurrentPage(page);
  };

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Cargando...</div>;
  }

  return (
    <>
      {currentPage === 'login' && <LoginPage onNavigate={handleNavigate} />}
      {currentPage === 'register' && <RegisterPage onNavigate={handleNavigate} />}
      {currentPage === 'home' && isAuth && <Home onNavigate={handleNavigate} />}
      {currentPage === 'expenses' && isAuth && <ExpensesPage onNavigate={handleNavigate} />}
    </>
  );
}
