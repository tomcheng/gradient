import Tile from "./tile";
import Color, { interpolate } from "./color";

class Board {
  constructor({ width, height }) {
    this.tiles = [];
    const topLeft = new Color("#6ac3a2");
    const topRight = new Color("#3a7781");
    const bottomLeft = new Color("#9d39ec");
    const bottomRight = new Color("#ffcc63");

    const horizontalTiles = 15;
    const verticalTiles = 10;
    const tileWidth = Math.ceil(width / horizontalTiles);
    const tileHeight = Math.ceil(height / verticalTiles);

    for (let i = 0; i < horizontalTiles; i++) {
      for (let j = 0; j < verticalTiles; j++) {
        this.tiles.push(
          new Tile({
            i,
            j,
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
