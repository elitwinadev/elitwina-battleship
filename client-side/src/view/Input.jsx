import React, { useContext, useEffect, useState } from "react";
import { BsContext, playSound } from "../stateManager/stateManager";
import { MdContentCopy } from "react-icons/md";
import { flash, bounceInLeft, __esModule } from "react-animations";
import { Button } from "../styles/GlobalStyles";
import { nanoid } from "nanoid";
import styled, { keyframes } from "styled-components";
import { position, cool_shining_green } from "../styles/Mixins";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useHistory,
} from "react-router-dom";
import Loader from "react-loader-spinner";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import {
  FacebookShareButton,
  FacebookMessengerShareButton,
  WhatsappShareButton,
} from "react-share";
import { FacebookIcon, FacebookMessengerIcon, WhatsappIcon } from "react-share";

const flashAnimation = keyframes`${flash}`;
const bounceInLeftAnimation = keyframes`${bounceInLeft}`;

const startGame = (props) => {
  const {
    setIsConnected,
    setPlayerRoom,
    setShowReadyBox,
    setShowStartButton,
  } = useContext(BsContext);

  useEffect(() => {
    let { gameId } = props.match.params;
    setShowReadyBox(true);
    setIsConnected(true);
    setPlayerRoom(gameId);
    setShowStartButton(false);
  }, []);

  return <h1></h1>;
};

const Scores = () => {
  const { scores, gameOverMsg } = useContext(BsContext);
  const [userScoresFlash, setUserScoresFlash] = useState(false);
  const [userScores, setUserScores] = useState(0);

  useEffect(() => {
    let i = 0;
    let myScores = scores;
    let scoresInterval = setInterval(() => {
      if (i < 100) {
        i++;
        setUserScores(myScores + i);
      } else {
        setUserScoresFlash(true);
        clearInterval(scoresInterval);
        return false;
      }
    }, 10);
  }, []);
  if (gameOverMsg !== "YOU WON!!!" || !localStorage.getItem("token")) {
    return <div></div>;
  }
  if (userScoresFlash) return <H1>{userScores}</H1>;
  return <H1NoFlash>{userScores}</H1NoFlash>;
};
const Input = () => {
  const {
    playerRoom,
    showStartButton,
    bothPlayersConnected,
    otherPlayerShips,
    isPlayerReady,
    setIsPlayerReady,
    bothPlayersReady,
    lockOtherPlayerBoard,
    setRandomBoard,
    randomBoard,
    gameStatus,
    setGameStatus,
    winning,
    noteStatus,
    setNoteStatus,
    gameOverMsg,
    showReadyBox,
    setShowReadyBox,
    setBothPlayersReady,
    isGameStarted,
    setIsGameStarted,
    setPlayAgain,
    isLeave,
    setMouseX,
    setMouseY,
    setGameOverMsg,
    playSounds,
    playAgainMsg,
    setBeforeBoardSet,
    setPlayAgainMsg,
  } = useContext(BsContext);
  const history = useHistory();
  const [roomId, setRoomId] = useState(null);

  //
  const [waiting, setWaiting] = useState(false);

  useEffect(() => {
    setRoomId(nanoid(4));
  }, []);

  // copy the room ID so the player wont need to do in manually
  const copyId = () => {
    playSound("click", playSounds);
    setMouseX(event.screenX);
    setMouseY(event.screenY);
    navigator.clipboard
      .writeText(`${window.location.origin}/${roomId}`)
      .then(function () {
        setNoteStatus("Id copied to clipboard!");
      });
    event.preventDefault();
  };

  // nullify the note after every use
  useEffect(() => {
    if (noteStatus) {
      setTimeout(() => {
        setNoteStatus("");
      }, 1000);
    }
  }, [noteStatus]);

  // connect the player to the room
  const startClick = () => {
    playSound("click", playSounds);
    history.push(roomId);
  };

  // ready to play
  const readyButton = () => {
    playSound("click", playSounds);
    setBeforeBoardSet(false);
    setIsPlayerReady(true);
  };

  // set the board randomly
  const randomBoardClick = () => {
    playSound("click", playSounds);
    setRandomBoard(!randomBoard);
  };

  // set the game status message
  useEffect(() => {
    if (
      !isGameStarted &&
      bothPlayersConnected &&
      !isPlayerReady &&
      !otherPlayerShips
    ) {
      setGameStatus(
        <span>
          You are both connected!
          <br />
          Please set your board, then press ready.
        </span>
      );
    } else if (showReadyBox && !bothPlayersConnected) {
      setGameStatus(
        <span>
          You are connected!
          <br />
          <br />
          Waiting for another player to connect...
        </span>
      );
      setWaiting(true);
    } else if (otherPlayerShips && !isPlayerReady) {
      setGameStatus("Your opponent is ready!");
      setWaiting(false);
    } else if (
      isPlayerReady &&
      otherPlayerShips &&
      !showReadyBox &&
      !isGameStarted
    ) {
      setWaiting(false);
      setBothPlayersReady(true);
      setShowReadyBox(false);
      setPlayAgain(false);
      setPlayAgainMsg(false);
      setGameStatus(
        <span>
          You are good to go!
          <br />
          Good luck!
        </span>
      );
      setTimeout(() => {
        setIsGameStarted(true);
      }, 2000);
    } else if (showReadyBox && isPlayerReady && !bothPlayersReady) {
      setWaiting(true);
      setGameStatus("Waiting for your opponent to be ready...");
      setShowReadyBox(false);
    } else if (!lockOtherPlayerBoard && isGameStarted) {
      setGameStatus("Its your turn");
    } else if (lockOtherPlayerBoard && isGameStarted) {
      setGameStatus("");
    }
  }, [
    showStartButton,
    showReadyBox,
    bothPlayersConnected,
    isPlayerReady,
    otherPlayerShips,
    bothPlayersReady,
    lockOtherPlayerBoard,
  ]);
  // set the game over message according to the player status (winning / losing)
  useEffect(() => {
    if (winning != null) {
      if (winning === true) {
        setGameOverMsg("YOU WON!!!");
        playSound("YOUWON", playSounds);
      } else {
        setGameOverMsg("you lose");
        playSound("YOULOSE", playSounds);
      }
    }
  }, [winning]);

  // render the suitable buttons and inputs according to the player choices
  const renderDecideder = () => {
    if (showStartButton) {
      return (
        <>
          <UrlHolder>
            <CopyButton onClick={() => copyId()}>
              <MdContentCopy />
            </CopyButton>
            {window.location.origin}/{roomId}
          </UrlHolder>
          <ButtonsWrapper>
            <Button style={{ width: "5vw", height: "5vw" }}>
              <FacebookShareButton url={`${window.location.origin}/${roomId}`}>
                <FacebookIcon
                  size={"5vw"}
                  round={true}
                  style={{ marginTop: "1vh" }}
                />
              </FacebookShareButton>
            </Button>
            <Button style={{ width: "5vw", height: "5vw" }}>
              <FacebookMessengerShareButton
                url={`${window.location.origin}/${roomId}`}
              >
                <FacebookMessengerIcon
                  size={"5vw"}
                  round={true}
                  style={{ marginTop: "1vh" }}
                />
              </FacebookMessengerShareButton>
            </Button>
            <Button style={{ width: "5vw", height: "5vw" }}>
              <WhatsappShareButton url={`${window.location.origin}/${roomId}`}>
                <WhatsappIcon
                  size={"5vw"}
                  round={true}
                  style={{ marginTop: "1vw" }}
                />
              </WhatsappShareButton>
            </Button>
          </ButtonsWrapper>
          <Button onClick={() => startClick()}>Start</Button>
        </>
      );
    } else if (showReadyBox && bothPlayersConnected) {
      return (
        <>
          <Button onClick={() => readyButton()}>
            <Flash>Ready</Flash>
          </Button>
          <Button onClick={randomBoardClick}>Random</Button>
        </>
      );
    }
  };
  const newGame = () => {
    playSound("click", playSounds);
    location.href = location.origin;
  };
  const playAgainFunc = () => {
    if (!isLeave) {
      playSound("click", playSounds);
      setPlayAgain(true);
      setPlayAgainMsg(false);
      location.reload();
    } else {
      playSound("ERROR", playSounds);
    }
  };
  return (
    <>
      {!isGameStarted && (
        <InputWrapper
          isPlayerReady={isPlayerReady}
          connected={playerRoom}
          bothPlayersConnected={bothPlayersConnected}
          gameOverMsg={gameOverMsg}
          isGameStarted={isGameStarted}
          showReadyBox={showReadyBox}
          bothPlayersReady={bothPlayersReady}
          otherPlayerShips={otherPlayerShips}
        >
          <MiniWrapper
            isGameStarted={isGameStarted}
            bothPlayersConnected={bothPlayersConnected}
            bothPlayersReady={bothPlayersReady}
          >
            <StaticStatus>
              {gameStatus}
              {waiting && (
                <Loader
                  type="Grid"
                  color="white"
                  height={"5vw"}
                  width={"5vw"}
                  style={{ margin: "1vw" }}
                />
              )}
            </StaticStatus>
            {renderDecideder()}
          </MiniWrapper>
        </InputWrapper>
      )}
      {gameOverMsg && (
        <GameOver>
          {gameOverMsg}
          <Scores />
          <Button onClick={newGame}>New Game!</Button>
          <PlayAgainButton error={isLeave} onClick={() => playAgainFunc()}>
            {playAgainMsg && !isLeave ? (
              <Flash>Play Again!</Flash>
            ) : (
              "Play Again!"
            )}
          </PlayAgainButton>
        </GameOver>
      )}
      <Switch>
        <Route path="/:gameId" component={startGame} />
      </Switch>
    </>
  );
};
export default Input;

const InputWrapper = styled.div`
  animation: 2s ${bounceInLeftAnimation};
  animation-iteration-count: 1;
  display: flex;
  justify-content: center;
  background: rgba(0, 0, 0, 0.8);
  margin: 5vw;
  @media only screen and (max-width: 600px) {
    background: rgba(0, 0, 0, 0.8);
  } ;
`;

const MiniWrapper = styled.form`
  height: 60vh;
  display: flex;
  flex-direction: column;
  ${cool_shining_green};
  border: 3px solid #00ff3c;
  -webkit-box-shadow: 2px 3px 16px 5px rgba(0, 255, 65, 0.75);
  box-shadow: 2px 3px 16px 5px rgba(0, 255, 65, 0.75);
  border-radius: 2vw;
  user-select: none;
  align-items: center;
  justify-content: center;
  z-index: 100;
  background: black;
  align-content: center;
  padding: 5%;
  @media only screen and (max-width: 600px) {
    width: 80vw;
  } ;
`;

const CopyButton = styled(Button)`
  ${cool_shining_green};
  font-size: 100%;
  width: 4vw;
  height: 4vw;
  margin: -2vw;
  ${position("relative", false, false, false, "98%")};
  &:hover {
    color: black;
  }
`;

const UrlHolder = styled.div`
  padding: 1vw;
  padding-left: -8vw;
  margin: 1vw;
  height: 4vw;
  width: 90%;
  outline: none;
  border-radius: 4rem;
  border: white 1px solid;
  transition: border 0.5s;
  font-size: 1.5vw;
  z-index: 1;
  align-items: center;
  display: flex;
  @media only screen and (max-width: 600px) {
    height: 4vh;
    font-size: 3vw;
  }
`;
const Flash = styled.h1`
  animation: 1s ${flashAnimation};
  animation-iteration-count: infinite;
  font-size: 2vw;
  @media only screen and (max-width: 600px) {
    font-size: 4vw;
  }
`;
const H1 = styled.h1`
  animation: 1s ${flashAnimation};
  animation-iteration-count: infinite;
  font-size: 4vw;
`;

const StaticStatus = styled.h1`
  font-size: 100%;
  text-align: center;
  color: white;
  -webkit-user-select: none;
  -ms-user-select: none;
  user-select: none;
  font-size: 3vw;
  font-weight: normal;
  width: 40vw;
  display: flex;
  flex-direction: column;
  @media only screen and (max-width: 600px) {
    font-size: 5vw;
    width: 100%;
  }
`;

const GameOver = styled.div`
  width: 100%;
  height: 100%;
  top: 0;
  right: 0;
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: bold;
  background: rgba(0, 0, 0, 0.8);
  user-select: none;
  font-size: 20vw;
  flex-direction: column;
  margin: 0;
  @media only screen and (max-width: 600px) {
    font-size: 10vw;
    display: flex;
    align-items: center;
    justify-content: center;
    top: 0vw;
    background: black;
  } ;
`;

const ButtonsWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: center;
`;
const PlayAgainButton = styled(Button)`
  margin-top: -0.5vw;
  background: ${({ error }) => error && `grey`};
  cursor: ${({ error }) => (error ? `not-allowed` : `pointer`)};
  border: ${({ error }) => error && `none`};
  &:hover {
    color: ${({ error }) => (error ? `white` : `black`)};
    background: ${({ error }) => error && `grey`};
    border: ${({ error }) => error && `none`};
    box-shadow: ${({ error }) => error && `inset 0 0.1rem 1.5rem lightgrey`};
  }
  @media only screen and (max-width: 600px) {
    height: 5.5vw;
    width: 20vw;
  } ;
`;
const H1NoFlash = styled.h1`
  font-size: 4vw;
`;
