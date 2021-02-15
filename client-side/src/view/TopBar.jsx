import React, { useEffect, useState, useContext } from "react";

import { BsContext, playSound } from "../stateManager/stateManager";
import Modal from "./MsgModal";
import logo from "../assests/images/logo.jpg";
import styled, { keyframes } from "styled-components";
import { flex } from "../styles/Mixins";
import Loader from "react-loader-spinner";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import { HiVolumeOff, HiVolumeUp } from "react-icons/hi";
import { bounceInDown, flash } from "react-animations";
import { ImExit } from "react-icons/im";
import { GiPodium } from "react-icons/gi";
const bounceInDownAnimation = keyframes`${bounceInDown}`;
const flashAnimation = keyframes`${flash}`;

const TopBar = () => {
  const {
    showModal,
    gameOverMsg,
    isGameStarted,
    usersCounter,
    isMyTurn,
    playSounds,
    setPlaySounds,
    isLeave,
    token,
    setToken,
    setIsLoginShow,
    setIsRegisterShow,
    setDetailsChecker,
    scores,
    username,
    setUsername,
    setScores,
    isLoginShow,
  } = useContext(BsContext);

  useEffect(() => {
    if (isGameStarted) {
      if (isMyTurn) {
        setTimeout(() => {
          // window.navigator.vibrate(200);
          playSound("YOURTURN", playSounds);
        }, 1000);
      } else {
        setTimeout(() => {
          playSound("NOTYOURTURN", playSounds);
        }, 1000);
      }
    }
  }, [isMyTurn]);
  const logout = () => {
    localStorage.removeItem("token");
    setUsername();
    setScores(0);
    setToken();
  };
  const login = () => {
    setIsRegisterShow(false);
    setIsLoginShow(!isLoginShow);
  };
  useEffect(() => {
    if (localStorage.getItem("token")) {
      setToken(localStorage.getItem("token"));
      setUsername(localStorage.getItem("username"));
      setDetailsChecker(true);
    }
  }, []);

  return (
    <>
      <TopBarWrapper>
        <LogoWrapper>
          <Logo
            src={logo}
            alt={"logo"}
            onClick={() => (location.href = window.location.origin)}
          />
          <TopBarHeader>
            {usersCounter} {usersCounter > 1 ? "Players" : "Player"} Online
          </TopBarHeader>
        </LogoWrapper>
        <UserProfile>
          {token ? (
            <>
              <P>{username} </P>
              <RedPoint>⬤</RedPoint>
              <P>
                <GiPodium /> {scores}
              </P>
              <RedPoint>⬤</RedPoint>
            </>
          ) : (
            <>
              <Plink onClick={login}>Login</Plink>
              <RedPoint>⬤</RedPoint>
            </>
          )}
          <SoundsToggle onClick={() => setPlaySounds(!playSounds)}>
            {playSounds ? <HiVolumeUp /> : <HiVolumeOff />}
          </SoundsToggle>
          {token && (
            <>
              <RedPoint>⬤</RedPoint>
              <StyledLogOut onClick={logout} />
            </>
          )}
        </UserProfile>
      </TopBarWrapper>
      {!gameOverMsg && isGameStarted && !isLeave ? (
        <TurnHolder isMyTurn={isMyTurn}>
          {isMyTurn ? (
            <TurnText>
              <Flash>Its Your Turn!</Flash>
            </TurnText>
          ) : (
            <TurnText>
              Opponent Turn
              <Loader
                style={{
                  paddingLeft: "0.5vw",
                  position: "relative",
                  top: "1.1vw",
                }}
                type="ThreeDots"
                color="white"
                height={"4vw"}
                width={"4vw"}
              />{" "}
            </TurnText>
          )}
        </TurnHolder>
      ) : (
        " "
      )}
      <Modal />
    </>
  );
};

export default TopBar;

const TopBarWrapper = styled.div`
  animation: 2s ${bounceInDownAnimation};
  animation-iteration-count: 1;
  border-bottom: 1px solid #00ff41;
  display: flex;
  flex-direction: column;
  align-items: center;
  align-content: center;
  color: white;
  width: 100vw;
  padding-bottom: 1vw;
  background: black;
  @media only screen and (max-width: 600px) {
    height: 8vh;
    padding-bottom: 10vw;
  } ;
`;
const LogoWrapper = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
  margin-right: -5vw;
  @media only screen and (max-width: 600px) {
    margin-right: 0;
  }
`;

const Logo = styled.img`
  width: 15vw;
  cursor: pointer;
  @media only screen and (max-width: 600px) {
    width: 30vw;
  } ;
`;

const TopBarHeader = styled.span`
  font-size: 1vw;
  width: 100%;
  margin-top: -2vw;
  margin-left: 1vw;
  @media only screen and (max-width: 600px) {
    font-size: 2vw;
    margin-top: -4vw;
    border: 1px solid black;
  } ;
`;

const TurnHolder = styled.div`
  ${flex(false, "center")};
  width: 100%;
  @media only screen and (max-width: 600px) {
    margin-top: 5vw;
    margin-bottom: -3vw;
    background: ${({ isMyTurn }) => (isMyTurn ? `blue` : `red`)};
    display: flex;
    align-items: center;
  } ;
`;

const TurnText = styled.div`
  ${flex(false, false)};
  font-size: 2vw;
  align-items: center;
  @media only screen and (max-width: 600px) {
    font-size: 6vw;
  }
`;
const Flash = styled.h1`
  animation: 3s ${flashAnimation};
  animation-iteration-count: infinite;
  font-size: 2vw;
  @media only screen and (max-width: 600px) {
    font-size: 6vw;
  }
`;
const SoundsToggle = styled.h1`
  margin-top: 0.3vw;
  cursor: pointer;
  font-size: 1.5vw;
  &: hover {
    color: #1aff1a;
  }
  &: active {
    opacity: 0.7;
  }
  @media only screen and (max-width: 600px) {
    font-size: 4vw;
    margin-top: 0.5vw;
  } ;
`;
const SoundsToggle2222 = styled.h1`
  cursor: pointer;
  font-size: 2vw;
  margin-left: 90%;
  margin-top: -2.5vw;
  &: hover {
    color: #1aff1a;
  }
  &: active {
    opacity: 0.7;
  }
  @media only screen and (max-width: 600px) {
    font-size: 6vw;
    margin-top: -9vw;
    margin-left: 80%;
  } ;
`;
const FacebookButton = styled.h1`
  display: flex;
  justify-content: space-between;
  position: absolute;
  top: 4vw;
  right: 0vw;
  flex-direction: row-reverse;
  cursor: pointer;
  font-size: 4vw;
  margin - top: 1vw;
  &: hover {
    color: #1aff1a;
  };
  &: active {
    opacity: 0.7;
  };
  @media only screen and(max - width: 600px) {
      font - size: 4vw;
  };
  `;

const H1 = styled.h1`
  color: white;
`;

const UserProfile = styled.div`
  display: flex;
  padding: 0.5vw;
  width: 50vw;
  margin-right: -48vw;
  justify-content: flex-end;
  align-content: center;
  margin-top: -3.5vw;
  @media only screen and (max-width: 600px) {
    font-size: 5vw;
    margin-top: -7vw;
    margin-left: -22%;
    width: 60%;
  } ;
`;
const P = styled.p`
  // margin: 0.5vw;
  font-size: 1.5vw;
  @media only screen and (max-width: 600px) {
    font-size: 4vw;
    // margin: 1vw;
  }
`;
const Plink = styled(P)`
  cursor: pointer;
  &:hover {
    color: #00ff41;
  }
`;

const StyledLogOut = styled(ImExit)`
  // margin: 0.1vw;
  margin-top: 0.4vw;
  font-size: 1.5vw;
  cursor: pointer;
  &:hover {
    color: #00ff41;
  }
  @media only screen and (max-width: 600px) {
    font-size: 4vw;
    margin-top: 0.5vw;
  }
`;
const RedPoint = styled(P)`
  color: red;
  font-size: 0.5vw;
  // padding-top: 0.5vw;
  margin: 1vw;
  margin-top: 0.5vw;
  @media only screen and (max-width: 600px) {
    font-size: 1vw;
    margin-top: 1.5vw;
  }
`;
