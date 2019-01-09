import React, { Fragment, useLayoutEffect, useRef, useState } from "react";
import styled from "styled-components";
import random from "lodash/random";
import Header from "./Header";
import Game from "./Game";
import WinOverlay from "./WinOverlay";
import { COLORS } from "../constants";

const HEADER_HEIGHT = 40;
const MINIMUM_HORIZONTAL_PADDING = 4;
const MINIMUM_BOTTOM_PADDING = 16;

const Container = styled.div`
  height: 100%;
  overflow: hidden;
  background-color: ${COLORS.appBackground};
  color: #fff;
  touch-action: none;
`;

const GameContainer = styled.div`
  position: relative;
`;

const Version = styled.div`
  font-size: 8px;
  line-height: 12px;
  text-align: center;
  color: #888;
`;

const LOCAL_STORAGE_MODE_KEY = "__zen-hues-mode__";

const useMode = () => {
  const [mode, setMode] = useState(
    localStorage.getItem(LOCAL_STORAGE_MODE_KEY) || "ZEN"
  );
  const setAndSaveMode = modeToSave => {
    setMode(modeToSave);
    localStorage.setItem(LOCAL_STORAGE_MODE_KEY, modeToSave);
  };
  return [mode, setAndSaveMode];
};

const App = () => {
  const containerRef = useRef(null);
  const [containerDimensions, setContainerDimensions] = useState(null);
  const [tileCounts, setTileCounts] = useState({
    horizontal: random(4, 7),
    vertical: random(7, 10)
  });
  const [gameId, setGameId] = useState(1);
  const [mode, setMode] = useMode();
  const [hasWon, setHasWon] = useState(false);
  const [showMistakes, setShowMistakes] = useState(false);
  const [isResizing, setIsResizing] = useState(false);

  const gameHeight =
    containerDimensions &&
    Math.floor(
      (containerDimensions.height - HEADER_HEIGHT - MINIMUM_BOTTOM_PADDING) /
        tileCounts.vertical
    ) * tileCounts.vertical;
  const gameWidth =
    containerDimensions &&
    Math.floor(
      (containerDimensions.width - 2 * MINIMUM_HORIZONTAL_PADDING) /
        tileCounts.horizontal
    ) * tileCounts.horizontal;
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

  const handleNewGame = ({ mode }) => {
    setMode(mode);
    setTileCounts({
      horizontal: random(4, 8),
      vertical: random(6, 10)
    });
    setHasWon(false);
    setGameId(gameId + 1);
    setShowMistakes(false);
  };

  return (
    <Container
      ref={containerRef}
      onTouchStart={evt => {
        evt.preventDefault();
      }}
    >
      {containerDimensions && (
        <Fragment>
          <Header
            hasWon={hasWon}
            height={HEADER_HEIGHT}
            mode={mode}
            showMistakes={showMistakes}
            onNewGame={handleNewGame}
            onToggleShowMistakes={() => {
              setShowMistakes(!showMistakes);
            }}
          />
          <GameContainer style={{ padding: `2px ${horizontalPadding}px` }}>
            <Game
              key={gameId}
              mode={mode}
              isResizing={isResizing}
              hasWon={hasWon}
              showMistakes={showMistakes}
              horizontalTiles={tileCounts.horizontal}
              verticalTiles={tileCounts.vertical}
              height={gameHeight}
              width={gameWidth}
              onResetResizing={() => {
                setIsResizing(false);
              }}
              onWin={() => {
                setHasWon(true);
              }}
            />
            {hasWon && (
              <WinOverlay
                onNewGame={() => {
                  handleNewGame({ mode });
                }}
              />
            )}
          </GameContainer>
          <Version>v 1.2.4</Version>
        </Fragment>
      )}
    </Container>
  );
};

export default App;
