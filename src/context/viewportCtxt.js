import React, { useState, useEffect } from "react";

const ViewportContext = React.createContext();

export const ViewportProvider = ({ children }) => {
  const [viewport, setViewport] = useState(null);

  useEffect(() => {
    const setVhProperty = (e) => {
      document.documentElement.style.setProperty(
        "--vh",
        `${window.innerHeight * 0.01}px`
      );
      setViewport(window.innerHeight);
    };

    setVhProperty(); // Set the initial value
    window.addEventListener("resize", setVhProperty);

    // Clean up the event listener when the component is unmounted
    return () => window.removeEventListener("resize", setVhProperty);
  }, []);

  return (
    <ViewportContext.Provider value={viewport}>
      {children}
    </ViewportContext.Provider>
  );
};

export default ViewportContext;
