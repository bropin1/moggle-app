import html2canvas from "html2canvas";

export default function printImage(elementToPrint) {
  // elementToHide.style.display = "none";
  html2canvas(elementToPrint, {
    scale: 500 / elementToPrint.offsetWidth,
  }).then((canvas) => {
    // elementToHide.style.display = "";
    const imgData = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.download = "mogged.png";
    link.href = imgData;
    link.click();
  });
}
