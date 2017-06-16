import Rectangle from "./rectangle";

const PADDING = 10;
const DECAY = 0.3;

class Tile {
  constructor({ i, j, width, height, color }) {
    this.i = i;
    this.j = j;
    this.width = width;
    this.height = height;
    this.offset = null;

    this.rectangle = new Rectangle({
      x: i * width + 0.5 * PADDING,
      y: j * height + 0.5 * PADDING,
      width: width - PADDING,
      height: height - PADDING,
      fill: color
    });
  }

  setSize = ({ width, height }) => {
    this.width = width;
    this.height = height;
  };

  setOffset = ({ x, y }) => {
    this.offset = { x, y };
  };

  clearOffset = () => {
    this.offset = null;
  };

  update = () => {
    if (this.offset) {
      this.rectangle.x = this.i * this.width + 0.5 * PADDING + this.offset.x;
      this.rectangle.y = this.j * this.height + 0.5 * PADDING + this.offset.y;
    } else {
      this.rectangle.x = this.rectangle.x + DECAY * (this.i * this.width + 0.5 * PADDING - this.rectangle.x);
      this.rectangle.y = this.rectangle.y + DECAY * (this.j * this.height + 0.5 * PADDING - this.rectangle.y);
      this.rectangle.width =
        this.rectangle.width +
        DECAY * (this.width - PADDING - this.rectangle.width);
      this.rectangle.height =
        this.rectangle.height +
        DECAY * (this.height - PADDING - this.rectangle.height);
    }
  };

  render = context => {
    this.rectangle.render(context);
  };
}

export default Tile;
