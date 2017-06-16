class Renderer {
  constructor ({ canvas, width, height }) {
    this.canvas = canvas;
    this.context = this.canvas.getContext("2d");
    this.canvas.width = width;
    this.canvas.height = height;
  }

  render = scene => {
    scene.objects.forEach(object => {
      object.render(this.context);
    });
  };

  updateSize = ({ width, height }) => {
    this.canvas.width = width;
    this.canvas.height = height;
  };
}

export default Renderer;
