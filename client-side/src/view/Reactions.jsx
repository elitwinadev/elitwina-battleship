import React, { useContext, useState, useEffect } from "react";
import { BsContext } from "../stateManager/stateManager";
import styled, { keyframes } from "styled-components";
import { nanoid } from "nanoid";
import { slideInDown } from "react-animations";
const slideAnimation = keyframes`${slideInDown}`;
let i = 0;
let array = [];
export function emoji(value, key, speed) {
  (this.value = value),
    (this.key = key),
    (this.speed = speed),
    (this.right = `${Math.floor(Math.random() * 99) + 1}vw`);
}
const Reactions = () => {
  const {
    setLastEmoji,
    reactions,
    setReactions,
    incomingReaction,
    setIncomingReaction,
    bothPlayersReady,
    showModal,
  } = useContext(BsContext);
  const addReaction = (reaction, incoming) => {
    let thisSpeed = Math.floor(Math.random() * 4) + 2;
    let reactionInstance = new emoji(reaction, nanoid(4), thisSpeed);
    if (!incoming) setLastEmoji(reactionInstance);
    for (let x = 0; x < 10; x++) {
      thisSpeed = Math.floor(Math.random() * 4) + 2;
      reactionInstance = new emoji(reaction, nanoid(4), thisSpeed);
      array.push(reactionInstance);
      setReactions([...array]);
      setTimeout(() => {
        array.shift();
        setReactions([...array]);
      }, thisSpeed * 1000);
    }
  };
  useEffect(() => {
    if (incomingReaction) {
      addReaction(incomingReaction, true);
      setIncomingReaction();
    }
  }, [incomingReaction]);
  return (
    <>
      <ReactiondWrapper>
        {reactions.map((reaction) => (
          <H1
            style={{ right: reaction.right }}
            key={reaction.key}
            speed={reaction.speed}
          >
            {reaction.value}
          </H1>
        ))}
      </ReactiondWrapper>
      {bothPlayersReady && !showModal && (
        <ReactionsNav>
          <Reaction onClick={() => addReaction("😂")}>😂</Reaction>
          <Reaction onClick={() => addReaction("😎")}>😎</Reaction>
          <Reaction onClick={() => addReaction("😩")}>😩</Reaction>
          <Reaction onClick={() => addReaction("🤬")}>🤬</Reaction>
          <Reaction onClick={() => addReaction("😮")}>😮</Reaction>
        </ReactionsNav>
      )}
    </>
  );
};
const ReactiondWrapper = styled.div`
  // height: 100vh;
  width: 100vw;
  position: absolute;
  z-index: 1;
  margin-top: 100vh;
  top: 0;
`;
const H1 = styled.h1`
  animation: ${(props) => props.speed}s ${slideAnimation};
  animation-iteration-count: 1;
  position: absolute;
  z-index: 50;
  color: white;
  height: 100vh;
  pointer-events: none;
`;
const ReactionsNav = styled.div`
  display: flex;
  justify-content: center;
  z-index: 10;
  margin-top: 4vh;
`;
const Reaction = styled.div`
  position: relative;
  font-size: 3vw;
  z-index: 99999;
  margin: 0.5vw;
  @media only screen and (max-width: 600px) {
    font-size: 8vw;
    margin-left: 1vw;
  }
  &: hover {

  }
`;
export default Reactions;
