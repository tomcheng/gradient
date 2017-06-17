class Color {
  constructor(hex) {
    this.r = parseInt(hex.slice(1, 3), 16);
    this.g = parseInt(hex.slice(3, 5), 16);
    this.b = parseInt(hex.slice(5, 7), 16);

    const hsl = rgbToHsl(this.r, this.g, this.b);

    this.h = hsl[0];
    this.s = hsl[1];
    this.l = hsl[2];
  }

  setSaturation = s => {
    this.s = s;

    const rgb = hslToRgb(this.h, this.s, this.l);

    this.r = rgb[0];
    this.g = rgb[1];
    this.b = rgb[2];
  };
}

const rgbToHsl = (r, g, b) => {
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b),
    min = Math.min(r, g, b);
  let h,
    s,
    l = (max + min) / 2;

  if (max === min) {
    h = s = 0; // achromatic
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
      default:
        break;
    }
    h /= 6;
  }

  return [h, s, l];
};

const hslToRgb = (h, s, l) => {
  let r, g, b;

  if (s === 0) {
    r = g = b = l; // achromatic
  } else {
    const hue2rgb = (p, q, t) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };

    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }

  return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
};

const interpolateNum = (start, end, index, total) =>
  start + (end - start) * index / total;

export const interpolate = ({
  topLeft,
  topRight,
  bottomLeft,
  bottomRight,
  x,
  xTotal,
  y,
  yTotal
}) => {
  const topR = interpolateNum(topLeft.r, topRight.r, x, xTotal);
  const topG = interpolateNum(topLeft.g, topRight.g, x, xTotal);
  const topB = interpolateNum(topLeft.b, topRight.b, x, xTotal);
  const bottomR = interpolateNum(bottomLeft.r, bottomRight.r, x, xTotal);
  const bottomG = interpolateNum(bottomLeft.g, bottomRight.g, x, xTotal);
  const bottomB = interpolateNum(bottomLeft.b, bottomRight.b, x, xTotal);
  const newR = interpolateNum(topR, bottomR, y, yTotal);
  const newG = interpolateNum(topG, bottomG, y, yTotal);
  const newB = interpolateNum(topB, bottomB, y, yTotal);

  return `rgba(${Math.round(newR)}, ${Math.round(newG)}, ${Math.round(
    newB
  )}, 1)`;
};

export default Color;
