// StatsBar.jsx
import { useAuth } from "../../../hooks/useAuth";

export function StatsBar() {
  const { user } = useAuth();

  if (!user) return null;

  const totalCheats = user.languages.reduce((sum, lang) => sum + lang.cheats.length, 0);
  const userName = user.name.toUpperCase();

  return (
    <div className="data-controls">
      {/* 1. Languages */}
      <div className="data-control-item">
        <div className="control-label">LANGUAGES</div>
        <div className="control-count">{user.languages.length.toString().padStart(2, '0')}</div>
        <div className="control-status">{user.languages.length > 0 ? 'LOADED' : 'EMPTY'}</div>
      </div>

      {/* 2. Categories */}
      <div className="data-control-item">
        <div className="control-label">CATEGORIES</div>
        <div className="control-count">{user.categories.length.toString().padStart(2, '0')}</div>
        <div className="control-status">{user.categories.length > 0 ? 'LOADED' : 'EMPTY'}</div>
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