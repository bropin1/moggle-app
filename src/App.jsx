import { useEffect, createContext } from "react";
import "./App.css";
import Playground from "./pages/playground";
import { ViewportProvider } from "./context/viewportCtxt";

function App() {
  useEffect(() => {
    const setVhProperty = (e) => {
      document.documentElement.style.setProperty(
        "--vh",
        `${window.innerHeight * 0.01}px`
      );
    };

    setVhProperty(); // Set the initial value
    window.addEventListener("resize", setVhProperty);
    // Clean up the event listener when the component is unmounted
    return () => window.removeEventListener("resize", setVhProperty);
  }, []);

  return (
    <ViewportProvider>
      <div className="App">
        <Playground />
      </div>
    </ViewportProvider>
  );
}

export default App;
