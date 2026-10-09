import Shuttapy from "./Components/Shuttapy";
import useGpuSimulation from "./Hooks/useGpuSimulation";

function App() {
useGpuSimulation();
  return (
    <>
      <Shuttapy />
    </>
  );
}

export default App;
