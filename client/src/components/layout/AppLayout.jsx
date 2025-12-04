import { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Header } from './Header/Header';
import { Scanline } from './Scanline';
import { AppFooter } from './Footer/AppFooter';
import { NavBar } from '../NavBar';

export function AppLayout() {
  const { loggedIn } = useAuth();
const [theme, setTheme] = useState('boutique');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  if (!loggedIn) return <Outlet />;

  return (
    <div className="app-container">
      <Scanline />
      
      {/* 2. Add it here & pass the theme props */}
      <NavBar currentTheme={theme} setCurrentTheme={setTheme} />
      
      {/* 3. Keep Header (It still holds your ASCII art & Stats) */}
      <Header theme={theme} setTheme={setTheme} />

      <main className="main-content">
        <Outlet />
      </main>
      <AppFooter />
    </div>
  );
}