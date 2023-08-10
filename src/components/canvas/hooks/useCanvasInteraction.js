import { useState, useRef, useEffect, useCallback } from "react";
import useStickers from "./useStickers";
import isIntersecting from "../../../utils/isIntersecting";

export default function useCanvasInteractions(canvasRef) {
  const stickersLengthRef = useRef(0);
  const [inTrash, setInTrash] = useState(false);
  const mouseOriginRef = useRef({ x: 0, y: 0 });
  const mousePositionRef = useRef({ x: 0, y: 0 });
  const isMouseDownRef = useRef(false);
  const [isMetaDown, setIsMetaDown] = useState(false);
  const initialDistanceRef = useRef(null);
  const [initialFingersAngle, setInitialFingersAngle] = useState(0);
  const trashRef = useRef(null);

  const {
    stickers,
    stickersRefs,
    activeIndex,
    generateSticker,
    deleteActiveSticker,
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
  } = useStickers();

  useEffect(() => {}, []);

  const handleGenerateSticker = (event, img, elRef) => {
    // setMouseOrigin
    const clientX =
      event.type === "touchstart" ? event.touches[0].clientX : event.clientX;
    const clientY =
      event.type === "touchstart" ? event.touches[0].clientY : event.clientY;

    mouseOriginRef.current = { x: clientX, y: clientY };
    mousePositionRef.current = { x: clientX, y: clientY };

    const elRefRect = elRef.current.getBoundingClientRect();
    const canvasRect = canvasRef.current.getBoundingClientRect();
    const initialPosition = {
      x: elRefRect.x - canvasRect.x,
      y: elRefRect.y - canvasRect.y,
    };
    generateSticker(img, initialPosition);
  };

  const handleInteractionMove = useCallback(
    (event) => {
      if (activeIndex.current === -1) return;

      const clientX =
        event.type === "touchmove" ? event.touches[0].clientX : event.clientX;
      const clientY =
        event.type === "touchmove" ? event.touches[0].clientY : event.clientY;

      // this is for the style of the intersecting stickers
      setInTrash(
        isIntersecting(
          trashRef.current,
          stickersRefs.current[activeIndex.current]
        )
      );

      mousePositionRef.current = { x: clientX, y: clientY };

      const deltaX = clientX - mouseOriginRef.current.x;

      const deltaY = clientY - mouseOriginRef.current.y;

      if (event.type === "touchmove" && event.touches.length === 2) {
        const dx = event.touches[0].clientX - event.touches[1].clientX;
        const dy = event.touches[0].clientY - event.touches[1].clientY;

        //scale
        const currentDistance = Math.sqrt(dx * dx + dy * dy);
        if (initialDistanceRef.current) {
          const newScale = currentDistance / initialDistanceRef.current;
          handleScale(newScale);
        }

        //angle
        const currentRotation = (Math.atan2(dy, dx) * 180) / Math.PI;
        const deltaRotation = currentRotation - initialFingersAngle;
        handleRotation(deltaRotation);

        return;
      }

      // if (event.touches && event.touches.length === 2) return; //prevent moving when two fingers are on mobile screen
      if (isMouseDownRef.current && isMetaDown) {
        //Scale
        const newScale = 1 + deltaX / 50;
        handleScale(newScale);

        //Rotation
        const rotation = deltaY * 0.8; // Adjust this to control rotation speed
        handleRotation(rotation);
      } else if (isMouseDownRef.current) {
        //Position
        handlePosition({
          x: deltaX,
          y: deltaY,
        });
      }
    },
    [
      activeIndex,
      isMouseDownRef,
      isMetaDown,
      handleScale,
      handleRotation,
      handlePosition,
      initialDistanceRef,
      initialFingersAngle,
      stickersRefs,
    ]
  );

  useEffect(() => {
    if (canvasRef.current === null) return;

    const canvas = canvasRef.current;

    function handleKeyDown(e) {
      if (e.key === "Meta" || e.key === "Control") {
        setIsMetaDown(true);
      }
    }

    function handleKeyUp(e) {
      if (e.key === "Meta" || e.key === "Control") {
        setIsMetaDown(false);
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    canvas.addEventListener("mousemove", handleInteractionMove);
    canvas.addEventListener("touchmove", handleInteractionMove);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      canvas.removeEventListener("mousemove", handleInteractionMove);
      canvas.removeEventListener("touchmove", handleInteractionMove);
    };
  }, [canvasRef, handleInteractionMove]);

  const handleInteractionStart = useCallback(
    (event, index) => {
      const newIndex = index ?? activeIndex.current;
      const clientX =
        event.type === "touchstart" ? event.touches[0].clientX : event.clientX;
      const clientY =
        event.type === "touchstart" ? event.touches[0].clientY : event.clientY;
      mouseOriginRef.current = { x: clientX, y: clientY };

      if (event.touches && event.touches.length === 2) {
        if (!stickers[newIndex]) return;
        const dx = event.touches[0].clientX - event.touches[1].clientX;
        const dy = event.touches[0].clientY - event.touches[1].clientY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const angle = (Math.atan2(dy, dx) * 180) / Math.PI;
        initialDistanceRef.current = distance;

        setInitialFingersAngle(angle);
        setInitialRotation(stickers[newIndex].rotation);
        setInitialScale(stickers[newIndex].scale);
      } else {
        isMouseDownRef.current = true;

        //set initialPosition
        if (!stickersRefs.current[newIndex]) return;
        setInitialPosition({
          x: stickersRefs.current[newIndex].offsetLeft,
          y: stickersRefs.current[newIndex].offsetTop,
        });

        setInitialRotation(stickers[newIndex].rotation);
        setInitialScale(stickers[newIndex].scale);
      }
    },
    [
      isMouseDownRef,
      stickersRefs,
      activeIndex,
      setInitialRotation,
      setInitialScale,
      setInitialPosition,
      stickers,
    ]
  );

  useEffect(() => {
    if (activeIndex === -1) return;

    if (stickersLengthRef.current !== stickers.length) {
      let syntheticEvent;
      syntheticEvent = new MouseEvent("mousedown", {
        clientX: mousePositionRef.current.x,
        clientY: mousePositionRef.current.y,
      });
      // }
      handleInteractionStart(syntheticEvent);
      stickersLengthRef.current += 1;
    }
  }, [stickers.length, handleInteractionStart, activeIndex]);

  const handleInteractionEnd = (event) => {
    if (activeIndex.current === -1) return;
    if (stickersRefs?.current[activeIndex.current] === null) return;
    isMouseDownRef.current = false;
    if (
      isIntersecting(
        trashRef.current,
        stickersRefs.current[activeIndex.current]
      )
    ) {
      setInTrash(false);
      deleteActiveSticker();
      stickersLengthRef.current -= 1;
    }
  };

  const handleOnClickDelete = () => {
    deleteActiveSticker();
    stickersLengthRef.current -= 1;
  };

  const handleClickOutside = useCallback(() => {
    if (
      !stickers[activeIndex.current] ||
      !initialPositionRef?.current ||
      !initialScaleRef?.current ||
      initialRotationRef?.current == null
    ) {
      return;
    }

    const sticker = stickers[activeIndex.current];
    const notMoved =
      sticker.position.x === initialPositionRef.current.x &&
      sticker.position.y === initialPositionRef.current.y;

    const notScaled = sticker.scale === initialScaleRef.current;

    const notRotated = sticker.rotation === initialRotationRef.current;

    if (notMoved && notScaled && notRotated) {
      setActiveSticker(-1);
    }
  }, [
    stickers,
    initialPositionRef,
    activeIndex,
    setActiveSticker,
    initialScaleRef,
    initialRotationRef,
  ]);

  const handleReset = () => {
    resetStickers();
    stickersLengthRef.current = 0;
  };

  const handleActiveSticker = useCallback(
    (event, index) => {
      if (activeIndex.current === index) return;
      event.stopPropagation();
      setActiveSticker(index);
      handleInteractionStart(event, index);
    },
    [setActiveSticker, handleInteractionStart, activeIndex]
  );

  return {
    stickers,
    stickersRefs,
    activeIndex,
    handleInteractionStart,
    handleInteractionEnd,
    handleInteractionMove,
    handleActiveSticker,
    handleGenerateSticker,
    trashRef,
    inTrash,
    handleClickOutside,
    handleOnClickDelete,
    handleReset,
  };
}
