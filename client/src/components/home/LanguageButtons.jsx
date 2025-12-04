import { Code2, Braces, FileJson, Globe, Layers, Database, Terminal } from 'lucide-react';

/* --- CUSTOM ICONS (Moved here because only this file uses them) --- */
const PythonIcon = ({ size = 24, className }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="currentColor" className={className} xmlns="http://www.w3.org/2000/svg">
    <path d="M8 3.5C8 3.77614 7.77614 4 7.5 4C7.22386 4 7 3.77614 7 3.5C7 3.22386 7.22386 3 7.5 3C7.77614 3 8 3.22386 8 3.5Z" />
    <path d="M5.5 1C4.11929 1 3 2.11929 3 3.5C3 4.00954 3.15244 4.48348 3.4142 4.8787L2.29289 6H0.5V7H2V8.5H3V6.70711L4.1213 5.5858C4.51652 5.84756 4.99046 6 5.5 6H7V8H6C4.89543 8 4 8.89543 4 10C2.89543 10 2 10.8954 2 12C2 13.1046 2.89543 14 4 14H13C14.1046 14 15 13.1046 15 12C15 10.8954 14.1046 10 13 10C13 8.89543 12.1046 8 11 8V4.5C11 2.567 9.433 1 7.5 1H5.5Z" />
    <path d="M4 3.5C4 2.67157 4.67157 2 5.5 2H7.5C8.88071 2 10 3.11929 10 4.5V8.5L10.5 9H11C11.5523 9 12 9.44772 12 10V11H13C13.5523 11 14 11.4477 14 12C14 12.5523 13.5523 13 13 13H4C3.44772 13 3 12.5523 3 12C3 11.4477 3.44772 11 4 11H5V10C5 9.44772 5.44772 9 6 9H7.5L8 8.5V5.5L7.5 5H5.5C4.67157 5 4 4.32843 4 3.5Z" />
  </svg>
);

const JavascriptIcon = ({ size = 24, className }) => (
  <svg width={size} height={size} viewBox="0 0 960 960" fill="currentColor" className={className} xmlns="http://www.w3.org/2000/svg">
    <path d="M300 600q-25 0-42.5-17.5T240 540v-40h60v40h60v-180h60v180q0 25-17.5 42.5T360 600H300Zm220 0q-17 0-28.5-11.5T480 560v-40h60v20h80v-40h-100q-17 0-28.5-11.5T480 460v-60q0-17 11.5-28.5T520 360h120q17 0 28.5 11.5T680 400v40h-60v-20h-80v40h100q17 0 28.5 11.5T680 500v60q0 17-11.5 28.5T640 600H520Z"/>
  </svg>
);

const DatabaseIcon = ({ size = 24, className }) => (
  <svg width={size} height={size} viewBox="0 0 960 960" fill="currentColor" className={className} xmlns="http://www.w3.org/2000/svg">
    <path d="M480 840q-151 0-255.5-46.5T120 680V280q0-66 105.5-113T480 120q151 0 255.5 47T840 280v400q0 67-104.5 113.5T480 840Zm0-479q89 0 179-25.5T760 281q-11-29-100.5-55T480 200q-91 0-178.5 25.5T200 281q14 30 101.5 55T480 361Zm0 199q42 0 81-4t74.5-11.5t67-18.5t57.5-25V381q-26 14-57.5 25t-67 18.5t-74.5 11.5t-81 4t-82-4t-75.5-11.5t-56-25v120q25 14 56 25t66.5 18.5t74.5 11.5t82 4Zm0 200q46 0 93.5-7t87.5-18.5t67-26t32-29.5V581q-26 14-57.5 25t-67 18.5t-74.5 11.5t-81 4t-82-4t-75.5-11.5t-56-25v99q5 15 31.5 29t66.5 25.5t88 18.5t94 7Z"/>
  </svg>
);

const RegexIcon = ({ size = 24, className }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} xmlns="http://www.w3.org/2000/svg">
    <path d="M17 3v10M12.67 5.5l8.66 5M12.67 10.5l8.66-5M9 17a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v2a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2z"/>
  </svg>
);

const TerminalIcon = ({ size = 24, className }) => (
  <svg width={size} height={size} viewBox="0 0 960 960" fill="currentColor" className={className} xmlns="http://www.w3.org/2000/svg">
    <path d="M160 800q-33 0-56.5-23.5T80 720v-480q0-33 23.5-56.5T160 160h640q33 0 56.5 23.5T880 240v480q0 33-23.5 56.5T800 800H160Zm0-80h640V320H160v400Zm140-40-56-56 103-104-104-104 57-56 160 160-160 160Zm180 0v-80h240v80H480Z"/>
  </svg>
);

const LANGUAGE_ICONS = {
  'JavaScript': JavascriptIcon,
  'Python': PythonIcon,
  'SQL': DatabaseIcon,
  'Regex': RegexIcon,
  'Terminal': TerminalIcon,
  'React': Braces,
  'JSON': FileJson,
  'CSS': Layers,
  'HTML': Globe,
};

export function LanguageButtons({ languages, selectedLanguage, onSelectLanguage }) {
  return (
    <div className="filter-section">
      <label className="filter-label">LANGUAGES</label>
      <div className="language-icons">
        <button
          onClick={() => onSelectLanguage(null)}
          className={`language-icon-btn ${!selectedLanguage ? 'active' : ''}`}
          title="All Languages"
        >
          <Layers size={24} />
          <span className="icon-label">ALL</span>
        </button>
        {languages.map(lang => {
          const Icon = LANGUAGE_ICONS[lang.name] || Code2;
          return (
            <button
              key={lang.id}
              onClick={() => onSelectLanguage(lang.id)}
              className={`language-icon-btn ${selectedLanguage === lang.id ? 'active' : ''}`}
              title={`${lang.name} (${lang.cheats.length})`}
            >
              <Icon size={24} />
              <span className="icon-label">{lang.name}</span>
              <span className="icon-count">{lang.cheats.length}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}