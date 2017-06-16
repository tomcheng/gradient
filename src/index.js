import registerServiceWorker from "./registerServiceWorker";
import Scene from "./scene";
import Renderer from "./renderer";
import Board from "./board";
import debounce from "lodash/debounce";

const rootEl = document.getElementById("root");

const scene = new Scene();

const renderer = new Renderer({
  canvas: rootEl,
  width: window.innerWidth,
  height: window.innerHeight
});

scene.add(new Board({
  width: window.innerWidth,
  height: window.innerHeight
}));

renderer.render(scene);

window.addEventListener(
  "resize",
  debounce(() => {
    renderer.updateSize({
      width: window.innerWidth,
      height: window.innerHeight
    });
    renderer.render(scene);
  }, 300)
);

console.log("hello");

registerServiceWorker();
