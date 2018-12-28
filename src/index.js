import React from "react";
import { render } from "react-dom";
import registerServiceWorker from "./registerServiceWorker";
import App from "./components/App";
// import debounce from "lodash/debounce";

render(<App />, document.getElementById("root"));

// const winEl = document.getElementById("win");
// const playAgainEl = document.getElementById("play-again");
//

// const handleWin = () => {
//   winEl.className = "";
//   winEl.style.display = "block";
//   requestAnimationFrame(() => {
//     winEl.className = "active";
//   });
// };
//
// playAgainEl.addEventListener("click", () => {
//   canvas.remove(board);
//
//   board = new Board({
//     width: window.innerWidth,
//     height: window.innerHeight,
//     onWin: handleWin
//   });
//
//   canvas.add(board);
//
//   winEl.style.display = "none";
// });
//
// window.addEventListener(
//   "resize",
//   debounce(() => {
//     const newSize = {
//       width: window.innerWidth,
//       height: window.innerHeight
//     };
//     board.setSize(newSize);
//     canvas.resize();
//     canvas.render();
//   }, 300)
// );
//

registerServiceWorker();
