
import { useAuth } from "../../../hooks/useAuth";

export function StatsBar({ onLogout }) {
  const { loggedIn, userData, languages, categories } = useAuth();

  const totalCheats = languages.reduce((sum, lang) => sum + lang.cheats.length, 0);

  // Safe name check
  const userName = userData?.name ? userData.name.toUpperCase() : "UNKNOWN";

  return (
    <div className="data-controls">
      {/* 1. Languages */}
      <div className="data-control-item">
        <div className="control-label">LANGUAGES</div>
        <div className="control-count">{languages.length.toString().padStart(2, '0')}</div>
        <div className="control-status">{languages.length > 0 ? 'LOADED' : 'EMPTY'}</div>
      </div>

      {/* 2. Categories */}
      <div className="data-control-item">
        <div className="control-label">CATEGORIES</div>
        <div className="control-count">{categories.length.toString().padStart(2, '0')}</div>
        <div className="control-status">{categories.length > 0 ? 'LOADED' : 'EMPTY'}</div>
      </div>

      {/* 3. Cheats */}
      <div className="data-control-item">
        <div className="control-label">CHEATS</div>
        <div className="control-count">{totalCheats.toString().padStart(2, '0')}</div>
        <div className="control-status">{totalCheats > 0 ? 'LOADED' : 'EMPTY'}</div>
      </div>

 

    </div>
  );
}