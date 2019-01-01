import React from "react";
import styled from "styled-components";
import Title from "./Title";
import Button from "./Button";
import { Z_INDICES } from "../constants";

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
  z-index: ${Z_INDICES.winOverlay};
`;

const WinOverlay = ({ onNewGame }) => (
  <Overlay>
    <Title>Nice Work</Title>
    <Button onClick={onNewGame}>Play Again</Button>
  </Overlay>
);

export default WinOverlay;
