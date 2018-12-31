import chroma from "chroma-js";

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
  const left = chroma
    .scale([topLeft, bottomLeft])
    .mode("lab")
    .colors(yTotal)[y];
  const right = chroma
    .scale([topRight, bottomRight])
    .mode("lab")
    .colors(yTotal)[y];
  return chroma
    .scale([left, right])
    .mode("lab")
    .colors(xTotal)[x];
};
