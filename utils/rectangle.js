class Rectangle {
  constructor({ width, height, x, y, fill }) {
    this.x = x || 0;
    this.y = y || 0;
    this.width = width || 0;
    this.height = height || 0;
    this.fill = fill || "#000";
  }

  render = context => {
    context.beginPath();
    context.fillStyle = this.fill;
    context.fillRect(this.x, this.y, this.width, this.height);
  };
}

export default Rectangle;
