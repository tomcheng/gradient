class Renderer {
  constructor ({ domNode, width, height }) {
    this.canvas = domNode;
    this.context = this.canvas.getContext("2d");
    this.canvas.width = width;
    this.canvas.height = height;
  }

  render = scene => {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    scene.objects.forEach(object => {
      object.render(this.context);
    });
  };

  setSize = ({ width, height }) => {
    this.canvas.width = width;
    this.canvas.height = height;
  };
}

export default Renderer;
