import React, { createContext, useState, useEffect } from "react";
import { placeShips, initialGameBoard, initialShips } from "../logic/logic";
import io from "socket.io-client";
import { nanoid } from "nanoid";

// import sinkSound from "../assests/sounds/maor/sink.mp3";
// import missSound from "../assests/sounds/maor/miss.mp3";
// import hitSound from "../assests/sounds/maor/hit.mp3";
// import youWonSound from "../assests/sounds/maor/win.mp3";
import sinkSound from "../assests/sounds/sinkSound.mp3";
import missSound from "../assests/sounds/missSound.wav";
import youWonSound from "../assests/sounds/youWonSound.wav";
import hitSound from "../assests/sounds/hitSound.wav";
import errorSound from "../assests/sounds/errorSound.wav";
import clickSound from "../assests/sounds/clickSound.wav";
import yourTurnSound from "../assests/sounds/yourTurnSound.wav";
import notYourTurnSound from "../assests/sounds/notYourTurnSound.wav";
import youLoseSound from "../assests/sounds/youLoseSound.wav";
import chatMessageSound from "../assests/sounds/chatMessageSound.wav";

const { REACT_APP_SERVER_URL } = process.env;
export const socket = io(REACT_APP_SERVER_URL);
const BsContext = createContext(socket);
const { Provider } = BsContext;

export const HORIZONTAL = "horizontal";
export const VERTICAL = "vertical";
export const RUSSIAN = "RUSSIAN";
export const FRENCH = "FRENCH";
export const MISS = "MISS";
export const HIT = "HIT";
export const SEA = "SEA";
export const SINK = "SINK";
export const SHIP_PART = "SHIP_PART";
export const AROUND_SHIP = "AROUND_SHIP";
export const AROUND_SINK = "AROUND_SINK";

var audio;
export const playSound = (event, playSounds) => {
  if (playSounds) {
    let SOUND;
    switch (event) {
      case "SINK":
        SOUND = sinkSound;
        break;
      case "MISS":
        SOUND = missSound;
        break;
      case "HIT":
        SOUND = hitSound;
        break;
      case "ERROR":
        SOUND = errorSound;
        break;
      case "YOURTURN":
        SOUND = yourTurnSound;
        break;
      case "NOTYOURTURN":
        SOUND = notYourTurnSound;
        break;
      case "YOUWON":
        SOUND = youWonSound;
        break;
      case "YOULOSE":
        SOUND = youLoseSound;
        break;
      case "CHATMESSAGE":
        SOUND = chatMessageSound;
        break;
      default:
        SOUND = clickSound;
    }
    audio = new Audio(SOUND);
    audio.play();
  }
};

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
  const [noteStatus, setNoteStatus] = useState(null);
  const [gameStatus, setGameStatus] = useState(
    "Please copy the room ID and send it to your friend, Then press start."
  );
  const [userPrecents, setUserPrecents] = useState(0);
  const [opponentPrecents, setOpponentPrecents] = useState(0);
  const [playerGuess, setPlayerGuess] = useState(null);
  const [otherPlayerGuess, setOtherPlayerGuess] = useState(null);
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
  const [chatText, setChatText] = useState([]);
  const [lastMessage, setLastMessage] = useState(null);
  const [isChatShow, setIsChatShow] = useState(false);
  const [chatAlert, setChatAlert] = useState(false);
  const [beforeBoardSet, setBeforeBoardSet] = useState(false);
  const [userId, setUserId] = useState();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userDetails, setUserDetails] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoginShow, setIsLoginShow] = useState(false);
  const [detailsChecker, setDetailsChecker] = useState(false);
  const [scores, setScores] = useState(localStorage.getItem("scores"));
  const [username, setUsername] = useState(localStorage.getItem("username"));
  const [isRegisterShow, setIsRegisterShow] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [isOppTyping, setIsOppTyping] = useState(false);
  const [lastEmoji, setLastEmoji] = useState({});
  const [reactions, setReactions] = useState([]);
  const [incomingReaction, setIncomingReaction] = useState();
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
    chatText,
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
    playAgainMsg,
    lastMessage,
    isChatShow,
    chatAlert,
    beforeBoardSet,
    userId,
    isAuthenticated,
    userDetails,
    token,
    isLoginShow,
    detailsChecker,
    scores,
    username,
    isRegisterShow,
    isTyping,
    isOppTyping,
    lastEmoji,
    reactions,
    incomingReaction,
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
    setChatText,
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
    setPlayAgainMsg,
    setLastMessage,
    setIsChatShow,
    setChatAlert,
    setBeforeBoardSet,
    setUserId,
    setIsAuthenticated,
    setUserDetails,
    setToken,
    setIsLoginShow,
    setDetailsChecker,
    setScores,
    setUsername,
    setIsRegisterShow,
    setIsTyping,
    setIsOppTyping,
    setLastEmoji,
    setReactions,
    setIncomingReaction,
  };

  const ws_connection = {
    socket,
  };

  return (
    <Provider value={{ ...state, ...action, ...ws_connection }}>
      {children}
    </Provider>
  );
};

export { BsContext, StateManager };
