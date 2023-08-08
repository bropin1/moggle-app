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
  } = useStickers();

  useEffect(() => {
    console.log("useCanvasInteractions RERENDER");
  }, []);

  const handleGenerateSticker = (event, img, elRef) => {
    console.log("handleGenerateSticker()");

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
      console.log("handleInteractionMove()");
      console.log(
        "handleInteractionMove() - activeIndex.current",
        activeIndex.current
      );

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
        console.log("handleInteractionMove() - rotation", deltaRotation);

        handleRotation(deltaRotation);

        return;
      }

      // if (event.touches && event.touches.length === 2) return; //prevent moving when two fingers are on mobile screen
      if (isMouseDownRef.current && isMetaDown) {
        //Scale
        const newScale = 1 + deltaX / 50;
        handleScale(newScale);

        //Rotation
        //Threshold check for significant vertical mouse movement.
        const rotationThreshold = 5; // Choose a value that feels right for your application
        if (Math.abs(deltaY) > rotationThreshold) {
          const rotation = deltaY * 0.8; // Adjust this to control rotation speed
          handleRotation(rotation);
        }
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
    console.log("MAIN useEffect");
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
      console.log("handleInteractionStart()");
      const newIndex = index ?? activeIndex.current;
      const clientX =
        event.type === "touchstart" ? event.touches[0].clientX : event.clientX;
      const clientY =
        event.type === "touchstart" ? event.touches[0].clientY : event.clientY;
      mouseOriginRef.current = { x: clientX, y: clientY };

      if (event.touches && event.touches.length === 2) {
        const dx = event.touches[0].clientX - event.touches[1].clientX;
        const dy = event.touches[0].clientY - event.touches[1].clientY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const angle = (Math.atan2(dy, dx) * 180) / Math.PI;
        initialDistanceRef.current = distance;

        console.log("handleInteractionStart() - distance", distance);

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
    console.log("SECOND useEffect");
    if (activeIndex === -1) return;

    if (stickersLengthRef.current !== stickers.length) {
      let syntheticEvent;

      // if ("ontouchstart" in window && false) {
      //   // For touch devices
      //   console.log("line 250- useCanvasInteraction");
      //   syntheticEvent = new TouchEvent("touchstart", {
      //     touches: [
      //       {
      //         clientX: mousePositionRef.current.x,
      //         clientY: mousePositionRef.current.y,
      //       },
      //     ],
      //   });
      // } else {
      // For non-touch devices
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
    console.log("handleInteractionEnd()");
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

  const handleActiveSticker = useCallback(
    (event, index) => {
      event.stopPropagation();
      setActiveSticker(index);
      handleInteractionStart(event, index);
    },
    [setActiveSticker, handleInteractionStart]
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
  };
}
