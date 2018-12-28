import React from "react";
import styled from "styled-components";
import { animated, interpolate, Spring } from "react-spring";

const Dot = styled.div`
  border-radius: 3px;
  width: 6px;
  height: 6px;
  background-color: #fff;
  opacity: ${props => (props.correct ? 0.25 : 0)};
  transition: opacity 0.15s ease-in-out 0.3s;
`;

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
    to={{ xy: [left, top] }}
    config={{
      tension: active ? 0 : 2000,
      friction: active ? 0 : 100,
      clamp: true
    }}
    native
  >
    {({ xy }) => (
      <animated.div
        style={{
          transform: xy.interpolate(
            (x, y) => `translate3d(${x}px, ${y}px, 0px)`
          ),
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
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
        {correct && !active && <Dot correct={correct && !active} />}
      </animated.div>
    )}
  </Spring>
);

export default Tile;
