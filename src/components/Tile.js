import React from "react";

const Tile = ({
  id,
  active,
  color,
  correct,
  height,
  width,
  left,
  top,
  onMouseDown
}) => (
  <div
    style={{
      position: "absolute",
      backgroundColor: color,
      width,
      height,
      left,
      top,
      userSelect: "none",
      zIndex: active ? 1 : 0
    }}
    onTouchStart={evt => {
      evt.preventDefault();
      onMouseDown({ id, x: evt.touches[0].clientX, y: evt.touches[0].clientY });
    }}
    onMouseDown={evt => {
      onMouseDown({ id, x: evt.clientX, y: evt.clientY });
    }}
  >
    {correct && !active && "yep"}
  </div>
);

export default Tile;
