import Tile from "./tile";
import Color, { interpolate } from "./color";
import { niceColors } from "./colors";
import find from "lodash/find";
import findIndex from "lodash/findIndex";
import shuffle from "lodash/shuffle";
import random from "lodash/random";

const getRandomArray = length => {
  const arr = [];

  for (let i = 0; i < length; i++) {
    arr.push(i);
  }

  return shuffle(arr);
};

const getRandomColors = num =>
  shuffle(niceColors)
    .slice(0, num)
    .map(hex => new Color(hex));

const mode = "ZEN";

const swap = (arr, indexA, indexB) => {
  const valA = arr[indexA];
  const valB = arr[indexB];

  return arr.map((val, index) =>
    index === indexB ? valA : index === indexA ? valB : val
  );
};

class Board {
  constructor({ width, height, onWin }) {
    this.tiles = [];
    this.pressedTile = null;
    this.lastPressedTile = null;
    this.pressedTileOffset = null;
    if (height > width) {
      this.horizontalTiles = random(4, 8);
      this.verticalTiles = random(6, 12);
    } else {
      this.horizontalTiles = random(6, 12);
      this.verticalTiles = random(4, 8);
    }
    this.tileWidth = Math.ceil(width / this.horizontalTiles);
    this.tileHeight = Math.ceil(height / this.verticalTiles);
    this.onWin = onWin;

    const [topLeft, topRight, bottomLeft, bottomRight] = getRandomColors(4);

    let randoms = getRandomArray(this.horizontalTiles * this.verticalTiles);
    const cornerIndices = [
      0,
      this.horizontalTiles - 1,
      (this.verticalTiles - 1) * this.horizontalTiles,
      this.verticalTiles * this.horizontalTiles - 1
    ];

    if (mode === "PUZZLE") {
      cornerIndices.forEach(cornerIndex => {
        const oldCornerPosition = findIndex(
          randoms,
          val => val === cornerIndex
        );
        randoms = swap(randoms, oldCornerPosition, cornerIndex);
      });
    }

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
            }),
            lockIfCorrect: mode !== "PUZZLE",
            locked: mode === "PUZZLE" && cornerIndices.includes(index)
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

    if (tile.locked) {
      return;
    }

    this.pressedTile = tile;
    this.lastPressedTile = tile;

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

      if (this.checkWin()) {
        window.setTimeout(() => {
          this.tiles.forEach(tile => tile.setWin());
          this.onWin();
        }, 500);
      }
    }

    this.pressedTileOffset = null;
  };

  checkWin = () => this.tiles.every(tile => tile.correct);

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
    const correctTiles = [];
    const incorrectTiles = [];

    this.tiles.forEach(tile => {
      if (tile.correct) {
        correctTiles.push(tile);
      } else {
        incorrectTiles.push(tile);
      }
    });

    correctTiles.forEach(tile => {
      tile.render(context);
    });

    incorrectTiles.forEach(tile => {
      tile.render(context);
    });

    if (this.lastPressedTile) {
      this.lastPressedTile.render(context);
    }
  };
}

export default Board;
