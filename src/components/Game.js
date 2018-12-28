import React, { createRef, useEffect } from "react";
import styled from "styled-components";
import { Canvas } from "@thomascheng/canvas-utils";
import Board from "../board";

const Container = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
`;

let isPressed = false;

const Game = () => {
  const containerRef = createRef();

  useEffect(() => {
    const { width, height } = containerRef.current.getBoundingClientRect();

    const canvasEl = document.createElement("CANVAS");
    canvasEl.width = width;
    canvasEl.height = height;

    containerRef.current.appendChild(canvasEl);
    const canvas = new Canvas(canvasEl);
    let board = new Board({
      width,
      height,
      onWin: () => {}
    });

    canvas.add(board);

    canvasEl.addEventListener("mousedown", evt => {
      board.handlePress({ x: evt.clientX, y: evt.clientY });
      isPressed = true;
    });

    canvasEl.addEventListener("mousemove", evt => {
      if (isPressed) {
        board.handleMove({ x: evt.clientX, y: evt.clientY });
      }
    });

    canvasEl.addEventListener("mouseup", () => {
      board.handleRelease();
      isPressed = false;
    });

    canvasEl.addEventListener("touchstart", evt => {
      evt.preventDefault();
      board.handlePress({
        x: evt.touches[0].clientX,
        y: evt.touches[0].clientY
      });
      isPressed = true;
    });

    canvasEl.addEventListener("touchmove", evt => {
      evt.preventDefault();
      if (isPressed) {
        board.handleMove({
          x: evt.touches[0].clientX,
          y: evt.touches[0].clientY
        });
      }
    });

    canvasEl.addEventListener("touchend", evt => {
      evt.preventDefault();
      board.handleRelease();
      isPressed = false;
    });

    const animate = () => {
      requestAnimationFrame(animate);
      board.update();
      canvas.render();
    };

    animate();
  }, []);

  return <Container ref={containerRef} />;
};

export default Game;
