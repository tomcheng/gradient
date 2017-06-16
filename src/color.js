class Color {
  constructor(hex) {
    this.r = parseInt(hex.slice(1, 3), 16);
    this.g = parseInt(hex.slice(3, 5), 16);
    this.b = parseInt(hex.slice(5, 7), 16);
  }
}

const interpolateNum = (start, end, index, total) =>
  start + (end - start) * index / total;

export const interpolate = ({ topLeft, topRight, bottomLeft, bottomRight, x, xTotal, y, yTotal }) => {
  const topR = interpolateNum(topLeft.r, topRight.r, x, xTotal);
  const topG = interpolateNum(topLeft.g, topRight.g, x, xTotal);
  const topB = interpolateNum(topLeft.b, topRight.b, x, xTotal);
  const bottomR = interpolateNum(bottomLeft.r, bottomRight.r, x, xTotal);
  const bottomG = interpolateNum(bottomLeft.g, bottomRight.g, x, xTotal);
  const bottomB = interpolateNum(bottomLeft.b, bottomRight.b, x, xTotal);
  const newR = interpolateNum(topR, bottomR, y, yTotal);
  const newG = interpolateNum(topG, bottomG, y, yTotal);
  const newB = interpolateNum(topB, bottomB, y, yTotal);

  return `rgba(${Math.round(newR)}, ${Math.round(newG)}, ${Math.round(newB)}, 1)`;
};

export default Color;
