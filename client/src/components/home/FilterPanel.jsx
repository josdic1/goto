import { useState } from "react";
import { CheatList } from "../CheatList";
import { FilterPanelLayout } from "./FilterPanelLayout";
import { FilePlus2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function FilterPanel({ allCheats, languages, categories }) {
  const [selectedLanguage, setSelectedLanguage] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [hasInteracted, setHasInteracted] = useState(false);

  const navigate = useNavigate();

  const handleLanguageSelect = (langId) => {
    setHasInteracted(true);
    setSelectedLanguage(langId);
  };

  const handleCategorySelect = (catId) => {
    setHasInteracted(true);
    setSelectedCategory(catId);
  };

  const handleSearchChange = (term) => {
    if (term) setHasInteracted(true);
    setSearchTerm(term);
  };

  const displayedCheats = allCheats.filter((cheat) => {
    if (selectedLanguage && cheat.language_id !== selectedLanguage)
      return false;
    if (selectedCategory && cheat.category_id !== selectedCategory)
      return false;
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      return (
        cheat.title?.toLowerCase().includes(term) ||
        cheat.code?.toLowerCase().includes(term)
      );
    }
    return true;
  });

  const cheatsToShow = hasInteracted ? displayedCheats : [];

  // Add counts to categories
  const categoriesWithCounts = categories.map(cat => ({
    ...cat,
    cheats: allCheats.filter(cheat => cheat.category_id === cat.id)
  }));

  // Add counts to languages
  const languagesWithCounts = languages.map(lang => ({
    ...lang,
    cheats: allCheats.filter(cheat => cheat.language_id === lang.id)
  }));

  return (
    <div className="filter-panel">
      <FilterPanelLayout
        languages={languagesWithCounts}
        categories={categoriesWithCounts}
        selectedLanguage={selectedLanguage}
        onSelectLanguage={handleLanguageSelect}
        selectedCategory={selectedCategory}
        onSelectCategory={handleCategorySelect}
        searchTerm={searchTerm}
        onSearchChange={handleSearchChange}
      />

      <div className="results-count">
        <span>
          {hasInteracted
            ? `DISPLAYING ${cheatsToShow.length} OF ${allCheats.length} TOTAL CHEATS`
            : "SELECT A FILTER OR SEARCH TO VIEW CHEATS"}
        </span>
        <button
          onClick={() => navigate("/cheats")}
          className="new-cheat-btn"
          title="Create new cheat"
        >
          <FilePlus2 size={14} />
        </button>
      </div>

      <CheatList cheats={cheatsToShow} />
    </div>
  );
}