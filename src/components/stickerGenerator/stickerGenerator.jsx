import styles from "./stickerGenerator.module.scss";
import { useRef } from "react";

export default function StickerGenerator({ img, handleGenerateSticker }) {
  const rootRef = useRef(null);
  // const handleOnInteractionStart = (event) => {
  //   // event.stopPropagation();
  //   // setMouseOrigin
  //   const topLeftCoordinates = {
  //     x: rootRef.current.offsetLeft,
  //     y: rootRef.current.offsetTop,
  //   };
  //   generateSticker(img, topLeftCoordinates);
  // };

  return (
    <div
      className={styles.root}
      ref={rootRef}
      onMouseDown={(event) => {
        handleGenerateSticker(event, img, rootRef);
      }}
      onTouchStart={(event) => {
        handleGenerateSticker(event, img, rootRef);
      }}
    >
      <img src={img} draggable={false} alt="" />
    </div>
  );
}
