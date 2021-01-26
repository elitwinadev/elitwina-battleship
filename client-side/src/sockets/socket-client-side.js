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

  const chat_message = "chat_message";
  const play = "play";
  const ready = "ready";
  // ----------------------------------------emiting---------------------------------------

  // joining a room (clicking "start" button)
  useEffect(() => {
    socket.emit("data", { room: playerRoom, action: play });
  }, [playerRoom]);

  // ready to play (clicking "ready" button)
  useEffect(() => {
    if (isFirstTurn !== null) {
      socket.emit("data", {
        room: playerRoom,
        action: ready,
        board: playerBoard,
        ships: playerShips,
        turn: !isFirstTurn,
        to_player: "1",
      });
      console.log("this is player 2");
      console.log("player 2 emiting...");
    } else {
      let local_turn;
      const turn_generator = randomize(0, 1);
      turn_generator === 0 ? (local_turn = true) : (local_turn = false);
      socket.emit("data", {
        room: playerRoom,
        action: ready,
        board: playerBoard,
        ships: playerShips,
        turn: !local_turn,
        to_player: "2",
      });
      if (playerRoom) {
        setIsFirstTurn(local_turn);
      }
      console.log("this is player 1");
      console.log("player 1 turn is " + local_turn);
      console.log("player 1 emiting...");
    }
  }, [isPlayerReady]);

  // guessing (clicking on the opponents board)
  useEffect(() => {
    socket.emit("data", { room: playerRoom, guess: playerGuess });
  }, [playerGuess]);

  // send a message (using the chat)
  useEffect(() => {
    socket.emit("data", {
      room: playerRoom,
      action: chat_message,
      message: chatMessages[chatMessages.length - 1],
    });
  }, [playerMessage]);

  // winning
  useEffect(() => {
    if (winning === true) {
      socket.emit("data", { room: playerRoom, is_winning: true });
    }
  }, [winning]);

  // ---------------------------------------listening---------------------------------------

  useEffect(() => {
    socket.on("data", (data = {}) => {
      if (data === "REFRESH") {
        location.href = window.location.origin;
      }
      const {
        other_player_connected,
        turn,
        board,
        ships,
        ready_to_start,
        to_player,
        guess,
        message,
        is_winning,
        leave,
        users_count,
        wanna_play_again,
      } = data;
      if (users_count) setUsersCounter(users_count);
      if (wanna_play_again) setPlayAgainMsg(true);
      if (other_player_connected) {
        setBothPlayersConnected(true);
      } else if (to_player === "2") {
        setOtherPlayerBoard(board);
        setOtherPlayerShips(ships);
        setIsFirstTurn(turn);
        console.log("does player2 starts?: " + turn);
        console.log("TOPLAYER2: ", data);
      } else if (to_player === "1") {
        setOtherPlayerReady(true);
        setOtherPlayerBoard(board);
        setOtherPlayerShips(ships);
        setIsFirstTurn(turn);
        console.log("player's 2 data recived by player 1");
        console.log("does player1 starts?: " + turn);
      } else if (guess) {
        setOtherPlayerGuess(guess);
      } else if (message) {
        console.log("I got message!");
        setOtherPlayerMessage((prev) => [...prev, message.msg]);
        setChatMessages((prev) => [
          ...prev,
          {
            id: message.id,
            msg: message.msg,
          },
        ]);
      } else if (is_winning) {
        setWinning(!is_winning);
      } else if (leave) {
        setIsLeave(true);
        setShowModal(true);
      }
    });
  }, []);
  //--------------- Play again ------------------------
  useEffect(() => {
    if (playAgain) {
      socket.emit("data", { play_again_emit: true, room: playerRoom });
      setPlayAgain(false);
    }
  }, [playAgain]);
  return <div></div>;
};

export default Sockets;
