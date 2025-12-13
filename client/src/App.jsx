import { AuthProvider } from "./providers/AuthProvider";
import { AppLayout } from "./components/layout/AppLayout";
import { PlumbingVisualizer } from "./components/PlumbingVisualizer";

function App() {
  return (
    <>
      <AuthProvider>
        <AppLayout />
        <PlumbingVisualizer />
      </AuthProvider>
    </>
  );
}
export default App;
