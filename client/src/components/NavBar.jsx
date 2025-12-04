import { NavLink } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { LogOut, Monitor } from "lucide-react";

export function NavBar({ currentTheme, setCurrentTheme }) {
  const { userData, logout } = useAuth();

  return (
    <div className="app-navbar">
      {/* LEFT: BRAND & USER */}
      <div className="navbar-left">
        <span className="navbar-brand">CHEATCODE</span>
        <span className="navbar-user">
            {userData?.name ? `(${userData.name})` : '(GUEST)'}
        </span>
      </div>

      {/* CENTER: NAVIGATION LINKS */}
      <div className="navbar-center">
        <NavLink to="/" className="nav-link">Home</NavLink>
        <NavLink to="/cheats" className="nav-link">New</NavLink>
      </div>

      {/* RIGHT: THEME SWITCHER & LOGOUT */}
      <div className="navbar-right">
        
        {/* THEME SWITCHER ITEMS */}
        <button
            onClick={() => setCurrentTheme('wargames')}
            className={`nav-item-button ${currentTheme === 'wargames' ? 'active' : ''}`}
        >
            <Monitor size={16} /> WARGAMES
        </button>

        <button
            onClick={() => setCurrentTheme('boutique')}
            className={`nav-item-button ${currentTheme === 'boutique' ? 'active' : ''}`}
        >
            <Monitor size={16} /> BOUTIQUE
        </button>

        {/* LOGOUT */}
        <button onClick={logout} className="nav-logout">
          <LogOut size={16} /> LOGOUT
        </button>
      </div>
    </div>
  );
}

