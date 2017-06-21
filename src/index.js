import registerServiceWorker from "./registerServiceWorker";
import { Canvas } from "@thomascheng/canvas-utils";
import Board from "./board";
import debounce from "lodash/debounce";

const rootEl = document.getElementById("root");
const touchEl = document.getElementById("touch");
const winEl = document.getElementById("win");
const playAgainEl = document.getElementById("play-again");

const handleWin = () => {
  winEl.className = "";
  winEl.style.display = "block";
  requestAnimationFrame(() => {
    winEl.className = "active";
  });
};

const canvas = new Canvas({
  domNode: rootEl,
  width: window.innerWidth,
  height: window.innerHeight
});
let board = new Board({
  width: window.innerWidth,
  height: window.innerHeight,
  onWin: handleWin
});

canvas.add(board);

let isPressed = false;

playAgainEl.addEventListener("click", () => {
  canvas.remove(board);

  board = new Board({
    width: window.innerWidth,
    height: window.innerHeight,
    onWin: handleWin
  });

  canvas.add(board);

  winEl.style.display = "none";
});

touchEl.addEventListener("mousedown", evt => {
  board.handlePress({ x: evt.clientX, y: evt.clientY });
  isPressed = true;
});

touchEl.addEventListener("mousemove", evt => {
  if (isPressed) {
    board.handleMove({ x: evt.clientX, y: evt.clientY });
  }
});

touchEl.addEventListener("mouseup", () => {
  board.handleRelease();
  isPressed = false;
});

touchEl.addEventListener("touchstart", evt => {
  evt.preventDefault();
  board.handlePress({ x: evt.touches[0].clientX, y: evt.touches[0].clientY });
  isPressed = true;
});

touchEl.addEventListener("touchmove", evt => {
  evt.preventDefault();
  if (isPressed) {
    board.handleMove({ x: evt.touches[0].clientX, y: evt.touches[0].clientY });
  }
});

touchEl.addEventListener("touchend", evt => {
  evt.preventDefault();
  board.handleRelease();
  isPressed = false;
});

window.addEventListener(
  "resize",
  debounce(() => {
    const newSize = {
      width: window.innerWidth,
      height: window.innerHeight
    };
    board.setSize(newSize);
    canvas.setSize(newSize);
    canvas.render();
  }, 300)
);

const animate = () => {
  requestAnimationFrame(animate);
  board.update();
  canvas.render();
};

animate();

registerServiceWorker();
