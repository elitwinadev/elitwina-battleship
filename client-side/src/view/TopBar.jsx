import React, { useEffect, useState, useContext } from "react";
import { BsContext, playSound } from "../stateManager/stateManager";
import Modal from './MsgModal'
import battleship_logo from "../logo/battleship_logo.jpg";
import styled, { keyframes } from "styled-components";
import { flex, position } from "../styles/Mixins";
import { flash } from 'react-animations';
import Loader from 'react-loader-spinner';
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import { HiVolumeOff, HiVolumeUp }  from 'react-icons/hi'

const flashAnimation = keyframes`${flash}`;

const TopBar = () => {

  const { bothPlayersReady, showModal, gameOverMsg, isGameStarted, usersCounter, isMyTurn, playSounds, setPlaySounds } = useContext(BsContext);
  useEffect(() => {
    if (isGameStarted) {
      if (isMyTurn) {
        setTimeout(() => {
          window.navigator.vibrate(200);
          playSound('YOURTURN', playSounds);
        }, 1000);
      }
      else {
        setTimeout(() => {
            playSound('NOTYOURTURN', playSounds);
        }, 1000);
      }
    }
  }, [isMyTurn])
  return (
    <TopBarWrapper>
            { isGameStarted ? <SoundsToggle onClick={() => setPlaySounds(!playSounds)}>{playSounds ? <HiVolumeUp /> : <HiVolumeOff />}</SoundsToggle> : ' ' }
      <LogoWrapper>
        <Logo src={battleship_logo} alt={"logo"} onClick={() => location.href = window.location.origin} />
      </LogoWrapper>
      <TopBarHeader>{usersCounter} {usersCounter > 1 ? 'Players' : 'Player'} Online</TopBarHeader>
      {bothPlayersReady && !gameOverMsg ? <TurnHolder isMyTurn={isMyTurn}>{isMyTurn ? <TurnText><Flash>Its Your Turn!</Flash></TurnText> : <TurnText>Opponent Turn<Loader style={{ paddingLeft: '0.5vw', position: 'relative', top: '1.1vw' }} type="ThreeDots" color="white" height={'4vw'} width={'4vw'} /> </TurnText>}
      </TurnHolder> : ' '}
      {showModal && !gameOverMsg ? <Modal /> : ' '}
    </TopBarWrapper>
  )
};

export default TopBar

const TopBarWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  align-content: center;
  color: white;
  height: 13vw;
  margin-bottom: -8vw;

  @media only screen and (min-width: 600px) {
      width: 130vw;
      margin-bottom: 0;
    }
  
`;
const LogoWrapper = styled.div`
width: 100%;
  `;

const Logo = styled.img`
  height: 10vw;
  cursor: pointer;
`;

const TopBarHeader = styled.span`
  font-size: 2.5vw;
  width: 100%;
  margin-top: -4vw;
  margin-left: 1.5vw;

`;

const TurnHolder = styled.div`
  ${flex(false, 'center')};
  width: 100%;

  @media only screen and (max-width: 600px)
    {
margin: 3vw;
padding-left: 2vw;
background: ${props => !props.isMyTurn ? 'red' : 'blue'};
display: flex;
align-items: center;

    }
`;

const TurnText = styled.div`
  ${flex(false, false)};
  font-size: 4vw;
  align-items: center;
`;

const Flash = styled.h1`
  animation: 3s ${flashAnimation};
  animation-iteration-count: infinite;
  font-size: 4vw;
`;

const SoundsToggle = styled.h1`
position: absolute;
top: 4vw;
right: 4vw;
z-index: 3000;
cursor: pointer;
@media only screen and (max-width: 600px) {
  font-size: 4vw;
  right: 4vw
}
`