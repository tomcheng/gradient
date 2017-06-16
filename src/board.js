import Tile from "./tile";
import Color, { interpolate } from "./color";
import random from "lodash/random";
import sortBy from "lodash/sortBy";

const getRandomArray = length => {
  const arr = [];

  for (let i = 0; i < length; i++) {
    arr.push({ index: i, rand: random() });
  }

  return sortBy(arr, "rand").map(a => a.index);
};

class Board {
  constructor({ width, height }) {
    this.tiles = [];
    const topLeft = new Color("#6ac3a2");
    const topRight = new Color("#3a7781");
    const bottomLeft = new Color("#9d39ec");
    const bottomRight = new Color("#ffcc63");

    const horizontalTiles = 10;
    const verticalTiles = 6;
    const tileWidth = Math.ceil(width / horizontalTiles);
    const tileHeight = Math.ceil(height / verticalTiles);

    const randoms = getRandomArray(horizontalTiles * verticalTiles);

    for (let i = 0; i < horizontalTiles; i++) {
      for (let j = 0; j < verticalTiles; j++) {
        const index = j * horizontalTiles + i;
        const randomIndex = randoms[index];

        this.tiles.push(
          new Tile({
            iFinal: i,
            jFinal: j,
            i: randomIndex % horizontalTiles,
            j: Math.floor(randomIndex / horizontalTiles),
            width: tileWidth,
            height: tileHeight,
            color: interpolate({
              topLeft,
              topRight,
              bottomLeft,
              bottomRight,
              x: i,
              xTotal: horizontalTiles - 1,
              y: j,
              yTotal: verticalTiles - 1
            })
          })
        );
      }
    }
  }

  render = context => {
    this.tiles.forEach(tile => {
      tile.render(context);
    });
  };
}

export default Board;
