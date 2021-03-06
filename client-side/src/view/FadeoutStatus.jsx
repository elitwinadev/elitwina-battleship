import React, { useContext } from "react";
import { BsContext } from "../stateManager/stateManager";
import styled, { keyframes } from "styled-components";
import { fadeOut } from "react-animations";
import { flex, position } from "../styles/Mixins";

const FadeoutStatus = () => {
  const {
    noteStatus,
    mouseX,
    mouseY,
    gameOverMsg
  } = useContext(BsContext);
  if (gameOverMsg) return "";
  return (
    <StatusBox mouseX={mouseX + 200} mouseY={mouseY + 150}>
      {" "}
      <Animated>{noteStatus}</Animated>
    </StatusBox>
  );
};

export default FadeoutStatus;

const fadeoutAnimation = keyframes`${fadeOut}`;
const StatusBox = styled.div`
  ${flex()};
  align-self: start;
  position: absolute;
  font-size: 2vw;
  z-index: 2000000;
  top: ${(props) => props.mouseY}px;
  left: ${(props) => props.mouseX}px;
  @media only screen and (max-width: 600px) {
    display: none;
  }
`;

const Animated = styled.h1`
  ${flex(false, false)};
  align-content: center;
  animation: 3s ${fadeoutAnimation};
  font-size: 2vw;
`;




