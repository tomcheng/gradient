import React from "react";
import styled from "styled-components";

const MODE_LABELS = {
  PUZZLE: "Puzzle Mode",
  ZEN: "Zen Mode"
};

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 15px;
  color: #ccc;
`;

const Chevron = styled.span`
  &:before {
    border-style: solid;
    border-width: 1px 1px 0 0;
    border-color: #888;
    content: "";
    display: inline-block;
    height: 6px;
    width: 6px;
    vertical-align: top;
    margin-top: 3px;
    margin-left: 5px;
    transform: rotate(135deg);
  }
`;

const Header = ({ height, mode, onNewGame }) => (
  <Container style={{ height }}>
    <div>
      {MODE_LABELS[mode]} <Chevron />
    </div>
    <div onClick={onNewGame}>New Game</div>
  </Container>
);

export default Header;
