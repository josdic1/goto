import { useState } from 'react';
import { CheatList } from '../CheatList';
import { FilterPanelLayout } from './FilterPanelLayout';
import { FilePlus2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function FilterPanel({ allCheats, languages, categories }) {
  const [selectedLanguage, setSelectedLanguage] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const navigate = useNavigate();

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
      <span>DISPLAYING {displayedCheats.length} OF {allCheats.length} TOTAL CHEATS</span>
      <button 
        onClick={() => navigate('/cheats')} 
        className="new-cheat-btn"
        title="Create new cheat"
      >
        <FilePlus2 size={14} />
      </button>
    </div>

    <CheatList cheats={displayedCheats} />
  </div>
  );
}