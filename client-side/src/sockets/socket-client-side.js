import React, { useContext, useEffect } from "react";
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
    playerMessage,
    setOtherPlayerMessage,
    chatMessages,
    setChatMessages,
    winning,
    setWinning,
    setShowModal,
    setOtherPlayerReady,
    setUsersCounter,
    playAgain,
    setPlayAgain,
    setIsLeave,
    setPlayAgainMsg,
  } = useContext(BsContext);

  const randomize = (min, max) => Math.round(min + Math.random() * (max - min));

  const PLAY = "PLAY";
  const READY = "READY";
  // ----------------------------------------emiting---------------------------------------

  // joining a room (clicking "start" button)
  useEffect(() => {
      socket.emit("data", { room: playerRoom, action: PLAY });
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
      socket.emit("data", { room: playerRoom, isWinning: true });
    }
  }, [winning]);

  // ---------------------------------------listening---------------------------------------

  useEffect(() => {
    socket.on("data", (data = {}) => {
      console.log("@@@", data)
      const {
        otherPlayerConnected,
        turn,
        board,
        ships,
        readyToStart,
        toPlayer,
        guess,
        message,
        isWinning,
        isLeave,
        usersCount,
        playAgainRequest,
      } = data;
      if (data === "REFRESH") {
        location.href = window.location.origin;
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
      } else if (message) {
        setOtherPlayerMessage((prev) => [...prev, message.msg]);
        setChatMessages((prev) => [
          ...prev,
          {
            id: message.id,
            msg: message.msg,
          },
        ]);
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
  return <div></div>;
};

export default Sockets;
