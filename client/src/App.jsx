import { AuthProvider } from "./providers/AuthProvider";
import { AppLayout } from "./components/layout/AppLayout";
import { PlumbingVisualizer } from "./components/PlumbingVisualizer";
import { DataFlowVisualizer } from "./components/DataFlowVisualizer";

function App() {
  return (
    <>
      <AuthProvider>
        <AppLayout />
        <PlumbingVisualizer />
        <DataFlowVisualizer />
      </AuthProvider>
    </>
  );
}
export default App;
