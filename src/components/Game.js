import React, { useLayoutEffect, useRef, useState } from "react";
import styled from "styled-components";
import Tile from "./Tile";
import { interpolate } from "../color";
import random from "lodash/random";
import shuffle from "lodash/shuffle";
import { niceColors } from "../colors";
import Color from "../color";

const Container = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  touch-action: none;
`;

const getRandomColors = num =>
  shuffle(niceColors)
    .slice(0, num)
    .map(hex => new Color(hex));

const getRandomArray = length => {
  const arr = [];
  for (let i = 0; i < length; i++) {
    arr.push(i);
  }
  return shuffle(arr);
};

const getInitialTiles = ({ horizontalTiles, verticalTiles, mode }) => {
  const tiles = [];
  const [topLeft, topRight, bottomLeft, bottomRight] = getRandomColors(4);
  const randoms = getRandomArray(horizontalTiles * verticalTiles);
  const cornerIndices = [
    0,
    horizontalTiles - 1,
    (verticalTiles - 1) * horizontalTiles,
    verticalTiles * horizontalTiles - 1
  ];

  for (let i = 0; i < horizontalTiles; i++) {
    for (let j = 0; j < verticalTiles; j++) {
      const index = j * horizontalTiles + i;
      const randomIndex = randoms[index];

      tiles.push({
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
          xTotal: horizontalTiles - 1,
          y: j,
          yTotal: verticalTiles - 1
        }),
        locked: mode === "PUZZLE" && cornerIndices.includes(index)
      });
    }
  }

  return tiles;
};

const findTile = ({ x, y, tiles, tileDimensions }) => {
  const i = Math.floor(x / tileDimensions.width);
  const j = Math.floor(y / tileDimensions.height);

  return tiles.find(tile => tile.i === i && tile.j === j);
};

const isCorrect = tile => tile.i === tile.iFinal && tile.j === tile.jFinal;

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

const Game = ({ mode }) => {
  const containerRef = useRef(null);
  const [tileDimensions, setTileDimensions] = useState(null);
  const [tiles, setTiles] = useState(null);
  const [activeTile, setActiveTile] = useState(null);
  const [tileOffset, setTileOffset] = useState(null);
  const [currentPosition, setCurrentPosition] = useState(null);

  useLayoutEffect(() => {
    const horizontalTiles = random(4, 8);
    const verticalTiles = random(6, 12);
    const calculateDimensions = () => {
      const { width, height } = containerRef.current.getBoundingClientRect();
      setTileDimensions({
        width: Math.ceil(width / horizontalTiles),
        height: Math.ceil(height / verticalTiles)
      });
    };

    calculateDimensions();
    setTiles(getInitialTiles({ horizontalTiles, verticalTiles, mode }));
    window.addEventListener("resize", calculateDimensions);

    return () => {
      window.removeEventListener("resize", calculateDimensions);
    };
  }, []);

  const handleMouseDown = ({ id, x, y }) => {
    const tile = tiles.find(tile => tile.id === id);
    setActiveTile(id);
    setTileOffset({
      x: x - tile.i * tileDimensions.width,
      y: y - tile.j * tileDimensions.height
    });
    setCurrentPosition({ x, y });
  };

  const handleMouseMove = ({ id, x, y }) => {
    if (!activeTile) {
      return;
    }

    setCurrentPosition({ x, y });
    const overTile = findTile({ x, y, tiles, tileDimensions });
    if (overTile && overTile.id !== activeTile && !isCorrect(overTile)) {
      setTiles(swapTiles({ tiles, id1: activeTile, id2: overTile.id }));
    }
  };

  const handleMouseUp = () => {
    setActiveTile(null);
    setTileOffset(null);
    setCurrentPosition(null);
  };

  return (
    <Container
      ref={containerRef}
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
          const { id, i, j, color } = tile;
          const active = activeTile === id;
          const left = active
            ? currentPosition.x - tileOffset.x
            : i * tileDimensions.width;
          const top = active
            ? currentPosition.y - tileOffset.y
            : j * tileDimensions.height;
          return (
            <Tile
              key={id}
              active={active}
              correct={isCorrect(tile)}
              id={id}
              left={left}
              top={top}
              color={color}
              width={tileDimensions.width}
              height={tileDimensions.height}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
            />
          );
        })}
    </Container>
  );
};

export default Game;
