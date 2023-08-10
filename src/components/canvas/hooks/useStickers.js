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

  function resetStickers() {
    setStickers([]);
    setActiveIndex({
      previous: -1,
      current: -1,
    });
    initialScaleRef.current = 1;
    initialPositionRef.current = { x: 0, y: 0 };
    initialRotationRef.current = 0;
  }

  //Rotation
  function setInitialRotation(initialRotation) {
    initialRotationRef.current = initialRotation;
  }
  function handleRotation(rotation) {
    if (activeIndex.current === null) return;

    setStickers((prevStickers) => {
      const newStickers = [...prevStickers];
      newStickers[activeIndex.current].rotation =
        initialRotationRef.current + rotation;
      return newStickers;
    });
  }

  //position
  function setInitialPosition(position) {
    if (position === null) return;
    initialPositionRef.current = position;
  }

  function handlePosition(position) {
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
    if (index === activeIndex.current && index !== -1) return;

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
    initialPositionRef,
    initialScaleRef,
    initialRotationRef,
    resetStickers,
  };
}
