import React, { useLayoutEffect, useRef, useState } from "react";
import styled from "styled-components";
import chroma from "chroma-js";
import clamp from "lodash/clamp";
import sample from "lodash/sample";
import shuffle from "lodash/shuffle";
import take from "lodash/take";
import { interpolate } from "../color";
import Tile from "./Tile";
import { niceColors } from "../colors";

const SIMILARITY_THRESHOLD = 10;

const Container = styled.div`
  position: relative;
`;

const getRandomColors = num => {
  const selected = [];

  while (selected.length < num) {
    const color = sample(niceColors);
    if (selected.every(c => chroma.deltaE(c, color) > SIMILARITY_THRESHOLD)) {
      selected.push(color);
    }
  }

  return selected;
};

const getRandomArray = length => {
  const arr = [];
  for (let i = 0; i < length; i++) {
    arr.push(i);
  }
  return shuffle(arr);
};

const isCorrect = tile => tile.i === tile.iFinal && tile.j === tile.jFinal;

const getInitialZenTiles = ({ horizontalTiles, verticalTiles }) => {
  const tiles = [];
  const [topLeft, topRight, bottomLeft, bottomRight] = getRandomColors(4);
  const randoms = getRandomArray(horizontalTiles * verticalTiles);

  for (let i = 0; i < horizontalTiles; i++) {
    for (let j = 0; j < verticalTiles; j++) {
      const index = j * horizontalTiles + i;
      const randomIndex = randoms[index];
      const tile = {
        id: index + 1,
        iFinal: i,
        jFinal: j,
        i: randomIndex % horizontalTiles,
        j: Math.floor(randomIndex / horizontalTiles),
        color: interpolate({
          topLeft,
          topRight,
          bottomLeft,
          bottomRight,
          x: i,
          xTotal: horizontalTiles,
          y: j,
          yTotal: verticalTiles
        })
      };

      tiles.push({
        ...tile,
        locked: isCorrect(tile)
      });
    }
  }

  return tiles;
};

const getInitialPuzzleTiles = ({ horizontalTiles, verticalTiles }) => {
  const tiles = [];
  const [topLeft, topRight, bottomLeft, bottomRight] = getRandomColors(4);
  const randoms = getRandomArray(horizontalTiles * verticalTiles);
  const lockedPositions = take(randoms, 4).map(random => [
    random % horizontalTiles,
    Math.floor(random / horizontalTiles)
  ]);

  for (let i = 0; i < horizontalTiles; i++) {
    for (let j = 0; j < verticalTiles; j++) {
      const index = j * horizontalTiles + i;
      const randomIndex = randoms[index];
      const id = index + 1;
      const tile = {
        id,
        iFinal: i,
        jFinal: j,
        i: randomIndex % horizontalTiles,
        j: Math.floor(randomIndex / horizontalTiles),
        color: interpolate({
          topLeft,
          topRight,
          bottomLeft,
          bottomRight,
          x: i,
          xTotal: horizontalTiles,
          y: j,
          yTotal: verticalTiles
        })
      };

      tiles.push({
        ...tile,
        locked: lockedPositions.some(coord => coord[0] === i && coord[1] === j)
      });
    }
  }

  return lockedPositions.reduce((newTiles, coord) => {
    const tileInPosition = newTiles.find(
      tile => tile.i === coord[0] && tile.j === coord[1]
    );
    const correctTile = newTiles.find(
      tile => tile.iFinal === coord[0] && tile.jFinal === coord[1]
    );
    return tileInPosition.id === correctTile.id
      ? newTiles
      : swapTiles({
          tiles: newTiles,
          id1: tileInPosition.id,
          id2: correctTile.id
        });
  }, tiles);
};

const findTile = ({ x, y, tiles, tileWidth, tileHeight }) => {
  const i = Math.floor(x / tileWidth);
  const j = Math.floor(y / tileHeight);

  return tiles.find(tile => tile.i === i && tile.j === j);
};

const swapTiles = ({ tiles, id1, id2 }) => {
  const tile1 = tiles.find(tile => tile.id === id1);
  const tile2 = tiles.find(tile => tile.id === id2);
  return tiles.map(tile =>
    tile.id === id1
      ? { ...tile1, i: tile2.i, j: tile2.j }
      : tile.id === id2
      ? { ...tile2, i: tile1.i, j: tile1.j }
      : tile
  );
};

const lockTiles = ({ tiles }) =>
  tiles.map(tile => (isCorrect(tile) ? { ...tile, locked: true } : tile));

const checkWin = ({ tiles }) => tiles.every(isCorrect);

const Game = ({
  height,
  mode,
  hasWon,
  horizontalTiles,
  showMistakes,
  verticalTiles,
  isResizing,
  onResetResizing,
  onWin
}) => {
  const containerRef = useRef(null);
  const [boardDimensions, setBoardDimensions] = useState(null);
  const [tiles, setTiles] = useState(null);
  const [activeTileId, setActiveTileId] = useState(null);
  const [lastTouchedTileId, setLastTouchedTileId] = useState(null);
  const [tileOffset, setTileOffset] = useState(null);
  const [startPosition, setStartPosition] = useState(null);
  const [hasDragged, setHasDragged] = useState(false);
  const [selectedTileId, setSelectedTileId] = useState(null);
  const [dragPosition, setDragPosition] = useState(null);
  const tileWidth =
    boardDimensions && Math.round(boardDimensions.width / horizontalTiles);
  const tileHeight =
    boardDimensions && Math.round(boardDimensions.height / verticalTiles);

  useLayoutEffect(() => {
    setTiles(
      mode === "ZEN"
        ? getInitialZenTiles({ horizontalTiles, verticalTiles })
        : getInitialPuzzleTiles({ horizontalTiles, verticalTiles })
    );

    const calculateDimensions = () => {
      const {
        width,
        height,
        top
      } = containerRef.current.getBoundingClientRect();
      setBoardDimensions({ width, height, top });
    };
    calculateDimensions();
    window.addEventListener("resize", calculateDimensions);
    return () => {
      window.removeEventListener("resize", calculateDimensions);
    };
  }, []);

  const handleMouseDown = ({ id, x, y }) => {
    const tile = tiles.find(tile => tile.id === id);

    if (tile.locked) {
      return;
    }

    if (isResizing) {
      onResetResizing();
    }

    setHasDragged(false);
    setStartPosition({ x, y });

    const tileOffset = {
      x: x - tile.i * tileWidth,
      y: y - tile.j * tileHeight
    };
    setActiveTileId(id);
    setTileOffset(tileOffset);
    setDragPosition({
      x: clamp(x - tileOffset.x, 0, (horizontalTiles - 1) * tileWidth),
      y: clamp(y - tileOffset.y, 0, (verticalTiles - 1) * tileHeight)
    });
  };

  const handleMouseMove = ({ id, x, y }) => {
    if (!activeTileId) {
      return;
    }

    if (
      !hasDragged &&
      (startPosition.x - x) ** 2 + (startPosition.y - y) ** 2 >= 4
    ) {
      setSelectedTileId(null);
      setHasDragged(true);
    }

    setDragPosition({
      x: clamp(x - tileOffset.x, 0, (horizontalTiles - 1) * tileWidth),
      y: clamp(y - tileOffset.y, 0, (verticalTiles - 1) * tileHeight)
    });
    const overTile = findTile({
      x,
      y: y - boardDimensions.top,
      tiles,
      tileWidth,
      tileHeight
    });

    if (overTile && overTile.id !== activeTileId && !overTile.locked) {
      setTiles(swapTiles({ tiles, id1: activeTileId, id2: overTile.id }));
    }
  };

  const handleMouseUp = () => {
    setLastTouchedTileId(activeTileId);
    let newTiles = tiles;

    if (!hasDragged) {
      if (selectedTileId && activeTileId) {
        newTiles = swapTiles({
          tiles: newTiles,
          id1: selectedTileId,
          id2: activeTileId
        });
        setSelectedTileId(null);
      } else {
        setSelectedTileId(activeTileId);
      }
    }

    setActiveTileId(null);
    setTileOffset(null);
    setDragPosition(null);

    if (mode === "ZEN") {
      newTiles = lockTiles({ tiles: newTiles });
    }
    if (checkWin({ tiles: newTiles })) {
      onWin();
    }

    setTiles(newTiles);
  };

  return (
    <Container
      ref={containerRef}
      style={{ height }}
      onTouchMove={evt => {
        evt.preventDefault();
        handleMouseMove({
          x: evt.touches[0].clientX,
          y: evt.touches[0].clientY
        });
      }}
      onMouseMove={evt => {
        handleMouseMove({ x: evt.clientX, y: evt.clientY });
      }}
      onTouchEnd={evt => {
        evt.preventDefault();
        handleMouseUp();
      }}
      onMouseUp={handleMouseUp}
    >
      {tiles &&
        tiles.map(tile => {
          const { id, i, j, color, locked } = tile;
          const active = activeTileId === id;
          const left = active ? dragPosition.x : i * tileWidth;
          const top = active ? dragPosition.y : j * tileHeight;

          return (
            <Tile
              key={id}
              lastTouched={lastTouchedTileId === id}
              active={active}
              hasWon={hasWon}
              locked={locked}
              selected={selectedTileId === id}
              showMistake={showMistakes && !isCorrect(tile)}
              id={id}
              isResizing={isResizing}
              left={left}
              top={top}
              color={color}
              width={tileWidth}
              height={tileHeight}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
            />
          );
        })}
    </Container>
  );
};

export default Game;
