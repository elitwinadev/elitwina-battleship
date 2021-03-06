import React, { useState, useContext, Component } from "react";
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
import missImg from "../assests/images/miss.gif";

const dev = false; // necessary only for dev - let you see the opponent ship

// checking the pixel status when clicking and render a new one (depends on the pixel status)
const OpponentPixel = ({ status, x, y, clickhandler, lock, isMyTurn }) => {
  const [isAnimated, setIsAnimated] = useState(true);
  const [isMiddleAnimated, setIsMiddleAnimated] = useState(true);
  const [alreadyPlayed, setAlreadyPlayed] = useState(false);
  const { playSounds } = useContext(BsContext);
  if (status === SEA) {
    return (
      <OpponentSquare
        isMyTurn={isMyTurn}
        lock={lock}
        onClick={() => clickhandler(x, y, lock)}
      ></OpponentSquare>
    );
  } else if (status === MISS) {
    if (!alreadyPlayed) {
      playSound(MISS, playSounds);
      setAlreadyPlayed(true);
    }
    if (isMiddleAnimated) {
      setTimeout(() => {
        setIsMiddleAnimated(false);
      }, 3000);
      return <img width="10%" height="10%" src={missImg} />;
    } else {
      return (
        <MissHit lock={lock} onClick={() => clickhandler(x, y, lock)}>
          •
        </MissHit>
      );
    }
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
      <ShipHit lock={lock} onClick={() => clickhandler(x, y, lock)}>
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
