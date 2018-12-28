import React from "react";
import styled from "styled-components";
import Game from "./Game";

const HEADER_HEIGHT = 40;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100vw;
  background-color: #000;
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
  return (
    <Container>
      <Header>header</Header>
      <GameContainer>
        <Game mode="ZEN" />
      </GameContainer>
      <Footer>footer</Footer>
    </Container>
  );
};

export default App;
