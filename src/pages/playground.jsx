import React, { useRef, useState } from "react";
import Canvas from "../components/canvas/canvas";
import useImageUpload from "../hooks/useImageUpload";

import styles from "./playground.module.scss";

export default function Playground() {
  const [saveImage, setSaveImage] = useState(false);
  const imgCanvasRef = useRef(null);

  const { uploadedImage, handleImageUpload } = useImageUpload();

  const handleSaveImage = () => {
    setSaveImage(true);
    console.log("SAVE IMAGE");
  };

  return (
    <div className={styles.root}>
      <header>
        <h1>Let's get $Mogged</h1>
      </header>
      <div className={styles.container}>
        <div className={styles["upload-wrapper"]}>
          <input
            type="file"
            id="imageUpload"
            accept="image/*"
            className={styles["image-upload-input"]}
            onChange={handleImageUpload}
            style={{ display: "none" }}
          />
          <label htmlFor="imageUpload">Upload Image</label>
        </div>
        <button className={styles["save-button"]} onClick={handleSaveImage}>
          Save
        </button>
      </div>
      <Canvas
        uploadedImage={uploadedImage}
        imgCanvasRef={imgCanvasRef}
        saveImage={saveImage}
        setSaveImage={setSaveImage}
      />
    </div>
  );
}
