import Rectangle from "./rectangle";

const PADDING = 10;

class Tile {
  constructor ({ i, j, width, height, color }) {
    this.rectangle = new Rectangle({
      x: i * width + 0.5 * PADDING,
      y: j * height + 0.5 * PADDING,
      width: width - PADDING,
      height: height - PADDING,
      fill: color
    })
  }

  render = context => {
    this.rectangle.render(context);
  };
}

export default Tile;
