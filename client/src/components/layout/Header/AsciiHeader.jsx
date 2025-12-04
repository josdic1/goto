export function AsciiHeader({ userData }) {
  return (
    <pre className="ascii-header">
{`╔═══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════╗
║ CHEATCODE v1.0 - CODE REFERENCE SYSTEM                                                    [SYS/86]    ${new Date().toLocaleTimeString('en-US', { hour12: false })}  EST                              ║
╠═══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════╣
║ USER: ${userData.name.toUpperCase().padEnd(20)} │ EMAIL: ${userData.email.padEnd(30)} │ STATUS: `}<span className="pulse">OPERATIONAL</span>{`                                              ║
╚═══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════╝`}
    </pre>
  );
}