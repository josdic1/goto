import { useAuth } from "../hooks/useAuth";
import { MetricsPanel } from "../components/home/MetricsPanel";
import { FilterPanel } from "../components/home/FilterPanel";

export function HomePage() {
  const { languages, categories } = useAuth();

  // Flatten all cheats for metrics
  const allCheats = languages.flatMap(lang => 
    lang.cheats.map(cheat => ({ ...cheat, language: { id: lang.id, name: lang.name } }))
  );

  return (
    <div className="cheat-browser-page">
      <MetricsPanel 
        allCheats={allCheats}
        languages={languages} 
        categories={categories} 
      />

      <FilterPanel
        allCheats={allCheats}
        languages={languages}
        categories={categories}
      />
    </div>
  );
}