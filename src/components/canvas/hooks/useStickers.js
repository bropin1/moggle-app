import { useState, useRef, createRef, useEffect } from "react";
import generateId from "../../../utils/generateId";
export default function useStickers() {
  const [stickers, setStickers] = useState([]);
  // const [stickerRealTime, setStickerRealTime] = useState([]);
  const stickersRefs = useRef([]);
  const [activeIndex, setActiveIndex] = useState({
    previous: -1,
    current: -1,
  });
  const initialScaleRef = useRef(1);
  const initialPositionRef = useRef({ x: 0, y: 0 });
  const initialRotationRef = useRef(0);

  // useEffect(() => {
  //   console.log("USE EFFECT useStickers.js");
  //   if (
  //     activeIndex.current === -1 ||
  //     stickersRefs.current[activeIndex.current] === undefined
  //   )
  //     return;

  //   console.log("activeIndex", activeIndex);

  //   const activeStickerStyle = stickersRefs.current[activeIndex.current].style;
  //   console.log("activeStickerStyle", activeStickerStyle);
  //   //set position
  //   activeStickerStyle.left =
  //     stickerRealTime[activeIndex.current].position.x + "px";
  //   activeStickerStyle.top =
  //     stickerRealTime[activeIndex.current].position.y + "px";
  // }, [stickerRealTime, activeIndex]);

  // useEffect(() => {
  //   console.log("USE EFFECT - activeIndex WATCHER - useStickers.js");
  //   if (activeIndex.current === -1) return;

  //   const activeSticker = stickersRefs.current[activeIndex.current];

  //   //set initialPosition
  //   setInitialPosition({
  //     x: activeSticker.offsetLeft,
  //     y: activeSticker.offsetTop,
  //   });
  // }, [activeIndex]);

  useEffect(() => {
    console.log("useSticker RERENDER");
  }, []);

  //Rotation
  function setInitialRotation(initialRotation) {
    initialRotationRef.current = initialRotation;
  }
  function handleRotation(rotation) {
    if (activeIndex.current === null) return;
    console.log(
      "handleRotation() - initialRotationRef.current",
      initialRotationRef.current
    );

    console.log(
      "handleRotation() - initialRotationRef.current + rotation",
      initialRotationRef.current + rotation
    );
    setStickers((prevStickers) => {
      const newStickers = [...prevStickers];
      newStickers[activeIndex.current].rotation =
        initialRotationRef.current + rotation;
      return newStickers;
    });
  }

  //position
  function setInitialPosition(position) {
    console.log("setInitialPosition()");
    console.log("position :", position);
    if (position === null) return;
    initialPositionRef.current = position;
  }

  function handlePosition(position) {
    console.log("handlePosition()");
    if (activeIndex.current === null) return;
    if (!position) return;

    const x = initialPositionRef.current.x + position.x;
    const y = initialPositionRef.current.y + position.y;

    setStickers((prevStickers) => {
      const newStickers = [...prevStickers];
      newStickers[activeIndex.current].position = { x, y };
      return newStickers;
    });
  }

  //scale
  function setInitialScale(initialScale) {
    initialScaleRef.current = initialScale;
  }

  function handleScale(scale) {
    if (activeIndex.current === null) return;
    setStickers((prevStickers) => {
      const newStickers = [...prevStickers];
      newStickers[activeIndex.current].scale = initialScaleRef.current * scale;
      return newStickers;
    });
  }

  //generation
  function generateSticker(img, initialPosition) {
    console.log("generateSticker()");
    console.log(`generateSticker() - activeIndex : `, activeIndex);
    const key = generateId();
    let newSticker = {
      key,
      img,
      position: initialPosition,
      scale: 1,
      rotation: 0,
    };

    setActiveIndex((previousActiveIndex) => {
      return {
        previous: previousActiveIndex.current,
        current: stickers.length,
      };
    });

    // setStickerRealTime((prevStickersRealTime) => {
    //   const newStickersRealTime = [...prevStickersRealTime, { ...newSticker }];
    //   return newStickersRealTime;
    // });
    setStickers((prevStickers) => {
      const newStickers = [...prevStickers, { ...newSticker }];
      return newStickers;
    });
  }

  function deleteActiveSticker() {
    setActiveIndex((previousActiveIndex) => {
      return {
        previous: previousActiveIndex.current,
        current: -1,
      };
    });

    setStickers((prevStickers) => {
      const newStickers = prevStickers.filter(
        (_, i) => i !== activeIndex.current
      );
      return newStickers;
    });

    stickersRefs.current = stickersRefs.current.filter(
      (_, i) => i !== activeIndex.current
    );
  }

  function setActiveSticker(index) {
    console.log("setActiveSticker(index)");
    if (index === activeIndex.current) return;
    if (stickersRefs.current === null) return;
    setActiveIndex((previousActiveIndex) => {
      return {
        previous: previousActiveIndex.current,
        current: index,
      };
    });
  }

  return {
    stickers,
    stickersRefs,
    generateSticker,
    deleteActiveSticker,
    activeIndex,
    setActiveSticker,
    setInitialPosition,
    handlePosition,
    setInitialScale,
    handleScale,
    setInitialRotation,
    handleRotation,
  };
}
