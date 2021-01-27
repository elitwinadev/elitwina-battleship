import React, { useContext } from "react";
import { BsContext } from "../stateManager/stateManager";
import Sockets from "../sockets/socket-client-side";
import TopBar from "./TopBar";
import Input from "./Input";
import UserGrid from "./UserGrid";
import OpponentGrid from "./OpponentGrid";
import { flex, position } from "../styles/Mixins";
import Confetti from "react-confetti";
import { BrowserRouter } from "react-router-dom";
import styled from "styled-components";
import Chat from "./Chat";
var isFirefox = typeof InstallTrigger !== 'undefined';
const App = () => {
  const {
    winning,
    lockOtherPlayerBoard,
    bothPlayersConnected,
    showReadyBox,
    isGameStarted,
    gameOverMsg,
  } = useContext(BsContext);
  var isSafari =
    /constructor/i.test(window.HTMLElement) ||
    (function (p) {
      return p.toString() === "[object SafariRemoteNotification]";
    })(
      !window["safari"] ||
        (typeof safari !== "undefined" && window["safari"].pushNotification)
    );
  if (isSafari)
    return (
      <>
        <Box>
          <span>Ooops...</span>
          <br />
          <br/>
          Your browser not supported!
          We recommend using Google Chrome
        </Box>
      </>
    );
  return (
    <AppWrapper
      isMyTurn={!lockOtherPlayerBoard}
      isGameStarted={isGameStarted}
      gameOverMsg={gameOverMsg}
    >
      <BrowserRouter>
        {winning ? (
          <Confetti width="2000vw" height="1000vw" style={{ zIndex: 1000 }} />
        ) : (
          " "
        )}
        <Sockets />
        <TopBar />
        <Input />
        <GameWrapper isMyTurn={!lockOtherPlayerBoard}>
          <UserGrid
            bothPlayersConnected={bothPlayersConnected}
            showReadyBox={showReadyBox}
          />
          <OpponentGrid />
          <Chat />
        </GameWrapper>
      </BrowserRouter>
    </AppWrapper>
  );
};
export default App;

const GameWrapper = styled.div`
  display: flex;
  flex-direction: column;
  flex-direction: ${(props) => (props.isMyTurn ? "column" : "column-reverse")};
  padding-top: 10vw;
  @media only screen and (min-width: 600px) {
    flex-direction: row;
    padding-top: 0;
  }
`;
const AppWrapper = styled.div`
  position: relative;
  @media only screen and (max-width: 600px) {
    margin: 1vw;
    ${(props) =>
      !props.isMyTurn && props.isGameStarted && !props.gameOverMsg
        ? "border: 2px solid red"
        : " "};
    ${(props) =>
      props.isMyTurn && props.isGameStarted && !props.gameOverMsg
        ? `border: 2px solid blue`
        : " "};
    padding-right: 0vw;
    padding-left: 0vw;
    padding: 0.5vw;
  }
`;
const Box = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vw;
  width: 100vw;
  flex-direction: column;
`;
