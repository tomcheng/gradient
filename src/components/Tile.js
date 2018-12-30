import React, { memo } from "react";
import styled from "styled-components";
import { Spring } from "react-spring";

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  user-select: none;
`;

const Dot = styled.div`
  border-radius: 3px;
  width: 6px;
  height: 6px;
  background-color: #fff;
  opacity: ${props => (props.locked ? 0.25 : 0)};
  transition: opacity 0.3s ease-in-out;
`;

const Tile = ({
  id,
  isResizing,
  active,
  color,
  hasWon,
  locked,
  height,
  lastTouched,
  showMistake,
  width,
  left,
  top,
  onMouseDown
}) => (
  <Spring
    to={{ left, top }}
    config={{
      tension: 1800,
      friction: 100,
      clamp: true
    }}
    immediate={isResizing || active}
  >
    {({ left, top }) => (
      <Container
        style={{
          left: Math.round(left),
          top: Math.round(top),
          backgroundColor: color,
          width,
          height,
          zIndex: active ? 3 : lastTouched ? 2 : locked ? 0 : 1
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
        <Dot locked={locked && !active && !hasWon} />
        {showMistake && <span>&times;</span>}
      </Container>
    )}
  </Spring>
);

const areEqual = (prevProps, nextProps) =>
  [
    "id",
    "color",
    "hasWon",
    "isResizing",
    "top",
    "left",
    "active",
    "lastTouched",
    "locked",
    "showMistake",
    "width",
    "height"
  ].every(key => prevProps[key] === nextProps[key]);

export default memo(Tile, areEqual);
