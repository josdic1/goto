export function ThemeSwitcher({ current, onChange }) {
  return (
    <div className="theme-switcher">
      <button
        onClick={() => onChange('wargames')}
        className={`theme-button ${current === 'wargames' ? 'active' : ''}`}
      >
        WARGAMES
      </button>
      <button
        onClick={() => onChange('boutique')}
        className={`theme-button ${current === 'boutique' ? 'active' : ''}`}
      >
        BOUTIQUE
      </button>
    </div>
  );
}