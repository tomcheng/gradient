class Circle {
  constructor({ x, y, radius, fill, opacity }) {
    this.x = x || 0;
    this.y = y || 0;
    this.radius = radius || 0;
    this.fill = fill || "#000";
    this.opacity = opacity || 1;
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
