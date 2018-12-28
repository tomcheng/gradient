import React from "react";
import { animated, Spring } from "react-spring";

const Tile = ({
  id,
  active,
  color,
  correct,
  height,
  lastTouched,
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
      tension: active ? 0 : 120,
      friction: active ? 0 : 10,
      clamp: true,
      precision: 1
    }}
    native
  >
    {springStyles => (
      <animated.div
        style={{
          ...springStyles,
          position: "absolute",
          backgroundColor: color,
          width,
          height,
          userSelect: "none",
          zIndex: active ? 3 : lastTouched ? 2 : correct ? 0 : 1
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
      </animated.div>
    )}
  </Spring>
);

export default Tile;
