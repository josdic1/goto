import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import { Trash2, Edit } from "lucide-react";

export function CheatView() {
  const { user, deleteCheat } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams();
  const [cheat, setCheat] = useState(null);

  useEffect(() => {
    if (id && user?.cheats) {
      const found = user.cheats.find((c) => c.id === parseInt(id));
      if (found) setCheat(found);
    }
  }, [id, user]);

  const handleDelete = async () => {
    if (window.confirm(`Delete "${cheat?.title}"?`)) {
      await deleteCheat(cheat.id);
      navigate("/");
    }
  };

  if (!cheat) return <div className="terminal-card">Loading...</div>;

  return (
    <>
      <button type="button" className="back-btn" onClick={() => navigate(-1)}>
        ⬅ Back to Home
      </button>

      <div className="terminal-card">
        <div className="terminal-header">
          <span className="terminal-id">
            ID: {cheat.id.toString().padStart(4, "0")}
          </span>
          <div className="terminal-badges">
            <span className="badge">{cheat.language_name}</span>
            <span className="badge">::</span>
            <span className="badge">{cheat.category_name}</span>
          </div>
        </div>

        <div className="terminal-body">
          <h3 className="terminal-title">{cheat.title}</h3>
          <p className="terminal-notes">{cheat.notes}</p>
        </div>

        <div className="terminal-screen">
          <pre>
            <code>{cheat.code}</code>
          </pre>
        </div>

        <div className="terminal-controls">
          <button
            onClick={() => navigate(`/cheats/${cheat.id}/edit`)}
            className="control-btn edit"
          >
            <Edit size={14} /> EDIT
          </button>
          <button onClick={handleDelete} className="control-btn delete">
            <Trash2 size={14} /> PURGE
          </button>
        </div>
      </div>
    </>
  );
}
