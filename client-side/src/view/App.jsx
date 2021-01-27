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
  // if (isSafari)
  //   return (
  //     <>
  //       <Box>
  //         <span>Ooops...</span>
  //         <br />
  //         <br/>
  //         Your browser not supported!
  //         We recommend using Google Chrome
  //       </Box>
  //     </>
  //   );
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
  -webkit-box-orient: vertical;
  -webkit-box-direction: normal;
      -ms-flex-direction: column;
          flex-direction: column;
  flex-direction: ${(props) => (!props.isMyTurn ? 
    `
    -webkit-box-orient: vertical;
    -webkit-box-direction: reverse;
        -ms-flex-direction: column-reverse;
            flex-direction: column-reverse;
    `
     : ' ')};
  padding-top: 10vw;
  @media only screen and (min-width: 600px) {
    flex-direction: row;
    padding-top: 0;
  }
`;
const AppWrapper = styled.div`
  position: relative;
  @media only screen and (max-width: 600px) {
    height: 100vw;
    width: 100%;
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

display: -webkit-box;
display: -ms-flexbox;
display: flex;
-webkit-box-pack: center;
    -ms-flex-pack: center;
        justify-content: center;
-webkit-box-align: center;
   -ms-flex-align: center;
       align-items: center;
height: 100vw;
width: 100vw;
-webkit-box-orient: vertical;
-webkit-box-direction: normal;
   -ms-flex-direction: column;
       flex-direction: column;

`;
