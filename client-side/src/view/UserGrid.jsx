import React, { useState, useContext, useEffect } from "react";
import styled, { keyframes, css } from "styled-components";
import { BsContext } from "../stateManager/stateManager";
import { hitBoardUpdate, missBoardUpdate } from "../logic/logic";
import { SINK, SHIP_PART, HIT, MISS } from "../stateManager/stateManager";
import UserPixel from "./UserPixel";
import { fadeIn } from 'react-animations';
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

const fadeInAnimation = keyframes`${fadeIn}`;
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
    isConnected,
    isGameStarted,
    showReadyBox
  } = useContext(BsContext);
  const [isAnimated, setIsAnimated] = useState(true);

  // *** for reordering ships functionality (Not implemented yet)
  const [lockShipsPosition, setLockShipsPosition] = useState(false);
  // *** lock the user's ship when ready after reordering (Not implemented yet)
  useEffect(() => {
    setLockShipsPosition(true);
  }, [isPlayerReady]);
  useEffect(() => {
    setTimeout(() => {
      setIsAnimated(false);
    }, 3000);
  }, [])

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
  if (isConnected) {
    return (
      <UserGridWrapper
        bothPlayersConnected={bothPlayersConnected}
        showReadyBox={showReadyBox}
        isAnimated={isAnimated}
        lockOtherPlayerBoard={lockOtherPlayerBoard}
        bothPlayersConnected={bothPlayersConnected}
        isPlayerReady={isPlayerReady}
        bothPlayersReady={bothPlayersReady}
        isGameStarted={isGameStarted}

      >
        <GridHeaders>Your Board</GridHeaders>
        <LittleWrapper>
          <ProgressBar
            bgcolor="#00FF41"
            labelColor="grey"
            completed={userPrecents * 5 || 0}
            height={"1.5vw"}
            labelSize={"1vw"}
            width={"30vw"}
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
    )
  }
  return <h1></h1>
};

export default UserGrid;
const UserGridWrapper = styled(GridWrapper)`
  animation: ${(props) =>
      props.isAnimated
        ? css`
          ${fadeInAnimation} 1s;
        `
        : ""};
  animation-iteration-count: 1;
  @media only screen and (max-width: 600px) {
    ${({ lockOtherPlayerBoard,
      bothPlayersConnected,
      isPlayerReady,
      bothPlayersReady, isGameStarted }) =>
        (!lockOtherPlayerBoard ||
          !bothPlayersConnected ||
          (isPlayerReady && !bothPlayersReady) ||
          (bothPlayersReady && !isGameStarted)) &&

            `display: none;`};
}
`