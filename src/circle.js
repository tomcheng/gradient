class Circle {
  constructor({ x, y, radius, fill, opacity }) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.fill = fill;
    this.opacity = opacity;
  }

  render = context => {
    context.beginPath();
    context.globalAlpha = this.opacity;
    context.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
    context.fillStyle = this.fill;
    context.fill();
    context.globalAlpha = 1;
  };
}

export default Circle;
