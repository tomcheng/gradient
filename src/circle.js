class Circle {
  constructor({ x, y, radius, fill }) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.fill = fill;
  }

  render = context => {
    context.beginPath();
    context.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
    context.fillStyle = this.fill;
    context.fill();
  };
}

export default Circle;
