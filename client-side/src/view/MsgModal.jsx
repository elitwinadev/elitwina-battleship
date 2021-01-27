import React, { useContext, useRef } from "react";
import { BsContext } from "../stateManager/stateManager";
import { Button } from "../styles/GlobalStyles";
import styled from "styled-components";
import { flex, position } from "../styles/Mixins";

const Modal = () => {
  const { setShowModal } = useContext(BsContext);

  // hide the modal and reload the page
  const okButton = () => {
    setShowModal(false);
    location.href = window.location.origin;
  };
  const okRef = useRef(null);
  setTimeout(() => {
    okRef.current.focus();
  }, 500);
  return (
    <ModalWrapper>
      <Dialog>
        <span style={{ fontSize: "3.5vw" }}>
          Your opponent left the game.
        </span>
        <br />
        <Button ref={okRef} onClick={() => okButton()}>
          OK
        </Button>
      </Dialog>
    </ModalWrapper>
  );
};

export default Modal;

const ModalWrapper = styled.div`
  ${flex()};
  ${position("fixed", "0", false, "0", false)};
  height: 100%;
  width: 100%;
  background-color: rgba(0, 0, 0, 0.8);
  z-index: 1000;
  @media only screen and (max-width: 600px) {
    width: 100%;
    top: -20vw;
    right: 0vw;
    background: black;
    height: 120%;
  }
`;

const Dialog = styled.div`
  ${flex()};
  flex-direction: column;
  height: 30vw;
  width: 60vw;
  background: grey;
`;
