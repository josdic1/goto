import { Trash2, Edit } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export function CheatItem({ cheat }) {
  const { deleteCheat } = useAuth();
  const langName = cheat.language?.name || "SYS";
  const catName = cheat.category?.name || "GEN";

  const navigate = useNavigate();

  const handleClick = (e) => {
    const { name } = e.target;
    if (name === "edit") {
      navigate(`/cheats/${cheat.id}/edit`);
    } else if (name === "delete") {
      deleteCheat(cheat.id);
      navigate('/')
    }
  }

  return (
    <div className="terminal-card">
      {/* 1. STATUS STRIP */}
      <div className="terminal-header">
        <span className="terminal-id">ID: {cheat.id.toString().padStart(4, '0')}</span>
        <div className="terminal-badges">
          <span className="badge">{langName.toUpperCase()}</span>
          <span className="badge">::</span>
          <span className="badge">{catName.toUpperCase()}</span>
        </div>
      </div>

      {/* 2. TITLE DISPLAY */}
      <div className="terminal-body">
        <h3 className="terminal-title">{cheat.title}</h3>
      </div>

      {/* 3. CODE SCREEN */}
      <div className="terminal-screen">
        <pre>
          <code>{cheat.code}</code>
        </pre>
      </div>

      {/* 4. CONTROLS */}
      <div className="terminal-controls">
        <button name="edit" onClick={handleClick} className="control-btn edit">
            <Edit size={14} /> EDIT
        </button>
        <button name="delete" onClick={handleClick} className="control-btn delete">
            <Trash2 size={14} /> PURGE
        </button>
      </div>
    </div>
  );
}