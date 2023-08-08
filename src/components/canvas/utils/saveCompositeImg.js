import waterMark from "../../../ressources/images/watermark.png";

export default async function saveCompositeImage(
  bgImg,
  stickers,
  imgOrigin,
  bgDisplayedWidth,
  stickerSize
) {
  if (stickers.length === 0) return;
  console.log("origin stickers", stickers);
  console.log("imgOrigin", imgOrigin);
  const ratio = bgImg.width / bgDisplayedWidth;
  const imageCache = {};
  console.log("ratio", ratio);
  // ---------------------

  const loadWatermark = () => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        resolve(img);
      };
      img.src = waterMark; // This should be the path to your watermark image
    });
  };

  // Loading watermark
  const watermark = await loadWatermark();

  //-------------------

  const loadStickerImage = async (sticker) => {
    return new Promise((resolve) => {
      const x = (sticker.position.x - imgOrigin.x) * ratio;
      const y = (sticker.position.y - imgOrigin.y) * ratio;

      // Check if the image has already been loaded
      if (imageCache[sticker.img]) {
        resolve({
          ...sticker,
          img: imageCache[sticker.img],
          position: { x, y },
        });
        return; // Exit early since the image is already loaded
      }

      const img = new Image();
      img.onload = () => {
        // Cache the loaded image
        imageCache[sticker.img] = img;
        resolve({ ...sticker, img, position: { x, y } });
      };
      img.src = sticker.img;
    });
  };

  const newStickers = await Promise.all(stickers.map(loadStickerImage));
  const stickerAspectRatio =
    newStickers[0].img.height / newStickers[0].img.width;
  console.log("stickerAspectRatio", stickerAspectRatio);

  const stickerBaseWidth = stickerSize * ratio;
  const stickerBaseHeight = stickerBaseWidth * stickerAspectRatio;
  console.log("stickerBaseWidth", stickerBaseWidth);
  console.log("stickerBaseHeight", stickerBaseHeight);
  console.log("newStickers :", newStickers);
  // sticker base size

  // Create a canvas for compositing
  const canvas = document.createElement("canvas");
  canvas.width = bgImg.width;
  canvas.height = bgImg.height;
  const ctx = canvas.getContext("2d");

  // Draw the background image
  ctx.drawImage(bgImg, 0, 0);

  // Draw each sticker, taking into account its position, scale, and rotation
  newStickers.forEach((sticker) => {
    ctx.save(); // Save the current context state
    ctx.translate(sticker.position.x, sticker.position.y);
    ctx.translate(stickerBaseWidth / 2, stickerBaseHeight / 2);
    ctx.rotate(sticker.rotation * (Math.PI / 180));
    ctx.scale(sticker.scale, sticker.scale);

    ctx.drawImage(
      sticker.img,
      -stickerBaseWidth / 2,
      -stickerBaseHeight / 2,
      stickerBaseWidth,
      stickerBaseHeight
    );
    ctx.restore(); // Restore the context state to before this sticker
  });

  // ---------------------
  const padding = canvas.width / 60; // Padding of 1/40 of the canvas's width
  const watermarkWidth = canvas.width / 2; // Adjust this to your desired watermark size
  const watermarkHeight = (watermark.height / watermark.width) * watermarkWidth;
  const watermarkPosX = canvas.width - watermarkWidth;
  const watermarkPosY = canvas.height - watermarkHeight;
  ctx.drawImage(
    watermark,
    watermarkPosX,
    watermarkPosY,
    watermarkWidth,
    watermarkHeight
  );

  //-------------------

  // Create a download link
  const imgData = canvas.toDataURL("image/png");
  const link = document.createElement("a");
  link.download = "composite.png";
  link.href = imgData;
  link.click();
}
