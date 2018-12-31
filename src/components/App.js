import React, { Fragment, useLayoutEffect, useRef, useState } from "react";
import styled from "styled-components";
import random from "lodash/random";
import Header from "./Header";
import Game from "./Game";
import WinOverlay from "./WinOverlay";
import SettingsModal from "./SettingsModal";

const MINIMUM_HEADER_HEIGHT = 36;
const MINIMUM_HORIZONTAL_PADDING = 4;

const Container = styled.div`
  height: 100%;
  overflow: hidden;
  background-color: #111;
  color: #fff;
`;

const GameContainer = styled.div`
  position: relative;
`;

const App = () => {
  const containerRef = useRef(null);
  const [containerDimensions, setContainerDimensions] = useState(null);
  const [tileCounts, setTileCounts] = useState({
    horizontal: random(4, 8),
    vertical: random(6, 10)
  });
  const [gameId, setGameId] = useState(1);
  const [mode, setMode] = useState("ZEN");
  const [hasWon, setHasWon] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showMistakes, setShowMistakes] = useState(false);
  const [isResizing, setIsResizing] = useState(false);

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

  const handleNewGame = ({ mode }) => {
    setMode(mode);
    setTileCounts({
      horizontal: random(4, 8),
      vertical: random(6, 10)
    });
    setHasWon(false);
    setGameId(gameId + 1);
    setShowModal(false);
  };

  return (
    <Container ref={containerRef}>
      {containerDimensions && (
        <Fragment>
          <Header
            height={headerHeight}
            mode={mode}
            onNewGame={handleNewGame}
          />
          <GameContainer style={{ padding: `0 ${horizontalPadding}px` }}>
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
        </Fragment>
      )}
      <SettingsModal
        show={showModal}
        mode={mode}
        onClose={() => {
          setShowModal(false);
        }}
        onNewGame={handleNewGame}
        onShowMistakes={() => {
          setShowMistakes(true);
          setShowModal(false);
          setTimeout(() => {
            setShowMistakes(false);
          }, 5000);
        }}
      />
    </Container>
  );
};

export default App;
