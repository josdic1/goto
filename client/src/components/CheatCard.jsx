import { Trash2, Edit } from "lucide-react";

export function CheatCard({ cheat, onDelete, onEdit }) {
  // Safe access to nested language/category data
  const langName = cheat.language?.name || "SYS";
  const catName = cheat.category?.name || "GEN";

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
        <button onClick={() => onEdit(cheat)} className="control-btn edit">
            <Edit size={14} /> EDIT
        </button>
        <button onClick={() => onDelete(cheat.id)} className="control-btn delete">
            <Trash2 size={14} /> PURGE
        </button>
      </div>
    </div>
  );
}