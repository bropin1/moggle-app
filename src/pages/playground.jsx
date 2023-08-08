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
      <div className="Upload">
        <div className="button">
          <input
            type="file"
            id="imageUpload"
            accept="image/*"
            onChange={handleImageUpload}
            style={{ display: "none" }}
          />
          <label htmlFor="imageUpload">Upload Image</label>
        </div>
      </div>
      <button onClick={handleSaveImage}>Save</button>
      <Canvas
        uploadedImage={uploadedImage}
        imgCanvasRef={imgCanvasRef}
        saveImage={saveImage}
        setSaveImage={setSaveImage}
      />
    </div>
  );
}
