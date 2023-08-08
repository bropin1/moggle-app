import { useEffect } from "react";
import "./App.css";
import Playground from "./pages/playground";
function App() {
  useEffect(() => {
    const setVhProperty = () => {
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
    <div className="App">
      <Playground />
    </div>
  );
}

export default App;
