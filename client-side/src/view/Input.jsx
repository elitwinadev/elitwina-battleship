import React, { useContext, useEffect, useState } from "react";
import styled, { keyframes } from "styled-components";
import { BsContext, playSound } from "../stateManager/stateManager";
import { MdContentCopy } from 'react-icons/md';
import { flex, position, cool_shining_green } from "../styles/Mixins";
import { flash, __esModule } from 'react-animations';
import { Button } from "../styles/GlobalStyles";
import { nanoid } from "nanoid";
import FadeoutStatus from "./FadeoutStatus";
import { useHistory } from "react-router-dom";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import Loader from 'react-loader-spinner';
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import {

  FacebookShareButton,
  FacebookMessengerShareButton,
  WhatsappShareButton,
} from "react-share";
import {

  FacebookIcon,
  FacebookMessengerIcon,
  WhatsappIcon,
} from "react-share";

const flashAnimation = keyframes`${flash}`;
const startGame = (props) => {
  const { setIsConnected, setPlayerRoom, setShowReadyBox, setShowStartButton } = useContext(BsContext);
  let gameId = props.match.params.id;
  setShowReadyBox(true);
  setIsConnected(true);
  setPlayerRoom(gameId);
  setShowStartButton(false);

  return <h1></h1>
}
const Input = () => {

  const {
    playerRoom,
    setShowStartButton,
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
    playAgainMsg
  } = useContext(BsContext);
  const history = useHistory();
  // local states:
  const [roomId, setRoomId] = useState(null);

  //
  const [waiting, setWaiting] = useState(false);



  useEffect(() => {
    setRoomId(nanoid(4));
  }, []);

  // copy the room ID so the player wont need to do in manually
  const copyId = () => {
    playSound('click', playSounds);
    setMouseX(event.screenX);
    setMouseY(event.screenY);
    navigator.clipboard.writeText(`${window.location.origin}/${roomId}`).then(function () {
      setNoteStatus("Id copied to clipboard!");
    });
    event.preventDefault();
  }

  // nullify the note after every use
  useEffect(() => {
    setTimeout(() => {
      setNoteStatus('');
    }, 2000);
  }, [noteStatus]);

  // connect the player to the room
  const startClick = () => {
    playSound('click', playSounds);
    history.push(roomId);
  }

  // ready to play
  const readyButton = () => {
    playSound('click', playSounds);
    setIsPlayerReady(true);
    setShowReadyBox(false);
  };

  // set the board randomly
  const randomBoardClick = () => {
    playSound('click', playSounds);
    setRandomBoard(!randomBoard);
  }

  // set the game status message
  useEffect(() => {
    if (otherPlayerShips && !isPlayerReady) {
      setGameStatus('Your opponent is ready!');
      setWaiting(false);
      return false;
    }
    if (setShowStartButton) { setGameStatus("Please copy the room ID and send it to your friend, Then press start.") }
    if (isPlayerReady && !otherPlayerShips) {
      setGameStatus("Waiting for your opponent to be ready...");
      setShowReadyBox(false);
      setWaiting(true);
      return false;
    }
    if (showReadyBox && !bothPlayersConnected) {
      setGameStatus("You are connected! Waiting for another player to connect...");
      setWaiting(true);
    }
    if (isPlayerReady && otherPlayerShips) {
      setWaiting(false);
      setGameStatus("You are good to go! Good luck!");
      setShowReadyBox(false);
      setTimeout(() => {
        setIsGameStarted(true);
        setBothPlayersReady(true);
      }
        , 2000);
      return false;
    }
    if (!lockOtherPlayerBoard && isGameStarted) { setGameStatus("Its your turn") }
    else if (lockOtherPlayerBoard && isGameStarted) { setGameStatus('') }
    else if (showReadyBox && bothPlayersConnected) { setGameStatus("You are both connected! Please set your board. then press ready.") }
  }, [setShowStartButton, showReadyBox, bothPlayersConnected, isPlayerReady, otherPlayerShips, bothPlayersReady, lockOtherPlayerBoard]);

  // set the game over message according to the player status (winning / losing)
  useEffect(() => {
    if (winning != null) {
      setGameOverMsg( winning ? 'YOU WON!!!'  : 'you lose');
    }
    // if (winning === true) { setGameOverMsg("YOU WON!!!") }
    // else if (winning === false) { setGameOverMsg("you lose") }
  }, [winning]);


  // render the suitable buttons and inputs according to the player choices
  const renderDecideder = () => {

    if (showStartButton) {
      return (
        <>
          <UrlHolder><CopyButton onClick={() => copyId()}> {<MdContentCopy />} </CopyButton>{window.location.origin}/{roomId}</UrlHolder>
          <ButtonsWrapper>
            <Button style={{ width: "4.5vw", height: "4.5vw" }}><FacebookShareButton url={`${window.location.origin}/${roomId}`}><FacebookIcon size={"5vw"} round={true} style={{ marginTop: "0.7vw" }} /></FacebookShareButton></Button>
            &nbsp; &nbsp;
            <Button style={{ width: "4.5vw", height: "4.5vw" }}><FacebookMessengerShareButton url={`${window.location.origin}/${roomId}`}><FacebookMessengerIcon size={"5vw"} round={true} style={{ marginTop: "0.7vw" }} /></FacebookMessengerShareButton></Button>
            &nbsp; &nbsp;
            <Button style={{ width: "4.5vw", height: "4.5vw" }}><WhatsappShareButton url={`${window.location.origin}/${roomId}`}><WhatsappIcon size={"5vw"} round={true} style={{ marginTop: "0.7vw" }} /></WhatsappShareButton></Button>
          </ButtonsWrapper>
          <Button onClick={() => startClick()}>Start</Button>
        </>
      )
    }
    else if (showReadyBox && bothPlayersConnected) {
      return (
        <>
          <Button onClick={() => readyButton()}><Flash>Ready</Flash></Button>
          <Button onClick={randomBoardClick}>Random</Button>
        </>
      )
    }
  }
  const newGame = () => {
    playSound('click', playSounds);
    location.href = location.origin;
  }
  const playAgainFunc = () => {
    if (!isLeave) {
      playSound('click', playSounds);
      setPlayAgain(true);
      location.reload();
    }
    else {
      playSound('ERROR', playSounds);
    }
  }
  return (
    <>
      <FadeoutStatus />
      <InputWrapper connected={playerRoom} bothPlayersConnected={bothPlayersConnected} gameOverMsg={gameOverMsg} isGameStarted={isGameStarted} showReadyBox={showReadyBox}>
        {!gameOverMsg ?
          <MiniWrapper bothPlayersConnected={bothPlayersConnected}>
            <StaticStatus>{gameStatus}
              {waiting ? <Loader type="Grid" color="white" height={'5vw'} width={'5vw'} style={{ margin: "1vw" }} /> : ' '}
            </StaticStatus>
            {renderDecideder()}
          </MiniWrapper>
          : <GameOver>{gameOverMsg}<Button onClick={newGame}>New Game!</Button><PlayAgainButton error={isLeave} onClick={() => playAgainFunc()}>{playAgainMsg ? <Flash>Play Again!</Flash> : 'Play Again!'}</PlayAgainButton></GameOver>}
      </InputWrapper>
      <Switch>
        <Route path='/:id' component={startGame} />
      </Switch>
    </>
  );
}
export default Input;

const InputWrapper = styled.div`
  ${({ isGameStarted, gameOverMsg, isConnected }) => isGameStarted && !gameOverMsg ? 'display: none' : isConnected ? flex('center', false) : flex()};
  position: absolute;
  top: 12vw;
  right: 3vw;
  z-index: 100;
  height: 60vw;
  width: 125vw;
  justify-content: center;
  background: rgba(0,0,0,0.8);
  ${({ showReadyBox, bothPlayersConnected }) => showReadyBox && bothPlayersConnected ? 'background: black; right: 0vw; width: 50%;' : ' '}
  @media only screen and (max-width: 600px)
  {
    width: 100%;
    background: rgba(0,0,0,0.8);
    opacity: 1;
    height: 90%;
    margin-top: 6vw;
    left: 0;
    ${({ bothPlayersConnected }) => bothPlayersConnected ? `width: 80vw; top: 7vw; margin-left: -19vw;` : ' '};
  }
  `;

const MiniWrapper = styled.form`
  display: flex;
  flex-direction: column;
  ${cool_shining_green};
  border: 3px solid #00ff3c;
  -webkit-box-shadow: 2px 3px 16px 5px rgba(0,255,65,0.75); 
  box-shadow: 2px 3px 16px 5px rgba(0,255,65,0.75);
  border-radius: 2vw;
  -webkit-user-select: none;
  -ms-user-select: none;
  user-select: none;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
  background: black;
  align-content: center;
  padding: 2%;
  @media only screen and (max-width: 600px)
  {
width: 50vw;
height: 50vw;
margin-left: 4vw;
${({ bothPlayersConnected }) => bothPlayersConnected ? `position: absolute; left: 4vw; top: 8vw;` : ' '};
  }
`;


const CopyButton = styled.button`
  font-size: 100%;
  ${position('relative', false, false, false, '85%')};

    &:hover {
      ${cool_shining_green};
      background: #1aff1a;
      color: black;
    }
`;

const UrlHolder = styled.div`
  padding: 1vw;
  margin: 1vw;
  height: 4vw;
  width: 25vw;
  outline: none; 
  border-radius: 4rem;
  border: white 1px solid;
  transition: border 0.5s;
  font-size: 1.5vw;
  z-index: 1;
  align-items: center;
  display: flex;
  @media only screen and (max-width: 600px)
  {

  }
`;
const Flash = styled.h1`
animation: 1s ${flashAnimation};
animation-iteration-count: infinite;
font-size: 2.5vw;
`;

const StaticStatus = styled.h1`
font-size: 100%;
text-align: center;
color: white;
-webkit-user-select: none;
-ms-user-select: none;
user-select: none;
font-size: 3vw;
width: 40vw;
display: flex;
flex-direction: column;
@media only screen and (max-width: 600px) {
    }
`;

const GameOver = styled.div`
width: 125vw;
height: 55vw;
position: absolute;
top: 0;
right: 0;
display: flex;
justify-content: center;
align-items: center;
font-weight: bold;
background: rgba(0,0,0,0.8);
-webkit-user-select: none;
-ms-user-select: none;
user-select: none;
font-size: 20vw;
flex-direction: column;
margin: 0;
@media only screen and (max-width: 600px) {
  {
    font-size: 10vw;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 68vw;
    left: 18vw;
    height: 120%;
    top: -15vw;
    background: black;
  }
`;

const ButtonsWrapper = styled.div`
width: 100%;
display: flex;
flex-direction: row;
justify-content: center;
`
const PlayAgainButton = styled(Button)`
margin-top: -0.5vw;
background: ${props => props.error ? 'grey' : ' '};
cursor: ${props => props.error ? 'not-allowed' : 'pointer'};
border: ${props => props.error ? 'none' : ' '};
&:hover {
  color: ${props => props.error ? 'white' : 'black'};
  background: ${props => props.error ? 'grey' : ' '};
  border: ${props => props.error ? 'none' : ' '};
  box-shadow: ${props => props.error ? 'inset 0 0.1rem 1.5rem lightgrey' : ' '};
}
@media only screen and (max-width: 600px)
{
height: 5.5vw;
width: 20vw;
}
`