function isIntersecting(element1, element2) {
  // Get the bounding rectangles of the elements
  const bBox1 = element1.getBoundingClientRect();
  const bBox2 = element2.getBoundingClientRect();

  const smallerBBox1 = {
    top: bBox1.top + bBox1.height / 4,
    right: bBox1.right - bBox1.width / 4,
    bottom: bBox1.bottom - bBox1.height / 4,
    left: bBox1.left + bBox1.width / 4,
  };

  const smallerBBox2 = {
    top: bBox2.top + bBox2.height / 4,
    right: bBox2.right - bBox2.width / 4,
    bottom: bBox2.bottom - bBox2.height / 4,
    left: bBox2.left + bBox2.width / 4,
  };

  // Check if the rectangles intersect
  const intersects = !(
    smallerBBox1.right < smallerBBox2.left ||
    smallerBBox1.left > smallerBBox2.right ||
    smallerBBox1.bottom < smallerBBox2.top ||
    smallerBBox1.top > smallerBBox2.bottom
  );

  return intersects;
}

export default isIntersecting;
