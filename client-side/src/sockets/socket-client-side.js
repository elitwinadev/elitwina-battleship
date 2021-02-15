import { useContext, useEffect } from "react";
import { BsContext } from "../stateManager/stateManager";
const Sockets = () => {
  const {
    socket,
    playerRoom,
    setBothPlayersConnected,
    playerBoard,
    setOtherPlayerBoard,
    playerShips,
    setOtherPlayerShips,
    isFirstTurn,
    setIsFirstTurn,
    isPlayerReady,
    playerGuess,
    setOtherPlayerGuess,
    winning,
    setWinning,
    setShowModal,
    setOtherPlayerReady,
    setUsersCounter,
    playAgain,
    setPlayAgain,
    setIsLeave,
    setPlayAgainMsg,
    lastMessage,
    setChatText,
    chatText,
    isChatShow,
    setChatAlert,
    playSounds,
    token,
    detailsChecker,
    setDetailsChecker,
    setScores,
    setUsername,
    username,
    isTyping,
    setIsTyping,
    setIsOppTyping,
    lastEmoji,
    setIncomingReaction,
  } = useContext(BsContext);

  const randomize = (min, max) => Math.round(min + Math.random() * (max - min));

  const PLAY = "PLAY";
  const READY = "READY";
  // ----------------------------------------emiting---------------------------------------

  // joining a room (clicking "start" button)
  useEffect(() => {
    socket.emit("data", { room: playerRoom, action: PLAY, username: username });
  }, [playerRoom]);
  // ready to play (clicking "ready" button)
  useEffect(() => {
    if (isFirstTurn !== null) {
      socket.emit("data", {
        room: playerRoom,
        action: READY,
        board: playerBoard,
        ships: playerShips,
        turn: !isFirstTurn,
        toPlayer: "1",
      });
    } else {
      let localTurn;
      const turnGenerator = randomize(0, 1);
      turnGenerator === 0 ? (localTurn = true) : (localTurn = false);
      socket.emit("data", {
        room: playerRoom,
        action: READY,
        board: playerBoard,
        ships: playerShips,
        turn: !localTurn,
        toPlayer: "2",
      });
      if (playerRoom) {
        setIsFirstTurn(localTurn);
      }
    }
  }, [isPlayerReady]);

  // guessing (clicking on the opponents board)
  useEffect(() => {
    socket.emit("data", { room: playerRoom, guess: playerGuess });
  }, [playerGuess]);

  // winning
  useEffect(() => {
    if (winning === true) {
      socket.emit("data", {
        room: playerRoom,
        isWinning: true,
        token: !token ? "none" : token,
      });
    }
  }, [winning]);
  // ask for scores status
  useEffect(() => {
    if (detailsChecker === true) {
      setDetailsChecker(false);
      socket.emit("data", {
        action: "DETAILS_CHECKER",
        token: !token ? "none" : token,
      });
    }
  }, [detailsChecker]);

  // ---------------------------------------listening---------------------------------------

  useEffect(() => {
    socket.on("data", (data = {}) => {
      const {
        otherPlayerConnected,
        turn,
        board,
        ships,
        readyToStart,
        toPlayer,
        guess,
        isWinning,
        isLeave,
        usersCount,
        playAgainRequest,
        incomingMessages,
        scores,
        username,
      } = data;
      if (data.action === "EMOJI") {
        setIncomingReaction(data.value);
      }
      if (data.action === "OPP_TYPING") {
        setIsOppTyping(data.bol);
      }
      if (scores >= 0 || username) {
        setScores(data.scores);
        setUsername(data.username);
        localStorage.setItem("username", data.username);
        localStorage.setItem("scores", data.scores);
      }
      if (data === "REFRESH") {
        location.href = window.location.origin;
      }
      if (incomingMessages) {
        let msgObject = {
          value: incomingMessages,
          user: "user",
        };
        if (!isChatShow) {
          setChatAlert(true);
        }
        setChatText((chatText) => [...chatText, msgObject]);
      }
      if (usersCount) setUsersCounter(usersCount);
      if (playAgainRequest) setPlayAgainMsg(true);
      if (otherPlayerConnected) {
        setBothPlayersConnected(true);
      } else if (toPlayer === "2") {
        setOtherPlayerBoard(board);
        setOtherPlayerShips(ships);
        setIsFirstTurn(turn);
      } else if (toPlayer === "1") {
        setOtherPlayerReady(true);
        setOtherPlayerBoard(board);
        setOtherPlayerShips(ships);
        setIsFirstTurn(turn);
      } else if (guess) {
        setOtherPlayerGuess(guess);
      } else if (isWinning) {
        setWinning(!isWinning);
      } else if (isLeave) {
        setIsLeave(true);
        setShowModal(true);
      }
    });
  }, []);
  //--------------- Play again ------------------------
  useEffect(() => {
    if (playAgain) {
      socket.emit("data", { playAgainEmit: true, room: playerRoom });
      setPlayAgain(false);
    }
  }, [playAgain]);
  useEffect(() => {
    if (lastMessage) {
      socket.emit("data", {
        room: playerRoom,
        action: "CHATMESSAGE",
        chatMessages: lastMessage.value,
      });
    }
  }, [lastMessage]);
  useEffect(() => {
    if (lastEmoji.value) {
      socket.emit("data", {
        room: playerRoom,
        action: "EMOJI",
        value: lastEmoji.value,
      });
    }
  }, [lastEmoji]);
  // ---------------------------------------------------------
  useEffect(() => {
    if (isTyping) {
      socket.emit("data", { room: playerRoom, action: "TYPING", bol: true });
    } else {
      socket.emit("data", { room: playerRoom, action: "TYPING", bol: false });
    }
  }, [isTyping]);
  return "";
};

export default Sockets;
