import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import { Trash2, Edit } from "lucide-react";

export function CheatView() {
  const { user, deleteCheat } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams();
  const [cheatData, setCheatData] = useState({
    id: "",
    title: "",
    code: "",
    notes: "",
    language_id: "",
    category_id: "",
    user_id: "",
  });

console.log(user.languages)

  useEffect(() => {
    if (id && user?.languages) {
      // Logic to find the specific cheat from the user's data structure
      const allCheats = user.languages.flatMap((lang) => lang.cheats || []);
      const foundCheat = allCheats.find((c) => c.id === parseInt(id));

      if (foundCheat) {
        setCheatData({
          id: id,
          title: foundCheat.title || "",
          code: foundCheat.code || "",
          notes: foundCheat.notes || "",
          language_id: foundCheat.language?.id || "",
          category_id: foundCheat.category?.id || "",
          user_id: user.id,
        });
      }
    }
  }, [id, user]);

  const handleEdit = () => {
    navigate(`/cheats/${cheatData.id}/edit`);
  };

  const handleDelete = async (id) => {
    if (window.confirm(`Delete "${cheatData.title}"?`)) {
      await deleteCheat(id);
      navigate("/");
    }
  };

  return (
    <>
     <button type="button" onClick={() => navigate(-1)}>
          {" "}
          ⬅ Back to Home{" "}
        </button>
    <div className="terminal-card">
      <div className="terminal-header">
        <span className="terminal-id">ID: {cheatData.id}</span>
        <div className="terminal-badges">
          <span className="badge">{cheatData.notes}</span>
        </div>
      </div>

      {/* 2. TITLE DISPLAY */}
      <div className="terminal-body">
        <h3 className="terminal-title">{cheatData.title}</h3>
      </div>

      {/* 3. CODE SCREEN */}
      <div className="terminal-screen">
        <pre>
          <code>{cheatData.code}</code>
        </pre>
      </div>

      {/* 4. CONTROLS */}
      <div className="terminal-controls">
        <button onClick={() => handleEdit(cheatData.id)} className="control-btn edit">
          <Edit size={14} /> EDIT
        </button>
        <button
          onClick={() => handleDelete(cheatData.id)}
          className="control-btn delete"
        >
          <Trash2 size={14} /> PURGE
        </button>
      </div>
    </div>
    </>
  );
}
