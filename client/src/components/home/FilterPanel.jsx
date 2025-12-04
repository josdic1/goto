import { useState } from 'react';
import { 
  
  Code2, 
  Braces, 
  FileJson, 
  Database, 
  Terminal,
  Globe,
  Layers
} from 'lucide-react';
import { CheatList } from '../CheatList';

// Map language names to icons
const LANGUAGE_ICONS = {
  'JavaScript': Code2,
  'Python': Terminal,
  'React': Braces,
  'SQL': Database,
  'JSON': FileJson,
  'CSS': Layers,
  'HTML': Globe,
};

export function FilterPanel({ allCheats, languages, categories }) {
  const [selectedLanguage, setSelectedLanguage] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const getDisplayedCheats = () => {
    let filtered = allCheats;

    if (selectedLanguage) {
      const lang = languages.find(l => l.id === selectedLanguage);
      filtered = lang ? lang.cheats.map(c => ({ 
        ...c, 
        language: { id: lang.id, name: lang.name } 
      })) : [];
    }

    if (selectedCategory) {
      filtered = filtered.filter(cheat => cheat.category?.id === selectedCategory);
    }

    return filtered;
  };

  const displayedCheats = getDisplayedCheats();

  return (
    <div className="filter-panel">
      <div className="filter-title">FILTER CONTROLS</div>

      <div className="filter-sections">
        {/* Language Icon Buttons */}
        <div className="filter-section">
          <label className="filter-label">LANGUAGES</label>
          <div className="language-icons">
            <button
              onClick={() => setSelectedLanguage(null)}
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
                  onClick={() => setSelectedLanguage(lang.id)}
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

        {/* Category Buttons */}
        <div className="filter-section">
          <label className="filter-label">CATEGORIES</label>
          <div className="category-buttons">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`category-btn ${!selectedCategory ? 'active' : ''}`}
            >
              ALL CATEGORIES
            </button>
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`category-btn ${selectedCategory === cat.id ? 'active' : ''}`}
              >
                {cat.name}
                <span className="category-count">{cat.cheats.length}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="results-count">
        DISPLAYING {displayedCheats.length} OF {allCheats.length} TOTAL CHEATS
      </div>

      <CheatList cheats={displayedCheats} />
    </div>
  );
}