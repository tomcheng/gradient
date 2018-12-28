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

const Game = ({ mode }) => {
  const containerRef = useRef(null);
  const [tileDimensions, setTileDimensions] = useState(null);
  const [tiles, setTiles] = useState(null);
  const [activeTile, setActiveTile] = useState(null);
  const [startPosition, setStartPosition] = useState(null);
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
    setActiveTile(id);
    setStartPosition({ x, y });
    setCurrentPosition({ x, y });
  };

  const handleMouseMove = ({ id, x, y }) => {
    if (!activeTile) {
      return;
    }

    setCurrentPosition({ x, y });
  };

  const handleMouseUp = () => {
    setActiveTile(null);
    setStartPosition(null);
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
        tiles.map(({ id, i, j, color }) => {
          const active = activeTile === id;
          const left =
            i * tileDimensions.width +
            (active ? currentPosition.x - startPosition.x : 0);
          const top =
            j * tileDimensions.height +
            (active ? currentPosition.y - startPosition.y : 0);
          return (
            <Tile
              key={id}
              active={active}
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
