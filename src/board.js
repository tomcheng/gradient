import Tile from "./tile";
import Color, { interpolate } from "./color";
import random from "lodash/random";
import sortBy from "lodash/sortBy";
import find from "lodash/find";

const getRandomArray = length => {
  const arr = [];

  for (let i = 0; i < length; i++) {
    arr.push({ index: i, rand: random() });
  }

  return sortBy(arr, "rand").map(a => a.index);
};

class Board {
  constructor({ width, height, horizontalTiles, verticalTiles }) {

    this.tiles = [];
    this.pressedTile = null;
    this.initialPressPosition = null;
    this.horizontalTiles = horizontalTiles || 10;
    this.verticalTiles = verticalTiles || 10;
    this.tileWidth = Math.ceil(width / this.horizontalTiles);
    this.tileHeight = Math.ceil(height / this.verticalTiles);
    const topLeft = new Color("#13c3ac");
    const topRight = new Color("#104898");
    const bottomLeft = new Color("#9d39ec");
    const bottomRight = new Color("#ffcc63");

    const randoms = getRandomArray(this.horizontalTiles * this.verticalTiles);

    for (let i = 0; i < this.horizontalTiles; i++) {
      for (let j = 0; j < this.verticalTiles; j++) {
        const index = j * this.horizontalTiles + i;
        const randomIndex = randoms[index];

        this.tiles.push(
          new Tile({
            iFinal: i,
            jFinal: j,
            i: randomIndex % this.horizontalTiles,
            j: Math.floor(randomIndex / this.horizontalTiles),
            width: this.tileWidth,
            height: this.tileHeight,
            color: interpolate({
              topLeft,
              topRight,
              bottomLeft,
              bottomRight,
              x: i,
              xTotal: this.horizontalTiles - 1,
              y: j,
              yTotal: this.verticalTiles - 1
            })
          })
        );
      }
    }
  }

  _findTile = ({ x, y }) => {
    const i = Math.floor(x / this.tileWidth);
    const j = Math.floor(y / this.tileHeight);

    return find(this.tiles, tile => tile.i === i && tile.j === j);
  };

  handlePress = ({ x, y }) => {
    this.pressedTile = this._findTile({ x, y });

    const { x: tileX, y: tileY } = this.pressedTile.getPosition();

    this.pressedTileOffset = { x: x - tileX, y: y - tileY };
  };

  handleMove = ({ x, y }) => {
    const { x: xOffset, y: yOffset } = this.pressedTileOffset;

    this.pressedTile.setPosition({ x: x - xOffset, y: y - yOffset });

    const overTile = this._findTile({ x, y });

    if (overTile !== this.pressedTile) {
      this.pressedTile.swap(overTile);
    }
  };

  handleRelease = () => {
    if (this.pressedTile) {
      this.pressedTile.clearPosition();
      this.pressedTile = null;
    }
    this.pressedTileOffset = null;
  };

  setSize = ({ width, height }) => {
    this.tileWidth = Math.ceil(width / this.horizontalTiles);
    this.tileHeight = Math.ceil(height / this.verticalTiles);

    this.tiles.forEach(tile => {
      tile.setSize({ width: this.tileWidth, height: this.tileHeight });
    });
  };

  update = () => {
    this.tiles.forEach(tile => {
      tile.update();
    });
  };

  render = context => {
    this.tiles.forEach(tile => {
      tile.render(context);
    });

    if (this.pressedTile) {
      this.pressedTile.render(context);
    }
  };
}

export default Board;
