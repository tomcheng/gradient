import React, { useState, Fragment } from "react";
import styled from "styled-components";
import { Z_INDICES } from "../constants";

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

const DropdownOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: ${Z_INDICES.dropdown};
`;

const DropdownMenu = styled.div`
  box-sizing: border-box;
  width: 140px;
  position: absolute;
  background-color: #fff;
  color: #333;
  z-index: ${Z_INDICES.dropdown};
  padding: 4px;
  margin-top: 10px;
  margin-left: -10px;
  border-radius: 2px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(0,0,0,0.1);
  background-clip: padding-box;
`;

const MenuItem = styled.div`
  padding: 10px 20px;
  background-color: ${props => (props.active ? "#d9f0fc" : "transparent")};
  border-radius: 2px;
`;

const Header = ({ height, mode, onNewGame }) => {
  const [modeDropdownOpen, setModeDropdownOpen] = useState(false);
  return (
    <Container style={{ height }}>
      <div>
        <div
          onClick={() => {
            setModeDropdownOpen(!modeDropdownOpen);
          }}
        >
          {MODE_LABELS[mode]} <Chevron />
        </div>
        {modeDropdownOpen && (
          <Fragment>
            <DropdownOverlay
              onClick={() => {
                setModeDropdownOpen(false);
              }}
            />
            <DropdownMenu>
              <MenuItem
                active={mode === "ZEN"}
                onClick={() => {
                  setModeDropdownOpen(false);
                  if (mode === "ZEN") return;
                  onNewGame({ mode: "ZEN" });
                }}
              >
                Zen Mode
              </MenuItem>
              <MenuItem
                active={mode === "PUZZLE"}
                onClick={() => {
                  setModeDropdownOpen(false);
                  if (mode === "PUZZLE") return;
                  onNewGame({ mode: "PUZZLE" });
                }}
              >
                Puzzle Mode
              </MenuItem>
            </DropdownMenu>
          </Fragment>
        )}
      </div>
      <div
        onClick={() => {
          onNewGame({ mode });
        }}
      >
        New Game
      </div>
    </Container>
  );
};

export default Header;
