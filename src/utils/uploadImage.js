function handleImageUpload(event) {
  const file = event.target.files[0];
  if (file && file.type.match(/^image\//)) {
    const reader = new FileReader();
    reader.onload = function (e) {
      // Store uploaded image in state
      setUploadedImage(e.target.result);

      // Create a new image object
      let img = new Image();

      // Once the image is loaded, adjust the size of the wrapper
      img.onload = function () {
        let wrapper = document.querySelector(".wrapper");

        // Determine the maximum width and height based on the device type
        const maxWidth = window.innerWidth < 768 ? 300 : 500;
        const maxHeight = window.innerWidth < 768 ? 300 : 500;

        // Calculate the new dimensions while preserving the aspect ratio
        let newWidth, newHeight;
        const aspectRatio = this.width / this.height;
        if (aspectRatio >= 1) {
          newWidth = Math.min(this.width, maxWidth);
          newHeight = newWidth / aspectRatio;
        } else {
          newHeight = Math.min(this.height, maxHeight);
          newWidth = newHeight * aspectRatio;
        }

        // Set the new dimensions for the image and its wrapper
        wrapper.style.width = newWidth + "px";
        wrapper.style.height = newHeight + "px";
        img.style.width = newWidth + "px";
        img.style.height = newHeight + "px";
      };

      // Assign src of this image object
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  } else {
    setUploadedImage(null);
  }
}
