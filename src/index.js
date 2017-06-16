import registerServiceWorker from "./registerServiceWorker";
import Scene from "./scene";
import Renderer from "./renderer";
import Board from "./board";
import debounce from "lodash/debounce";

const rootEl = document.getElementById("root");
const renderer = new Renderer({
  canvas: rootEl,
  width: window.innerWidth,
  height: window.innerHeight
});
const scene = new Scene();
const board = new Board({
  width: window.innerWidth,
  height: window.innerHeight
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

scene.add(board);

const animate = () => {
  requestAnimationFrame(animate);

  board.update();
  renderer.render(scene);
};

animate();

registerServiceWorker();
