class Rectangle {
  constructor ({ width, height, x, y, fill }) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.fill = fill;
  }

  render = context => {
    context.beginPath();
    context.rect(this.x, this.y, this.width, this.height);
    context.fillStyle = this.fill;
    context.fill();
  };
}

export default Rectangle;
