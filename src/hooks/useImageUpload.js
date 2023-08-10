import { useState, useEffect } from "react";

export default function useImageUpload(imgRef) {
  const [image, setImage] = useState(null);
  const [imageLoaded, setImageLoaded] = useState(false);
  function handleImageUpload(event) {
    const file = event.target.files[0];
    if (file && file.type.match(/^image\//)) {
      const reader = new FileReader();

      reader.onload = function (e) {
        let img = new Image();

        // Once the image is loaded, adjust the size of the wrapper
        img.onload = function () {
          setImageLoaded(true); // This will force a re-render
        };
        // Assign src of this image object
        img.src = e.target.result;
        setImage(img);
      };

      reader.readAsDataURL(file);
    } else {
      setImage(null);
    }
  }
  useEffect(() => {
    setImageLoaded(false);
  }, [image]);
  return { image, handleImageUpload, imageLoaded };
}
