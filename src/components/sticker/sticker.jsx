import React, { forwardRef, useEffect, useRef } from "react";
import styles from "./sticker.module.scss";

const Sticker = forwardRef(
  (
    {
      img,
      position,
      scale,
      rotation,
      handleActiveSticker,

      index,
      activeIndex,
      inTrash,
    },
    ref
  ) => {
    const localRef = useRef(null);
    const focusHelperRef = useRef(null);
    useEffect(() => {
      console.log("RENDER STICKER" + index);

      localRef.current.style.left = position.x + "px";
      localRef.current.style.top = position.y + "px";
      localRef.current.style.transform = `scale(${scale}) rotate(${rotation}deg)`;

      focusHelperRef.current.style.opacity =
        index === activeIndex.current ? "1" : "0";

      localRef.current.style.zIndex = index === activeIndex.current ? "1" : "0";

      localRef.current.style.opacity =
        inTrash && activeIndex.current === index ? "0.5" : "1";
    }, [activeIndex, index, position, rotation, scale, ref, inTrash]);

    return (
      <div
        className={styles.root}
        ref={(node) => {
          localRef.current = node;
          ref(node);
        }}
        onMouseDown={handleActiveSticker}
        onTouchStart={handleActiveSticker}
      >
        <div className={styles["focus-helper"]} ref={focusHelperRef} />
        <img src={img} alt="" draggable={false} />
      </div>
    );
  }
);

export default Sticker;
