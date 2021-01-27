import React, { useState, useContext } from "react";
import styled from "styled-components";
import {
  RegularSquare,
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
const UserPixel = ({ status, lock }) => {
  const [isAnimated, setIsAnimated] = useState(true);
  const [alreadyPlayed, setAlreadyPlayed] = useState(false);
  const { playSounds } = useContext(BsContext);
  if (status === SEA) {
    return <RegularSquare />;
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
    return <MissHit isAnimated={isAnimated}>•</MissHit>;
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
    return <ShipHit isAnimated={isAnimated}>X</ShipHit>;
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
    return <ShipSink isAnimated={isAnimated}></ShipSink>;
  } else if (status === AROUND_SINK) {
    if (isAnimated) {
      setTimeout(() => {
        setIsAnimated(false);
      }, 3000);
    }
    return <AroundSink isAnimated={isAnimated}>•</AroundSink>;
  } else if (status === SHIP_PART) {
    return <ShipPart isLock={lock}></ShipPart>;
  }
};

export default UserPixel;

// *** when adding the reordering of the player ships before ready, switch "ShipPart" with "PlayerShipPart" (Not implemented yet)
const PlayerShipPart = styled(ShipPart)`
  cursor: ${({ lock }) => (lock ? "none" : "move")};
`;
