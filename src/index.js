import registerServiceWorker from "./registerServiceWorker";
import Scene from "./scene";
import Renderer from "./renderer";
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

const renderer = new Renderer({
  canvas: rootEl,
  width: window.innerWidth,
  height: window.innerHeight
});
const scene = new Scene();
let board = new Board({
  width: window.innerWidth,
  height: window.innerHeight,
  onWin: handleWin
});

scene.add(board);

let isPressed = false;

playAgainEl.addEventListener("click", () => {
  scene.remove(board);

  board = new Board({
    width: window.innerWidth,
    height: window.innerHeight,
    onWin: handleWin
  });

  scene.add(board);

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
    renderer.setSize(newSize);
    renderer.render(scene);
  }, 300)
);

const animate = () => {
  requestAnimationFrame(animate);

  board.update();
  renderer.render(scene);
};

animate();

registerServiceWorker();
