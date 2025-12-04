// HomePage.jsx
import { useAuth } from "../hooks/useAuth";
import { MetricsPanel } from "../components/home/MetricsPanel";
import { FilterPanel } from "../components/home/FilterPanel";

export function HomePage() {
  const { user } = useAuth();

  if (!user) return null;

  // Flatten all cheats for metrics
  const allCheats = user.languages.flatMap(lang => 
    lang.cheats.map(cheat => ({ ...cheat, language: { id: lang.id, name: lang.name } }))
  );

  return (
    <div className="cheat-browser-page">
      <MetricsPanel 
        allCheats={allCheats}
        languages={user.languages} 
        categories={user.categories} 
      />

      <FilterPanel
        allCheats={allCheats}
        languages={user.languages}
        categories={user.categories}
      />
    </div>
  );
}