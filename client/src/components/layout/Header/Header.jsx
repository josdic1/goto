import { useAuth } from "../../../hooks/useAuth";
import { AsciiHeader } from "./AsciiHeader";
import { StatsBar } from "./StatsBar";

export function Header({ theme, setTheme }) {
  const { user, logout } = useAuth(); 

  return (
    <header className="control-panel">
      <AsciiHeader user={user} />
      <StatsBar onLogout={logout} />
    </header>
  );
}