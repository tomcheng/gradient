import React from "react";
import { Spring } from "react-spring";

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
  <Spring
    to={{
      left,
      top
    }}
    config={{
      tension: active ? 0 : 220,
      friction: active ? 0 : 20,
      clamp: true
    }}
  >
    {springStyles => (
      <div
        style={{
          ...springStyles,
          position: "absolute",
          backgroundColor: color,
          width,
          height,
          userSelect: "none",
          zIndex: active ? 2 : correct ? 0 : 1
        }}
        onTouchStart={evt => {
          evt.preventDefault();
          onMouseDown({
            id,
            x: evt.touches[0].clientX,
            y: evt.touches[0].clientY
          });
        }}
        onMouseDown={evt => {
          onMouseDown({ id, x: evt.clientX, y: evt.clientY });
        }}
      >
        {correct && !active && "yep"}
      </div>
    )}
  </Spring>
);

export default Tile;
