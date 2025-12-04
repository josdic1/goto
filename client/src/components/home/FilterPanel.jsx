import { useState } from 'react';
import { CheatList } from '../CheatList';
import { FilterPanelLayout } from './FilterPanelLayout';

export function FilterPanel({ allCheats, languages, categories }) {
  const [selectedLanguage, setSelectedLanguage] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // THE SIMPLIFIED LOGIC
  // Just take the master list and run 3 simple checks.
  const displayedCheats = allCheats.filter(cheat => {
    // 1. Language Check
    if (selectedLanguage && cheat.language.id !== selectedLanguage) return false;
    
    // 2. Category Check
    if (selectedCategory && cheat.category.id !== selectedCategory) return false;
    
    // 3. Search Check
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      return (
        cheat.title.toLowerCase().includes(term) || 
        cheat.code.toLowerCase().includes(term)
      );
    }
    
    return true;
  });

  return (
    <div className="filter-panel">
      
      {/* Visual Controls */}
      <FilterPanelLayout 
        languages={languages}
        categories={categories}
        
        selectedLanguage={selectedLanguage}
        onSelectLanguage={setSelectedLanguage}
        
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
      />

      <div className="results-count">
        DISPLAYING {displayedCheats.length} OF {allCheats.length} TOTAL CHEATS
      </div>

      <CheatList cheats={displayedCheats} />
    </div>
  );
}