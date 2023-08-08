import React, { useEffect, useRef, useState } from "react";
import styles from "./gridContainer.module.scss";

const GridContainer = ({ iconImg, headerRef, children }) => {
  const numberOfChildren = React.Children.count(children);
  const gridContainerRef = useRef(null);
  const [gridDisplayed, setGridDisplayed] = useState(false);
  // Find the smallest integer n that satisfies n^2 >= number of children
  const dimension = Math.ceil(Math.sqrt(numberOfChildren));
  // const [display, setDisplay] = useState(false);
  const gridStyle = {
    gridTemplateRows: `repeat(${dimension}, 1fr)`,
    gridTemplateColumns: `repeat(${dimension}, 1fr)`,
    height: gridContainerRef.width + "px",
  };

  useEffect(() => {
    document.addEventListener("touchstart", handleEnd);
    return () => {
      document.removeEventListener("touchstart", handleEnd);
    };
  }, []);

  useEffect(() => {
    gridDisplayed
      ? (headerRef.current.style.zIndex = 2)
      : (headerRef.current.style.zIndex = 1);
  }, [gridDisplayed, headerRef]);

  const handleOnTouchStart = (e) => {
    if (e.defaultPrevented) return;
    e.preventDefault();
    e.stopPropagation();
    setGridDisplayed(true);
    gridContainerRef.current.style.display = "grid";
    // headerRef.current.style.zIndex = 2;

    if (!gridContainerRef.current || !headerRef.current) return;
  };

  const handleOnMouseEnter = (e) => {
    if (e.defaultPrevented) return;
    e.preventDefault();
    setGridDisplayed(true);
    // headerRef.current.style.zIndex = 2;
    gridContainerRef.current.style.display = "grid";
    if (!gridContainerRef.current || !headerRef.current) return;
  };

  const handleEnd = (e) => {
    //create a timer
    if (e.defaultPrevented) return;
    setGridDisplayed(false);
    gridContainerRef.current.style.display = "none";
    // setTimeout(() => {

    //   // headerRef.current.style.zIndex = 0;
    // }, 100);
  };

  return (
    <div
      className={styles.root}
      onMouseEnter={handleOnMouseEnter}
      onTouchStart={handleOnTouchStart}
      onTouchEnd={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}
      onMouseLeave={handleEnd}
    >
      <div className={styles["img-wrapper"]}>
        <img
          src={iconImg}
          alt=""
          draggable={false}
          style={{
            position: "absolute",
            transform: "rotate(7deg)",
            transformOrigin: "left center",
          }}
        />
        <img
          src={iconImg}
          alt=""
          draggable={false}
          style={{
            position: "absolute",
            transform: "rotate(-7deg)",
            transformOrigin: "left center",
          }}
        />
        <img
          src={iconImg}
          alt=""
          draggable={false}
          style={{
            position: "absolute",
            transform: "rotate(-20deg)",
            transformOrigin: "left center",
          }}
        />
      </div>
      <div className={styles["number-of-el"]}>{numberOfChildren}</div>
      <div
        className={styles["grid-container"]}
        style={gridStyle}
        ref={gridContainerRef}
        onMouseDown={handleEnd}
        onTouchStart={(e) => {
          e.preventDefault();
          handleEnd(e);
        }}
      >
        {children}
      </div>
    </div>
  );
};

export default GridContainer;
