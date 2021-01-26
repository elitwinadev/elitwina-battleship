import React, { useContext, useEffect, useState, useRef } from "react";
import { BsContext, playSound } from "../stateManager/stateManager";
import styled, { keyframes } from "styled-components";
import { inspectHit, hitBoardUpdate, missBoardUpdate } from "../logic/logic";
import { SINK, SHIP_PART, HIT, MISS } from "../stateManager/stateManager";
import OpponentPixel from "./OpponentPixel";
import {
  GridWrapper,
  OtherPlayerGrid,
  GridHeaders,
  LittleWrapper,
  LettersBar,
  NumbersBar,
  BarPixel,
} from "../styles/GlobalStyles";
import ProgressBar from "@ramonak/react-progress-bar";
const OpponentGrid = () => {
  const {
    otherPlayerBoard,
    setOtherPlayerBoard,
    otherPlayerShips,
    isFirstTurn,
    bothPlayersReady,
    setNoteStatus,
    opponentPrecents,
    setOpponentPrecents,
    setPlayerGuess,
    otherPlayerGuess,
    lockOtherPlayerBoard,
    setLockOtherPlayerBoard,
    setWinning,
    setMouseX,
    setMouseY,
    isGameStarted,
    isMyTurn,
    setIsMyTurn,
    playSounds,
  } = useContext(BsContext);
  const [lockedPixels, setLockedPixels] = useState([]);
  const isItemLocked = (x, y) => {
    if (!lockedPixels) return false;
    for (let item of lockedPixels) {
      if (item.x === x && item.y === y) {
        return true;
      }
    }
    return false;
  };

  // unlock the board of the first player.
  useEffect(() => {
    if (isFirstTurn) {
      setLockOtherPlayerBoard(false);
      setIsMyTurn(true);
    } else {
      setLockOtherPlayerBoard(true);
      setIsMyTurn(false);
    }
  }, [bothPlayersReady]);

  // unlock the players board if the other player missed.
  useEffect(() => {
    if (otherPlayerGuess) {
      const { result } = otherPlayerGuess;
      if (result === MISS) {
        setIsMyTurn(true);
        setTimeout(() => {
          setLockOtherPlayerBoard(false);
        }, 1000);
      }
    }
  }, [otherPlayerGuess]);

  // *** we are reusing this pure function in UserGrid - worth moving to Logic.
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

  // checking the guess's result and emit it to the other player
  // in the same time updating the player's opponent board and lock it
  // afterwards lock the used pixel
  const onClick = (x, y) => {
    setMouseX(event.screenX);
    setMouseY(event.screenY);
    let updated;
    if (!isMyTurn) {
      setNoteStatus("Its not your turn!");
    } else {
      if (!isItemLocked(x, y)) {
        const result = inspectHit(otherPlayerBoard, x, y);
        setPlayerGuess({ x, y, result });
        if (result === MISS) {
          updated = missBoardUpdate(otherPlayerBoard, x, y);
          setOtherPlayerBoard(updated);
          setIsMyTurn(false);
          setTimeout(() => {
            setLockOtherPlayerBoard(true);
          }, 2000);
          setTimeout(() => {
            setNoteStatus("MISS");
          }, 100);
        } else if (result === HIT) {
          updated = hitBoardUpdate(
            x,
            y,
            otherPlayerBoard[x][y].shipIndex,
            otherPlayerBoard,
            otherPlayerShips
          );

          if (updated.sunk) {
            setNoteStatus("SINK!");
            // NOT WORKING!!
          } else {
            setNoteStatus("HIT!");
            setOpponentPrecents(opponentPrecents + 1);
          }
          if (updated.isWin) {
            setWinning(true);
            setTimeout(() => {
              setLockOtherPlayerBoard(true);
            }, 2000);
          }
        }
        lockPixel(x, y);
      } else {
        playSound("ERROR", playSounds);
        setNoteStatus("Already clicked!");
      }
    }
    event.stopPropagation();
  };

  // lock a specific pixel
  const lockPixel = (x, y) => {
    let item = { x, y };
    setLockedPixels([...lockedPixels, item]);
  };

  // save all the locked pixels in an array for later checking

  return (
    <OpponentGridWrapper
      isMyTurn={!lockOtherPlayerBoard}
      isGameStarted={isGameStarted}
    >
      <GridHeaders>Opponents Board</GridHeaders>
      <LittleWrapper>
        <ProgressBar
          bgcolor="#00FF41"
          labelColor="grey"
          completed={opponentPrecents * 5 || 0}
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
      <OtherPlayerGrid lockOtherPlayerBoard={lockOtherPlayerBoard}>
        {otherPlayerBoard.map((xArr, Xindex, board) =>
          xArr.map((yArr, Yindex) => (
            <OpponentPixel
              isMyTurn={isMyTurn}
              lock={isItemLocked(Xindex, Yindex)}
              key={`g${Yindex}`}
              status={pixelStatus(Xindex, Yindex, board, otherPlayerShips)}
              x={Xindex}
              y={Yindex}
              clickhandler={onClick}
            ></OpponentPixel>
          ))
        )}
      </OtherPlayerGrid>
    </OpponentGridWrapper>
  );
};

export default OpponentGrid;

const OpponentGridWrapper = styled(GridWrapper)`
  @media only screen and (max-width: 600px) {
    ${(props) => (props.isMyTurn ? `display: grid` : `display: none`)};
  }
`;
