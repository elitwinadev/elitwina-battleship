import React, { useContext, useState, useEffect } from "react";
import { BsContext } from "../stateManager/stateManager";
import Sockets from "../sockets/socket-client-side";
import TopBar from "./TopBar";
import Input from "./Input";
import UserGrid from "./UserGrid";
import OpponentGrid from "./OpponentGrid";
import Confetti from "react-confetti";
import { BrowserRouter } from "react-router-dom";
import styled from "styled-components";
import Chat from "./Chat";
import Auth from "./Auth";
import Reactions from "./Reactions";

const App = () => {
  const {
    winning,
    lockOtherPlayerBoard,
    isGameStarted,
    gameOverMsg,
  } = useContext(BsContext);

  // safari/firefox browser detecation------------------------------------------------
  // ---------------------------------------------------------------------------------
  var isSafari =
    /constructor/i.test(window.HTMLElement) ||
    (function (p) {
      return p.toString() === "[object SafariRemoteNotification]";
    })(
      !window["safari"] ||
        (typeof safari !== "undefined" && window["safari"].pushNotification)
    );
  const keyboardShowHandler = () => {
    alert("keyboard!!!!");
  };
  useEffect(() => {
    window.addEventListener("native.showkeyboard", keyboardShowHandler);
  }, []);
  var isFirefox = navigator.userAgent.toLowerCase().indexOf("firefox") > -1;
  // ----------------------------------------

  if (isSafari || isFirefox) {
    return (
      <>
        <span style={{ fontSize: "50px" }}>
          Ooops...
          <br />
          Your browser not supported!
          <br />
          We recommend using Google Chrome
        </span>
      </>
    );
  }
  // full app render ---------------------------------------------------
  return (
    <>
      <Auth />
      <AppWrapper
        isMyTurn={!lockOtherPlayerBoard}
        isGameStarted={isGameStarted}
        gameOverMsg={gameOverMsg}
      >
        <BrowserRouter>
          {winning && (
            <Confetti width="2000vw" height="1000vw" style={{ zIndex: 1000 }} />
          )}
          <Sockets />
          <TopBar />
          <GameWrapper isMyTurn={!lockOtherPlayerBoard}>
            <UserGrid />
            <OpponentGrid />
            <Input />
          </GameWrapper>
        </BrowserRouter>
        <Reactions />
        <Chat />
      </AppWrapper>
    </>
  );
};
export default App;

const GameWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  width: 100%;
  @media only screen and (max-width: 600px) {
    flex-direction: column-reverse;
  }
`;
const AppWrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100%;
  @media only screen and (max-width: 600px) {
    ${({ isMyTurn, isGameStarted, gameOverMsg }) =>
      !isMyTurn && isGameStarted && !gameOverMsg && `border: 3px solid red`};
    ${({ isMyTurn, isGameStarted, gameOverMsg }) =>
      isMyTurn && isGameStarted && !gameOverMsg && `border: 3px solid blue`};
    // margin-bottom: 2vw;
    margin-right: -2vw;
    height: 100vh;
  }
`;

const Box = styled.div`
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-pack: center;
  -ms-flex-pack: center;
  justify-content: center;
  align-items: center;
  height: 100vw;
  width: 100vw;
  -webkit-box-orient: vertical;
  -webkit-box-direction: normal;
  -ms-flex-direction: column;
  flex-direction: column;
`;
