import React, { useRef, useState } from "react";
import Canvas from "../components/canvas/canvas";
import useImageUpload from "../hooks/useImageUpload";
import arrowUp from "../ressources/images/up-arrow.png";

import styles from "./playground.module.scss";

export default function Playground() {
  const [saveImage, setSaveImage] = useState(false);
  const imgCanvasRef = useRef(null);

  const { image, handleImageUpload } = useImageUpload();

  const handleSaveImage = () => {
    setSaveImage(true);
    console.log("SAVE IMAGE");
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = { target: e.dataTransfer };
      handleImageUpload(file);
    }
  };

  return (
    <div className={styles.root}>
      <header>
        <h1>LET&#39;S GET $MOGGED!</h1>
        <span className={styles.instruction}>
          Hold CTRL or CMD on a sticker and drag to
          <span> scale &#8592; &#8594; or rotate &#8593; &#8595;</span>
        </span>
      </header>
      <div
        className={styles.container}
        style={{ border: image ? "0" : " 2px dashed #aeaeae" }}
      >
        <div
          className={styles["drag-drop"]}
          style={{ display: image ? "none" : "flex" }}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          <input
            type="file"
            id="imageUpload"
            accept="image/*"
            className={styles["image-upload-input"]}
            onChange={handleImageUpload}
            style={{ display: "none" }}
          />
          <label htmlFor="imageUpload">Drop your image here</label>
        </div>

        <div
          className={styles["canvas-wrapper"]}
          style={{ display: image ? "block" : "none" }}
        >
          <Canvas
            uploadedImage={image}
            imgCanvasRef={imgCanvasRef}
            saveImage={saveImage}
            setSaveImage={setSaveImage}
          />
        </div>
        <div
          className={styles.buttons}
          style={{ display: image ? "flex" : "none" }}
        >
          <div className={styles["upload-button"]}>
            <input
              type="file"
              id="imageUpload"
              accept="image/*"
              className={styles["image-upload-input"]}
              onChange={handleImageUpload}
              style={{ display: "none" }}
            />
            <label htmlFor="imageUpload" className={styles.label}>
              <img src={arrowUp} alt="" draggable={false} />
            </label>
          </div>
          <button className={styles["save-button"]} onClick={handleSaveImage}>
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
