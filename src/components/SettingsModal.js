import React from "react";
import styled from "styled-components";
import { Transition, config } from "react-spring";
import { Z_INDICES } from "../constants";
import Title from "./Title";
import { OutlineButton } from "./Button";

const Overlay = styled.div`
  background-color: rgba(0, 0, 0, 0.6);
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: ${Z_INDICES.modal};
`;

const Modal = styled.div`
  padding: 20px 40px 30px;
  display: flex;
  flex-direction: column;
  align-items: center;
  border-radius: 2px;
  color: #222;
  background-color: #fff;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15), 0 1px 3px rgba(0, 0, 0, 0.12);
`;

const SettingsModal = ({ show, onClose, onNewGame }) => (
  <Transition
    items={show}
    from={{ opacity: 0 }}
    enter={{ opacity: 1 }}
    leave={{ opacity: 0 }}
    config={config.stiff}
  >
    {show =>
      show &&
      (style => (
        <Overlay style={style} onClick={onClose}>
          <Modal
            onClick={evt => {
              evt.stopPropagation();
            }}
          >
            <Title level={2}>Settings</Title>
            <div style={{ marginBottom: 10 }}>
              <OutlineButton onClick={() => {
                onNewGame({ mode: "ZEN" })
              }}>
                Start Zen Game
              </OutlineButton>
            </div>
            <div>
              <OutlineButton onClick={() => {
                onNewGame({ mode: "PUZZLE" })
              }}>
                Start Puzzle Game
              </OutlineButton>
            </div>
          </Modal>
        </Overlay>
      ))
    }
  </Transition>
);

export default SettingsModal;
