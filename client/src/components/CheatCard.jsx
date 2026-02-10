import { Trash2, Edit } from "lucide-react";

export function CheatCard({ cheat, onDelete, onEdit }) {
  // These now come directly from the flat object sent by the API
  const langName = cheat.language_name || "SYS";
  const catName = cheat.category_name || "GEN";

  return (
    <div className="terminal-card">
      <div className="terminal-header">
        <span className="terminal-id">
          ID: {cheat.id.toString().padStart(4, "0")}
        </span>
        <div className="terminal-badges">
          <span className="badge">{langName.toUpperCase()}</span>
          <span className="badge">::</span>
          <span className="badge">{catName.toUpperCase()}</span>
        </div>
      </div>

      <div className="terminal-body">
        <h3 className="terminal-title">{cheat.title}</h3>
        {cheat.notes && <p className="terminal-notes">{cheat.notes}</p>}
      </div>

      <div className="terminal-screen">
        <pre>
          <code>{cheat.code}</code>
        </pre>
      </div>

      <div className="terminal-controls">
        <button onClick={() => onEdit(cheat)} className="control-btn edit">
          <Edit size={14} /> EDIT
        </button>
        <button
          onClick={() => onDelete(cheat.id)}
          className="control-btn delete"
        >
          <Trash2 size={14} /> PURGE
        </button>
      </div>
    </div>
  );
}
