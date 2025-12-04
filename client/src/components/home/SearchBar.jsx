import { Search, X } from 'lucide-react';

export function SearchBar({ searchTerm, onSearchChange }) {
  return (
    <div className="search-section">
      <div className="search-wrapper">
        <Search size={18} className="search-icon" />
        <input 
          type="text" 
          placeholder="SEARCH CHEATS..." 
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="search-input"
        />
        {searchTerm && (
          <button 
            onClick={() => onSearchChange('')}
            className="search-clear"
            aria-label="Clear search"
          >
            <X size={16} />
          </button>
        )}
      </div>
    </div>
  );
}