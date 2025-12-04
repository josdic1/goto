export function AppFooter() {
  return (
    <pre className="app-footer">
{`[F1]HELP [F2]SETUP [F3]EXIT                               SYS:READY [${new Date().toISOString().split('T')[0]}]`}
    </pre>
  );
}