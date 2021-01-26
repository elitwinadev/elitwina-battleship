import React, { useState, useEffect, useContext } from "react";
import {
  OpponentSquare,
  MissHit,
  ShipHit,
  ShipSink,
  AroundSink,
  ShipPart,
} from "../styles/GlobalStyles";
import {
  SEA,
  MISS,
  HIT,
  SINK,
  AROUND_SINK,
  SHIP_PART,
  BsContext,
} from "../stateManager/stateManager";
import "../styles/OnceAnimation.css";
import { playSound } from "../stateManager/stateManager";
import { FaTruckMonster } from "react-icons/fa";

const dev = true; // necessary only for dev - let you see the opponent ship

// checking the pixel status when clicking and render a new one (depends on the pixel status)
const OpponentPixel = ({ status, x, y, clickhandler, lock }) => {
  const [isAnimated, setIsAnimated] = useState(true);
  const { playSounds } = useContext(BsContext);
  const [alreadyPlayed, setAlreadyPlayed] = useState(false);
  if (status === SEA) {
    return (
      <OpponentSquare
        lock={true}
        onClick={() => clickhandler(x, y, lock)}
      ></OpponentSquare>
    );
  } else if (status === MISS) {
    if (isAnimated) {
      if (!alreadyPlayed) {
        playSound(MISS, playSounds);
        setAlreadyPlayed(true);
      }
      setTimeout(() => {
        setIsAnimated(false);
      }, 3000);
    }
    return (
      <MissHit
        isAnimated={isAnimated}
        lock={lock}
        onClick={() => clickhandler(x, y, lock)}
      >
        •
      </MissHit>
    );
  } else if (status === HIT) {
    if (isAnimated) {
      if (!alreadyPlayed) {
        playSound(HIT, playSounds);
        setAlreadyPlayed(true);
      }
      setTimeout(() => {
        setIsAnimated(false);
      }, 3000);
    }
    return (
      <ShipHit
        isAnimated={isAnimated}
        lock={lock}
        onClick={() => clickhandler(x, y, lock)}
      >
        X
      </ShipHit>
    );
  } else if (status === SINK) {
    if (isAnimated) {
      if (!alreadyPlayed) {
        playSound(SINK, playSounds);
        setAlreadyPlayed(true);
      }
      setTimeout(() => {
        setIsAnimated(false);
      }, 3000);
    }
    return <ShipSink isAnimated={isAnimated} lock={lock}></ShipSink>;
  } else if (status === AROUND_SINK) {
    if (isAnimated) {
      setTimeout(() => {
        setIsAnimated(false);
      }, 3000);
    }
    return (
      <AroundSink isAnimated={isAnimated} lock={lock}>
        •
      </AroundSink>
    );
  } else if (status === SHIP_PART) {
    //
    if (dev)
      return (
        <ShipPart
          lock={true}
          onClick={() => clickhandler(x, y, lock)}
        ></ShipPart>
      );
    // dev tool
    //
    else
      return (
        <OpponentSquare
          lock={true}
          onClick={() => clickhandler(x, y, lock)}
        ></OpponentSquare>
      );
  }
};

export default OpponentPixel;
