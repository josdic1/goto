import { AuthProvider } from "./providers/AuthProvider";
import { AppLayout } from "./components/layout/AppLayout";

function App() {
  return (
    <>
      <AuthProvider>
        <AppLayout />
      </AuthProvider>
    </>
  );
}
export default App;
