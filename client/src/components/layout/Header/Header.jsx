// src/components/layout/Header/Header.jsx
import { useAuth } from "../../../hooks/useAuth";
import { AsciiHeader } from "./AsciiHeader";
// import { ThemeSwitcher } from "./ThemeSwitcher";
import { StatsBar } from "./StatsBar";


export function Header({ theme, setTheme }) {
  const { userData, languages, categories, logout } = useAuth();

  return (
    <header className="control-panel">
      <AsciiHeader userData={userData} />
      {/* <ThemeSwitcher current={theme} onChange={setTheme} /> */}
      <StatsBar
        languages={languages}
        categories={categories}
        onLogout={logout}
      />
    </header>
  );
}
