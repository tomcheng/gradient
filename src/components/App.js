import React, { Fragment, useLayoutEffect, useRef, useState } from "react";
import styled from "styled-components";
import random from "lodash/random";
import Ellipsis from "./Ellipsis";
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

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
`;

const MenuTrigger = styled.div`
  display: flex;
  padding: 5px 20px;
  color: #888;
`;

const GameContainer = styled.div`
  position: relative;
`;

const App = () => {
  const containerRef = useRef(null);
  const [gameId, setGameId] = useState(1);
  const [mode, setMode] = useState("ZEN");
  const [isResizing, setIsResizing] = useState(false);
  const [containerDimensions, setContainerDimensions] = useState(null);
  const [hasWon, setHasWon] = useState(false);
  const [showModal, setShowModal] = useState(false);
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
          <Header style={{ height: headerHeight }}>
            <MenuTrigger
              onClick={() => {
                setShowModal(true);
              }}
            >
              <Ellipsis />
            </MenuTrigger>
          </Header>
          <GameContainer style={{ padding: `0 ${horizontalPadding}px` }}>
            <Game
              key={gameId}
              mode={mode}
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
              <WinOverlay
                onNewGame={() => {
                  setHasWon(false);
                  setGameId(gameId + 1);
                }}
              />
            )}
          </GameContainer>
        </Fragment>
      )}
      <SettingsModal
        show={showModal}
        onClose={() => {
          setShowModal(false);
        }}
        onNewZenGame={() => {
          setMode("ZEN");
          setHasWon(false);
          setGameId(gameId + 1);
          setShowModal(false);
        }}
        onNewPuzzleGame={() => {
          setMode("PUZZLE");
          setHasWon(false);
          setGameId(gameId + 1);
          setShowModal(false);
        }}
      />
    </Container>
  );
};

export default App;
