import React, { Fragment, useLayoutEffect, useRef, useState } from "react";
import styled from "styled-components";
import Game from "./Game";
import random from "lodash/random";

const MINIMUM_HEADER_HEIGHT = 36;
const MINIMUM_HORIZONTAL_PADDING = 4;

const Container = styled.div`
  height: 100%;
  overflow: hidden;
  background-color: #111;
  color: #fff;
`;

const Header = styled.div``;

const Overlay = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: center;
  z-index: 10;
`;

const Title = styled.div`
  font-size: 32px;
  line-height: 40px;
  margin-bottom: 15px;
`;

const Button = styled.div`
  display: inline-block;
  position: relative;
  border: 0;
  font-size: 18px;
  cursor: pointer;
  padding: 10px 15px;
  background-color: #fff;
  color: #345069;
  border-radius: 3px;
  user-select: none;
`;

const App = () => {
  const containerRef = useRef(null);
  const [gameId, setGameId] = useState(1);
  const [isResizing, setIsResizing] = useState(false);
  const [containerDimensions, setContainerDimensions] = useState(null);
  const [hasWon, setHasWon] = useState(false);
  const [tileCounts] = useState({
    horizontal: random(4, 8),
    vertical: random(6, 10)
  });
  const gameHeight =
    containerDimensions &&
    Math.floor(
      (containerDimensions.height - 2 * MINIMUM_HEADER_HEIGHT) /
        tileCounts.vertical
    ) * tileCounts.vertical;
  const gameWidth =
    containerDimensions &&
    Math.floor(
      (containerDimensions.width - 2 * MINIMUM_HORIZONTAL_PADDING) /
        tileCounts.horizontal
    ) * tileCounts.horizontal;
  const headerHeight =
    containerDimensions &&
    Math.round((containerDimensions.height - gameHeight) / 2);
  const horizontalPadding =
    containerDimensions &&
    Math.round((containerDimensions.width - gameWidth) / 2);

  useLayoutEffect(() => {
    const handleResize = () => {
      setIsResizing(true);
      const { width, height } = containerRef.current.getBoundingClientRect();
      setContainerDimensions({ height, width });
    };
    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <Container ref={containerRef}>
      {containerDimensions && (
        <Fragment>
          <Header style={{ height: headerHeight }} />
          <div
            style={{
              padding: `0 ${horizontalPadding}px`,
              position: "relative"
            }}
          >
            <Game
              key={gameId}
              mode="ZEN"
              horizontalTiles={tileCounts.horizontal}
              verticalTiles={tileCounts.vertical}
              hasWon={hasWon}
              height={gameHeight}
              width={gameWidth}
              isResizing={isResizing}
              onResetResizing={() => {
                setIsResizing(false);
              }}
              onWin={() => {
                setHasWon(true);
              }}
            />
            {hasWon && (
              <Overlay>
                <Title>Nice Work</Title>
                <Button
                  onClick={() => {
                    setHasWon(false);
                    setGameId(gameId + 1);
                  }}
                >
                  Play Again
                </Button>
              </Overlay>
            )}
          </div>
        </Fragment>
      )}
    </Container>
  );
};

export default App;
