import Rectangle from "./rectangle";

const PADDING = 16;
const RADIUS = 10;
const DECAY = 0.3;

class Tile {
  constructor({ i, j, width, height, color, iFinal, jFinal }) {
    this.i = i;
    this.j = j;
    this.iFinal = iFinal;
    this.jFinal = jFinal;
    this.width = width;
    this.height = height;
    this.position = null;

    this.rectangle = new Rectangle({
      x: i * width + 0.5 * PADDING,
      y: j * height + 0.5 * PADDING,
      width: width - PADDING,
      height: height - PADDING,
      radius: RADIUS,
      fill: color
    });
  }

  setSize = ({ width, height }) => {
    this.width = width;
    this.height = height;
  };

  getPosition = () => ({
    x: this.rectangle.x,
    y: this.rectangle.y
  });

  setPosition = ({ x, y }) => {
    this.position = { x, y };
  };

  clearPosition = () => {
    this.position = null;
  };

  swap = otherTile => {
    const { i: iOther, j: jOther } = otherTile;

    if (!otherTile.isCorrect()) {
      otherTile.i = this.i;
      otherTile.j = this.j;
      this.i = iOther;
      this.j = jOther;
    }
  };

  isCorrect = () => this.i === this.iFinal && this.j === this.jFinal;

  update = () => {
    const isCorrect = this.isCorrect();
    const padding = isCorrect ? 0 : PADDING;
    const radius = isCorrect ? 0 : RADIUS;

    if (this.position) {
      this.rectangle.x = this.position.x;
      this.rectangle.y = this.position.y;
    } else {
      this.rectangle.x = this.rectangle.x + DECAY * (this.i * this.width + 0.5 * padding - this.rectangle.x);
      this.rectangle.y = this.rectangle.y + DECAY * (this.j * this.height + 0.5 * padding - this.rectangle.y);
      this.rectangle.width =
        this.rectangle.width +
        DECAY * (this.width - padding - this.rectangle.width);
      this.rectangle.height =
        this.rectangle.height +
        DECAY * (this.height - padding - this.rectangle.height);
      this.rectangle.radius =
        this.rectangle.radius +
        DECAY * (radius - this.rectangle.radius);
    }
  };

  render = context => {
    this.rectangle.render(context);
  };
}

export default Tile;
