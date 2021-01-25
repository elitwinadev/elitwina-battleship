import React, { createContext, useState, useEffect } from "react";
import { placeShips, initialGameBoard, initialShips } from "../logic/logic";
// update_board_hit = boardHitUpdate
// inspect_hit = inspectHit
// update_board_miss = missBoardUpdate
// initial_game_board = initialGameBoard
import io from 'socket.io-client';
import { nanoid } from "nanoid";

import sinkSound from '../sounds/sinkSound.wav';
import missSound from '../sounds/missSound.wav';
import hitSound from '../sounds/hitSound.wav';
import errorSound from '../sounds/errorSound.wav';
import clickSound from '../sounds/clickSound.wav';
import yourTurnSound from '../sounds/yourTurnSound.wav';
import notYourTurnSound from '../sounds/notYourTurnSound.wav';
import chatMessageSound from '../sounds/chatMessageSound.mp3';


const { REACT_APP_SERVER_URL } = process.env;
export const socket = io(REACT_APP_SERVER_URL);
const BsContext = createContext(socket);  
const { Provider } = BsContext;


export const HORIZONTAL = 'horizontal'
export const VERTICAL = 'vertical';
export const RUSSIAN = 'RUSSIAN';
export const FRENCH = 'FRENCH';
export const MISS = 'MISS';
export const HIT = 'HIT';
export const SEA = 'SEA';
export const SINK = 'SINK';
export const SHIP_PART = 'SHIP_PART';
export const AROUND_SHIP = 'AROUND_SHIP';
export const AROUND_SINK = 'AROUND_SINK';

var audio;
export const playSound = (event, playSounds) => {
  if (playSounds) {
    let SOUND;
    if (event === 'SINK') { SOUND = sinkSound }
    else if (event === 'MISS') { SOUND = missSound }
    else if (event === 'HIT') { SOUND = hitSound }
    else if (event === 'ERROR') { SOUND = errorSound }
    else if (event === 'YOURTURN') { SOUND = yourTurnSound }
    else if (event === 'NOTYOURTURN') { SOUND = notYourTurnSound }
    else if (event === 'CHATMESSAGE') { SOUND = chatMessageSound }
    else { SOUND = clickSound }
    audio = new Audio(SOUND);
    audio.play();
  }
}


const StateManager = ({ children }) => {

  const [playerRoom, setPlayerRoom] = useState(nanoid(4));
  const [bothPlayersConnected, setBothPlayersConnected] = useState(null);
  const [playerBoard, setPlayerBoard] = useState([]);
  const [otherPlayerBoard, setOtherPlayerBoard] = useState(initialGameBoard());
  const [playerShips, setPlayerShips] = useState(null);
  const [otherPlayerShips, setOtherPlayerShips] = useState();
  const [isFirstTurn, setIsFirstTurn] = useState(null);
  const [randomBoard, setRandomBoard] = useState(false);
  const [isPlayerReady, setIsPlayerReady] = useState(false);
  const [bothPlayersReady, setBothPlayersReady] = useState(false);
  const [noteStatus, setNoteStatus] = useState();
  const [gameStatus, setGameStatus] = useState('Welcome');
  const [userPrecents, setUserPrecents] = useState(0);
  const [opponentPrecents, setOpponentPrecents] = useState(0);
  const [playerGuess, setPlayerGuess] = useState(null);
  const [otherPlayerGuess, setOtherPlayerGuess] = useState(null);
  const [playerMessage, setPlayerMessage] = useState([]);
  const [otherPlayerMessage, setOtherPlayerMessage] = useState([]);
  const [chatMessages, setChatMessages] = useState([]);
  const [playerId, setPlayerId] = useState(nanoid(5));
  const [lockOtherPlayerBoard, setLockOtherPlayerBoard] = useState(true);
  const [winning, setWinning] = useState(null);
  const [gameOverMsg, setGameOverMsg] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [otherPlayerReady, setOtherPlayerReady] = useState(false);
  const [showReadyBox, setShowReadyBox] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [showStartButton, setShowStartButton] = useState(true);
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [playAgain, setPlayAgain] = useState(false);
  const [usersCounter, setUsersCounter] = useState(1);
  const [isLeave, setIsLeave] = useState(false);
  const [playAgainMsg, setPlayAgainMsg] = useState(false);
  const [mouseX, setMouseX] = useState(0);
  const [mouseY, setMouseY] = useState(0);
  const [isMyTurn, setIsMyTurn] = useState(false);
  const [playSounds, setPlaySounds] = useState(true);


   useEffect(() => {
    let { board, ships } = placeShips(initialGameBoard(), initialShips());
    setPlayerShips(ships);
    setPlayerBoard(board);
  }, [randomBoard]);

  const state = {
    playerRoom,
    bothPlayersConnected,
    playerBoard,
    otherPlayerBoard,
    playerShips,
    otherPlayerShips,
    isFirstTurn,
    randomBoard,
    isPlayerReady,
    bothPlayersReady,
    noteStatus,
    gameStatus,
    userPrecents,
    opponentPrecents,
    playerGuess,
    otherPlayerGuess,
    playerMessage,
    otherPlayerMessage,
    chatMessages,
    playerId,
    lockOtherPlayerBoard,
    winning,
    gameOverMsg,
    showModal,
    otherPlayerReady,
    showReadyBox,
    isConnected,
    showStartButton,
    isGameStarted,
    playAgain,
    usersCounter,
    isLeave,
    mouseX,
    mouseY,
    isMyTurn,
    playSounds,
    playAgainMsg
  };


  const action = {
    setPlayerRoom,
    setBothPlayersConnected,
    setPlayerBoard,
    setOtherPlayerBoard,
    setPlayerShips,
    setOtherPlayerShips,
    setIsFirstTurn,
    setRandomBoard,
    setIsPlayerReady,
    setBothPlayersReady,
    setNoteStatus,
    setGameStatus,
    setUserPrecents,
    setOpponentPrecents,
    setPlayerGuess,
    setOtherPlayerGuess,
    setPlayerMessage,
    setOtherPlayerMessage,
    setChatMessages,
    setPlayerId,
    setLockOtherPlayerBoard,
    setWinning,
    setGameOverMsg,
    setShowModal,
    setOtherPlayerReady,
    setShowReadyBox,
    setIsConnected,
    setShowStartButton,
    setIsGameStarted,
    setPlayAgain,
    setUsersCounter,
    setIsLeave,
    setMouseX,
    setMouseY,
    setIsMyTurn,
    setPlaySounds,
    setPlayAgainMsg
  };

  const ws_connection = {
    socket
  };

  return <Provider value={{ ...state, ...action, ...ws_connection }}>{children}</Provider>;
};


export { BsContext, StateManager };

























