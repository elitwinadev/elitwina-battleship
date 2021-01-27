import React, { useState, useContext, useEffect } from "react";
import styled from "styled-components";
import { BsContext } from "../stateManager/stateManager";
import { hitBoardUpdate, missBoardUpdate } from "../logic/logic";
import { SINK, SHIP_PART, HIT, MISS } from "../stateManager/stateManager";
import UserPixel from "./UserPixel";
import {
  GridWrapper,
  PlayerGrid,
  GridHeaders,
  LittleWrapper,
  LettersBar,
  NumbersBar,
  BarPixel,
} from "../styles/GlobalStyles";
import ProgressBar from "@ramonak/react-progress-bar";

const UserGrid = () => {
  const {
    playerBoard,
    setPlayerBoard,
    playerShips,
    isPlayerReady,
    userPrecents,
    setUserPrecents,
    otherPlayerGuess,
    bothPlayersConnected,
    lockOtherPlayerBoard,
    bothPlayersReady,
    isMyTurn,
    isGameStarted
  } = useContext(BsContext);

  // *** for reordering ships functionality (Not implemented yet)
  const [lockShipsPosition, setLockShipsPosition] = useState(false);

  // *** lock the user's ship when ready after reordering (Not implemented yet)
  useEffect(() => {
    setLockShipsPosition(true);
  }, [isPlayerReady]);

  // *** we are reusing this pure function in OpponentGrid - worth moving to Logic.
  // return the player's guess result (hit, miss...)
  const pixelStatus = (x, y, board, ships) => {
    const pixel = board[x][y];
    if (ships && pixel.value === SHIP_PART) {
      return ships[pixel.shipIndex].isSunk
        ? SINK
        : pixel.isHit
          ? HIT
          : pixel.value;
    }
    return pixel.value;
  };

  // updating the player's board according to the other player's guess
  useEffect(() => {
    if (otherPlayerGuess) {
      const { result, x, y } = otherPlayerGuess;
      let updated;
      if (result === MISS) {
        updated = missBoardUpdate(playerBoard, x, y);
        setPlayerBoard(updated);
      } else if (result === HIT) {
        setUserPrecents(userPrecents + 1);
        updated = hitBoardUpdate(
          x,
          y,
          playerBoard[x][y].shipIndex,
          playerBoard,
          playerShips
        );
        // *** need checking out
        setPlayerBoard(updated.board);
      }
    }
  }, [otherPlayerGuess]);

  return (
    <UserGridWrapper
      isGameStarted={isGameStarted}
      bothPlayersConnected={bothPlayersConnected}
      lockOtherPlayerBoard={lockOtherPlayerBoard}
      bothPlayersReady={bothPlayersReady}
      isPlayerReady={isPlayerReady}
      isMyTurn={isMyTurn}
    >
      <GridHeaders>Your Board</GridHeaders>
      <LittleWrapper>
        <ProgressBar
          bgcolor="#00FF41"
          labelColor="grey"
          completed={userPrecents * 5 || 0}
          width={"30vw"}
          height={"2vw"}
          labelSize={"2vw"}
        />
      </LittleWrapper>
      <NumbersBar>
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num, i) => (
          <BarPixel key={i}>{num}</BarPixel>
        ))}
      </NumbersBar>
      <LettersBar>
        {["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"].map((letter, i) => (
          <BarPixel key={i}>{letter}</BarPixel>
        ))}
      </LettersBar>
      <PlayerGrid>
        {playerBoard.map((xArr, Xindex, board) =>
          xArr.map((yArr, Yindex) => (
            <UserPixel
              lock={lockShipsPosition} // *** for the ship reordering function (Not implemented yet)
              key={`g${Yindex}`}
              status={pixelStatus(Xindex, Yindex, board, playerShips)}
            ></UserPixel>
          ))
        )}
      </PlayerGrid>
    </UserGridWrapper>
  );
};

export default UserGrid;

const UserGridWrapper = styled(GridWrapper)`
@media only screen and (max-width: 600px) {
  ${({ bothPlayersConnected, lockOtherPlayerBoard }) => !lockOtherPlayerBoard || !bothPlayersConnected ? `display: none;` : ` `};
  ${({ bothPlayersConnected, isPlayerReady }) =>
  bothPlayersConnected && !isPlayerReady
    ? `margin-top: 39vw;`
    : " "}



  }
  `;

  // 