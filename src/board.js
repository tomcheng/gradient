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
    this.verticalTiles = verticalTiles || 6;
    this.tileWidth = Math.ceil(width / this.horizontalTiles);
    this.tileHeight = Math.ceil(height / this.verticalTiles);
    const topLeft = new Color("#6ac3a2");
    const topRight = new Color("#3a7781");
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
    this.initialPressPosition = { x, y };
  };

  handleMove = ({ x, y }) => {
    const { x: xInit, y: yInit } = this.initialPressPosition;
    this.pressedTile.setOffset({ x: x - xInit, y: y - yInit });
  };

  handleRelease = () => {
    if (this.pressedTile) {
      this.pressedTile.clearOffset();
      this.pressedTile = null;
    }
    this.initialPressPosition = null;
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
