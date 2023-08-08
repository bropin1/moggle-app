import { useState } from "react";

export default function useImageUpload(imgRef) {
  const [uploadedImage, setUploadedImage] = useState(null);
  function handleImageUpload(event) {
    const file = event.target.files[0];
    if (file && file.type.match(/^image\//)) {
      const reader = new FileReader();
      reader.onload = function (e) {
        let img = new Image();

        // Once the image is loaded, adjust the size of the wrapper
        img.onload = function () {};

        // Assign src of this image object
        img.src = e.target.result;
        setUploadedImage(img);
      };
      reader.readAsDataURL(file);
    } else {
      setUploadedImage(null);
    }
  }

  return { uploadedImage, handleImageUpload };
}