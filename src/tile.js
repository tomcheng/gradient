import Rectangle from "./rectangle";

class Tile {
  constructor ({ i, j, width, height, color }) {
    this.rectangle = new Rectangle({
      x: i * width,
      y: j * height,
      width,
      height,
      fill: color
    })
  }

  render = context => {
    this.rectangle.render(context);
  };
}

export default Tile;
