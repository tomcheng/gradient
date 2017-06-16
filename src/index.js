import registerServiceWorker from "./registerServiceWorker";
import Scene from "./scene";
import Renderer from "./renderer";
import Rectangle from "./rectangle";
import debounce from "lodash/debounce";

const rootEl = document.getElementById("root");

const scene = new Scene();

const renderer = new Renderer({
  canvas: rootEl,
  width: window.innerWidth,
  height: window.innerHeight
});

scene.add(
  new Rectangle({ x: 10, y: 10, width: 100, height: 100, fill: "blue" })
);
scene.add(
  new Rectangle({ x: 210, y: 10, width: 100, height: 100, fill: "green" })
);

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
