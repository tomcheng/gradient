class Rectangle {
  constructor({ width, height, x, y, fill, radius }) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.radius = radius || 0;
    this.fill = fill;
  }

  render = context => {
    context.beginPath();
    context.fillStyle = this.fill;
    context.strokeStyle = this.fill;
    context.lineJoin = "round";
    context.lineWidth = this.radius;

    context.strokeRect(
      this.x + this.radius / 2,
      this.y + this.radius / 2,
      this.width - this.radius,
      this.height - this.radius
    );
    context.fillRect(
      this.x + this.radius / 2,
      this.y + this.radius / 2,
      this.width - this.radius,
      this.height - this.radius
    );
    // context.rect(this.x, this.y, this.width, this.height);
    // context.fill();
  };
}

export default Rectangle;
