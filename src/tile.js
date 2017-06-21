import { Rectangle, Circle } from "@thomascheng/canvas-utils";

const DECAY = 0.3;
const OPACITY_DECAY = 0.1;

class Tile {
  constructor({ i, j, width, height, color, iFinal, jFinal }) {
    this.i = i;
    this.j = j;
    this.iFinal = iFinal;
    this.jFinal = jFinal;
    this.width = width;
    this.height = height;
    this.position = null;
    this.correct = iFinal === i && jFinal === j;
    this.win = false;

    this.rectangle = new Rectangle({
      x: i * width,
      y: j * height,
      width: width,
      height: height,
      fill: color
    });

    this.dot = new Circle({
      x: i * width + 0.5 * width,
      y: j * height + 0.5 * height,
      radius: 3,
      fill: "rgba(255,255,255,0.25)",
      opacity: this.correct ? 1 : 0
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

    if (!otherTile.correct) {
      otherTile.i = this.i;
      otherTile.j = this.j;
      this.i = iOther;
      this.j = jOther;
    }
  };

  checkIsCorrect = () => {
    this.correct = this.i === this.iFinal && this.j === this.jFinal;
  };

  setWin = () => {
    this.win = true;
  };

  update = () => {
    if (this.position) {
      this.rectangle.x = this.position.x;
      this.rectangle.y = this.position.y;

      this.dot.x = this.position.x + 0.5 * this.width;
      this.dot.y = this.position.y + 0.5 * this.height;
    } else {
      this.rectangle.x =
        this.rectangle.x + DECAY * (this.i * this.width - this.rectangle.x);
      this.rectangle.y =
        this.rectangle.y + DECAY * (this.j * this.height - this.rectangle.y);

      this.rectangle.width =
        this.rectangle.width + DECAY * (this.width - this.rectangle.width);
      this.rectangle.height =
        this.rectangle.height + DECAY * (this.height - this.rectangle.height);

      this.dot.x =
        this.dot.x + DECAY * ((this.i + 0.5) * this.width - this.dot.x);
      this.dot.y =
        this.dot.y + DECAY * ((this.j + 0.5) * this.height - this.dot.y);
      this.dot.opacity =
        this.dot.opacity +
        OPACITY_DECAY * ((this.correct && !this.win ? 1 : 0) - this.dot.opacity);
    }
  };

  render = context => {
    this.rectangle.render(context);
    this.dot.render(context);
  };
}

export default Tile;
