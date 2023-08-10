import React, { useRef, useEffect, forwardRef } from "react";
import globalStyles from "../../styles/globalStyles.module.scss";
import styles from "./canvas.module.scss";
import mgl1 from "../../ressources/images/mgl1.png";
import mgl2 from "../../ressources/images/mgl2.png";
import mgl3 from "../../ressources/images/mgl3.png";
import mgl4 from "../../ressources/images/mgl4.png";
import mgl5 from "../../ressources/images/mgl5.png";
import mgl6 from "../../ressources/images/mgl6.png";
import mgl7 from "../../ressources/images/mgl7.png";
import mgl8 from "../../ressources/images/mgl8.png";
import mgl9 from "../../ressources/images/mgl9.png";
import mgl10 from "../../ressources/images/mgl10.png";
import mgl11 from "../../ressources/images/mgl11.png";
import mgl12 from "../../ressources/images/mgl12.png";
import mglg1 from "../../ressources/images/mglg1.png";
import mglg2 from "../../ressources/images/mglg2.png";
import pipe1 from "../../ressources/images/pipe1.png";
import resetSvg from "../../ressources/images/reset.svg";
import { ReactComponent as ResetSvg } from "../../ressources/images/reset.svg";
import GridContainer from "../wrapper/gridContainer";
import Sticker from "../sticker/sticker";
import StickerGenerator from "../stickerGenerator/stickerGenerator";
import useCanvasInteractions from "./hooks/useCanvasInteraction";
import Trash from "../trash/trash";
import saveCompositeImage from "./utils/saveCompositeImg";

const Canvas = forwardRef(
  ({ uploadedImage, imgCanvasRef, saveImage, setSaveImage, imageLoaded }) => {
    const canvasRef = useRef(null);
    const imgCanvasWrapperRef = useRef(null);
    const headerRef = useRef(null);

    const {
      stickers,
      stickersRefs,
      activeIndex,
      handleInteractionStart,
      handleInteractionMove,
      handleInteractionEnd,
      handleActiveSticker,
      setInitialPosition,
      handleGenerateSticker,
      trashRef,
      inTrash,
      handleClickOutside,
      handleOnClickDelete,
      handleReset,
    } = useCanvasInteractions(canvasRef);

    useEffect(() => {
      if (!imageLoaded || !uploadedImage) return;

      const aspectRatio = uploadedImage.width / uploadedImage.height;

      let width, height;

      //add logic to handle canvas max height // image spills out of canvas if width is too big
      if (aspectRatio < 1) {
        height = canvasRef.current.offsetHeight;
        width = height * aspectRatio;
        if (canvasRef.current.offsetwidth < width) {
          width = canvasRef.current.offsetWidth;
          height = width / aspectRatio;
        }
      } else {
        width = canvasRef.current.offsetWidth;
        height = width / aspectRatio;
        if (canvasRef.current.offsetHeight < height) {
          height = canvasRef.current.offsetHeight;
          width = height * aspectRatio;
        }
      }

      if (saveImage) {
        saveCompositeImage(
          uploadedImage,
          stickers,
          {
            x:
              imgCanvasRef.current.getBoundingClientRect().left -
              canvasRef.current.getBoundingClientRect().left,
            y:
              imgCanvasRef.current.getBoundingClientRect().top -
              canvasRef.current.getBoundingClientRect().top,
          },
          width,
          globalStyles.stickerSize
        );
        setSaveImage(false);
      }
      imgCanvasRef.current.width = width;
      imgCanvasRef.current.height = height;
      imgCanvasRef.current.style.width = width + "px";
      imgCanvasRef.current.style.height = height + "px";

      imgCanvasRef.current
        .getContext("2d")
        .drawImage(uploadedImage, 0, 0, width, height);

      return () => {};
    }, [
      uploadedImage,
      imgCanvasRef,
      saveImage,
      setSaveImage,
      stickers,
      imageLoaded,
    ]);

    useEffect(() => {
      window.addEventListener("click", handleClickOutside);
      return () => {
        window.removeEventListener("click", handleClickOutside);
      };
    }, [handleClickOutside]);

    return (
      <div
        className={styles.root}
        ref={canvasRef}
        onMouseDown={handleInteractionStart}
        onMouseUp={handleInteractionEnd}
        onTouchStart={handleInteractionStart}
        onTouchEnd={handleInteractionEnd}
        onTouchMove={handleInteractionMove}
      >
        <div className={styles.header} ref={headerRef}>
          <div className={styles["sticker-generator-wrapper"]}>
            <GridContainer iconImg={mgl1} headerRef={headerRef}>
              <StickerGenerator
                img={mgl1}
                handleGenerateSticker={handleGenerateSticker}
              />
              <StickerGenerator
                img={mgl2}
                handleGenerateSticker={handleGenerateSticker}
              />
              <StickerGenerator
                img={mgl3}
                handleGenerateSticker={handleGenerateSticker}
              />
              <StickerGenerator
                img={mgl4}
                handleGenerateSticker={handleGenerateSticker}
              />
              <StickerGenerator
                img={mgl5}
                handleGenerateSticker={handleGenerateSticker}
              />
              <StickerGenerator
                img={mgl6}
                handleGenerateSticker={handleGenerateSticker}
              />
              <StickerGenerator
                img={mgl7}
                handleGenerateSticker={handleGenerateSticker}
              />
              <StickerGenerator
                img={mgl8}
                handleGenerateSticker={handleGenerateSticker}
              />
              <StickerGenerator
                img={mgl9}
                handleGenerateSticker={handleGenerateSticker}
              />
              <StickerGenerator
                img={mgl10}
                handleGenerateSticker={handleGenerateSticker}
              />
              <StickerGenerator
                img={mgl11}
                handleGenerateSticker={handleGenerateSticker}
              />
              <StickerGenerator
                img={mgl12}
                handleGenerateSticker={handleGenerateSticker}
              />
            </GridContainer>
            <GridContainer iconImg={mglg1} headerRef={headerRef}>
              <StickerGenerator
                img={mglg1}
                handleGenerateSticker={handleGenerateSticker}
              />
              <StickerGenerator
                img={mglg2}
                handleGenerateSticker={handleGenerateSticker}
              />
            </GridContainer>
            <div className={styles.wrapper}>
              <StickerGenerator
                img={pipe1}
                handleGenerateSticker={handleGenerateSticker}
              />
            </div>
          </div>
          <div className={styles["cancel-buttons"]}>
            <div className={styles["reset"]} onClick={handleReset}>
              <ResetSvg />
              {/* <img src={resetSvg} alt="" /> */}
            </div>

            <Trash
              ref={trashRef}
              inTrash={inTrash}
              handleOnClickDelete={handleOnClickDelete}
            />
          </div>
        </div>

        <div className={styles["img-canvas-wrapper"]} ref={imgCanvasWrapperRef}>
          <canvas ref={imgCanvasRef} />
        </div>

        {stickers.map((sticker, index) => {
          return (
            <Sticker
              img={sticker.img}
              key={sticker.key}
              inTrash={inTrash}
              position={sticker.position}
              setInitialPosition={setInitialPosition}
              ref={(node) => {
                stickersRefs.current[index] = node;
              }}
              scale={sticker.scale}
              rotation={sticker.rotation}
              activeIndex={activeIndex}
              index={index}
              handleActiveSticker={(event) => {
                handleActiveSticker(event, index);
              }}
            />
          );
        })}
      </div>
    );
  }
);

export default Canvas;
