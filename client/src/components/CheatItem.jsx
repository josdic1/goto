import { Edit, Trash2, Check } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useState } from "react";

export function CheatItem({ cheat, language, category }) {
  const navigate = useNavigate();
  const { deleteCheat } = useAuth();
  const [copied, setCopied] = useState(false);

  const handleEdit = () => {
    navigate(`/cheats/${cheat.id}/edit`);
  };

  const handleDelete = async () => {
    if (window.confirm(`Delete "${cheat.title}"?`)) {  
      await deleteCheat(cheat.id);
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(cheat.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div className="terminal-card">
      {/* 1. STATUS STRIP */}
      <div className="terminal-header">
        <span className="terminal-id">CHEAT#{cheat.id.toString().padStart(4, '0')}</span>
        <div className="terminal-badges">
          <span>{language?.name || 'UNKNOWN'}</span>
          <span>|</span>
          <span>{category?.name || 'UNKNOWN'}</span>
        </div>
      </div>

      {/* 2. TITLE */}
      <div className="terminal-body">
        <h3 className="terminal-title">{cheat.title}</h3>
        
        {/* Notes Section - Only show if notes exist */}
        {cheat.notes && (
          <div className="terminal-notes">
            <div className="notes-text">{cheat.notes}</div>
          </div>
        )}
      </div>

      {/* 3. CODE SCREEN */}
      <div className="terminal-screen" onClick={handleCopy}>
        <div className="source-view-label">
          {copied ? (
            <>
              <Check size={10} />
              COPIED
            </>
          ) : (
            'SOURCE_VIEW'
          )}
        </div>
        <pre><code>{cheat.code}</code></pre>
      </div>

      {/* 4. CONTROL BUTTONS */}
      <div className="terminal-controls">
        <button onClick={handleEdit} className="control-btn">
          <Edit size={14} />
          EDIT
        </button>
        <button onClick={handleDelete} className="control-btn delete">
          <Trash2 size={14} />
          DELETE
        </button>
      </div>
    </div>
  );
}