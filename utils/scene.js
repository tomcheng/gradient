class Scene {
  constructor () {
    this.objects = [];
  }

  add = object => {
    this.objects.push(object);
  };

  remove = object => {
    this.objects = this.objects.filter(o => o !== object);
  };
}

export default Scene;
