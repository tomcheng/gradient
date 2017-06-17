import Tile from "./tile";
import Color, { interpolate } from "./color";
import { niceColors } from "./colors";
import find from "lodash/find";
import shuffle from "lodash/shuffle";

const getRandomArray = length => {
  const arr = [];

  for (let i = 0; i < length; i++) {
    arr.push(i);
  }

  return shuffle(arr);
};

const getRandomColors = num => shuffle(niceColors).slice(0, num).map(hex => new Color(hex));

class Board {
  constructor({ width, height, horizontalTiles, verticalTiles }) {
    this.tiles = [];
    this.pressedTile = null;
    this.pressedTileOffset = null;
    this.horizontalTiles = horizontalTiles || 8;
    this.verticalTiles = verticalTiles || 12;
    this.tileWidth = Math.ceil(width / this.horizontalTiles);
    this.tileHeight = Math.ceil(height / this.verticalTiles);
    const [topLeft, topRight, bottomLeft, bottomRight] = getRandomColors(4);

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
    const tile = this._findTile({ x, y });

    if (tile.isCorrect()) {
      return;
    }

    this.pressedTile = tile;

    const { x: tileX, y: tileY } = this.pressedTile.getPosition();

    this.pressedTileOffset = { x: x - tileX, y: y - tileY };
  };

  handleMove = ({ x, y }) => {
    if (!this.pressedTile) {
      return;
    }

    const { x: xOffset, y: yOffset } = this.pressedTileOffset;

    this.pressedTile.setPosition({ x: x - xOffset, y: y - yOffset });

    const overTile = this._findTile({ x, y });

    if (overTile && overTile !== this.pressedTile) {
      this.pressedTile.swap(overTile);
    }
  };

  handleRelease = () => {
    if (this.pressedTile) {
      this.pressedTile.clearPosition();
      this.pressedTile = null;
      this.tiles.forEach(tile => tile.checkIsCorrect());
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
