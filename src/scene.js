class Scene {
  constructor () {
    this.objects = [];
  }

  add = object => {
    this.objects.push(object);
  };
}

export default Scene;
