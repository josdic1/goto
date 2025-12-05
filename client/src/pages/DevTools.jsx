import { useState } from "react";
import { Terminal, Database, Trash2, RefreshCw, FileCode, Play, Download } from "lucide-react";

export function DevTools() {
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const executeCommand = async (command, label) => {
    setLoading(true);
    setError("");
    setOutput(`> Executing: ${label}...\n`);

    try {
      const response = await fetch("/api/dev-tools", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ command }),
      });

      const result = await response.json();

      if (result.success) {
        setOutput(prev => prev + "\n✓ SUCCESS\n" + result.output);
      } else {
        setError(result.error || "Command failed");
        setOutput(prev => prev + "\n✗ FAILED\n" + (result.error || result.output));
      }
    } catch (err) {
      setError(err.message);
      setOutput(prev => prev + "\n✗ ERROR\n" + err.message);
    } finally {
      setLoading(false);
    }
  };

  const commands = [
    {
      id: "check_session",
      label: "Check Session",
      icon: Terminal,
      description: "View current database info and tables",
      color: "#33aa33"
    },
    {
      id: "delete_db",
      label: "Delete Database",
      icon: Trash2,
      description: "Remove instance/app.db",
      color: "#ef4444",
      dangerous: true
    },
    {
      id: "create_db",
      label: "Create Database",
      icon: Database,
      description: "Run db.create_all()",
      color: "#3b82f6"
    },
    {
      id: "upgrade_db",
      label: "Upgrade Database",
      icon: RefreshCw,
      description: "Run flask db upgrade",
      color: "#8b5cf6"
    },
    {
      id: "run_seed",
      label: "Run Seed",
      icon: Play,
      description: "Execute seed.py",
      color: "#f59e0b"
    },
    {
      id: "generate_seed",
      label: "Generate Seed",
      icon: FileCode,
      description: "Create seed file from current DB",
      color: "#10b981"
    }
  ];

  return (
    <div className="dev-tools-page">
      <div className="dev-tools-header">
        <Terminal size={24} />
        <h1>DEV TOOLS</h1>
        <div className="warning-badge">DEVELOPMENT ONLY</div>
      </div>

      <div className="dev-tools-grid">
        {commands.map(cmd => (
          <button
            key={cmd.id}
            onClick={() => executeCommand(cmd.id, cmd.label)}
            disabled={loading}
            className={`dev-tool-btn ${cmd.dangerous ? 'dangerous' : ''}`}
            style={{ '--accent-color': cmd.color }}
          >
            <cmd.icon size={32} />
            <div className="dev-tool-info">
              <div className="dev-tool-label">{cmd.label}</div>
              <div className="dev-tool-desc">{cmd.description}</div>
            </div>
          </button>
        ))}
      </div>

      <div className="terminal-output-container">
        <div className="terminal-output-header">
          <span>OUTPUT</span>
          <button 
            onClick={() => setOutput("")}
            className="clear-output-btn"
          >
            Clear
          </button>
        </div>
        <pre className="terminal-output">
          {loading && <span className="loading-indicator">⣾ Processing...</span>}
          {output || "// No output yet. Execute a command to see results."}
        </pre>
      </div>

      {error && (
        <div className="error-display">
          <strong>ERROR:</strong> {error}
        </div>
      )}
    </div>
  );
}