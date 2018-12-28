import React, { useState } from "react";
import styled from "styled-components";
import Game from "./Game";
import random from "lodash/random";

const HEADER_HEIGHT = 40;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  overflow: hidden;
  background-color: #111;
  color: #fff;
`;

const Header = styled.div`
  flex-shrink: 0;
  height: ${HEADER_HEIGHT}px;
`;

const GameContainer = styled.div`
  flex-grow: 1;
  position: relative;
`;

const Footer = styled.div`
  flex-shrink: 0;
  height: ${HEADER_HEIGHT}px;
`;

const App = () => {
  const [tileCounts] = useState({
    horizontal: random(4, 8),
    vertical: random(6, 12)
  });

  return (
    <Container>
      <Header>header</Header>
      <GameContainer>
        <Game
          mode="ZEN"
          horizontalTiles={tileCounts.horizontal}
          verticalTiles={tileCounts.vertical}
        />
      </GameContainer>
      <Footer>footer</Footer>
    </Container>
  );
};

export default App;
