import { createGlobalStyle } from "styled-components";
import styled, { keyframes, css } from "styled-components";
import { flash } from "react-animations";
import { flex, cool_shining_green } from "../styles/Mixins";
const flashAnimation = keyframes`${flash}`;
const GlobalStyles = createGlobalStyle`
  html,
  body {
    overflow-x: hidden;
    background: #202124;
    -webkit-user-select: none;
    -ms-user-select: none;
    user-select: none;
    -moz-transform: scale(0.8);
    ${flex()};
    font-family: 'Rajdhani', sans-serif;
    color: white;
    font-size: 25px;
    width: 100%;
  }
  
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    -webkit-user-select: none
    -ms-user-select: none;
    user-select: none;
    font-family: 'Rajdhani', sans-serif;
    }
`;

export default GlobalStyles;

// general:

export const StandardPixel = styled.div`
  ${flex()};
  width: 10%;
  height: 10%;
  transition: transform 0.1s;
  :hover {
    ${(props) =>
      props.isMyTurn
        ? css`
            background: #00ff41;
          `
        : " "}
  }
  &:active {
    ${(props) =>
      props.isMyTurn
        ? css`
            -ms-transform: scale(1.2); /* IE 9 */
            -webkit-transform: scale(1.2); /* Safari 3-8 */
            transform: scale(1.2);
            background: white;
            opacity: 1;
            border: none;
          `
        : " "}
  }
  @media only screen and (max-width: 600px) {
  }
`;

// input component:
export const InputButton = styled.input`
  ${flex()};
  width: 12vw;
  height: 3vw;
  border: 1px solid #00ff41;
  border-radius: 3rem;
  color: white;
  background: #003b00;
  font-size: 2vw;
  font-weight: 400;
  margin: 2%;
  display: flex;
  align-items: center;
  align-content: center;
  box-shadow: inset 0 0.1rem 1.5rem lightgrey;
  cursor: pointer;

  &:hover {
    ${cool_shining_green};
    background: #1aff1a;
    color: black;
  }
  &:active {
    opacity: 0.7;
  }
  @media only screen and (max-width: 600px) {
    height: 5.5vw;
    width: 20vw;
    font-size: 4vw;
  }
`;
export const Button = styled.div`
  ${flex()};
  width: 12vw;
  padding: 0.5vw;
  height: 3vw;
  border: 1px solid #00ff41;
  border-radius: 3rem;
  color: white;
  background: #003b00;
  font-size: 2vw;
  font-weight: 400;
  margin: 2%;
  box-shadow: inset 0 0.1rem 1.5rem lightgrey;
  cursor: pointer;

  &:hover {
    ${cool_shining_green};
    background: #1aff1a;
    color: black;
  }
  &:active {
    opacity: 0.7;
  }
  @media only screen and (max-width: 600px) {
    height: 5.5vw;
    width: 20vw;
    font-size: 4vw;
  }
`;

// UserPixel + OpponentPixel components:

export const RegularSquare = styled(StandardPixel)`
  border: 0.1vw solid #00ff41;
`;

export const OpponentSquare = styled(RegularSquare)``;

export const MissHit = styled(StandardPixel)`
  border: 0.1vw solid #00ff41;
  background: #00ff41;
  opacity: 0.3;
  font-size: 3vw;
  animation: ${(props) =>
    props.isAnimated
      ? css`
          ${flashAnimation} 2s;
        `
      : ""};
`;

export const AroundSink = styled(StandardPixel)`
  border: 0.1vw solid #00ff41;
  background: red;
  opacity: 0.3;
  font-size: 3vw;
`;

export const ShipHit = styled(StandardPixel)`
  background: rgba(255, 153, 153, 0.5);
  color: red;
  font-size: 3vw;
  animation: ${(props) =>
    props.isAnimated
      ? css`
          ${flashAnimation} 2s;
        `
      : ""};
  @media only screen and (max-width: 600px) {
    font-size: 8vw;
  }
`;

export const ShipSink = styled(StandardPixel)`
  background: #008f11;
  border: 0.1vw solid #00ff41;
  animation: ${(props) =>
    props.isAnimated
      ? css`
          ${flashAnimation} 2s;
        `
      : ""};
`;

export const ShipPart = styled(StandardPixel)`
  border: 0.1vw solid blue;
  background: rgba(0, 0, 255, 0.6);
  box-sizing: border-box;
  padding: 0.2vw;
`;

// UserGrid + OpponentGrid components:

export const GridWrapper = styled.div`
  border: none;
  color: white;
  display: grid;
  grid-template-areas:
    "header header"
    "progressBar progressBar"
    "emptyPixel lettersBar"
    "numbersBar grid";
  @media only screen and (max-width: 600px) {
    padding-top: 5vw;
    width: 150%;
  }
`;

export const PlayerGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  height: 30vw;
  width: 30vw;
  color: #003b00;
  grid-area: grid;
  opacity: ${({ lockOtherPlayerBoard }) =>
    lockOtherPlayerBoard ? "0.3" : "1"};
  @media only screen and (max-width: 600px) {
    opacity: 1;
    height: 90vw;
    width: 90vw;
  }
`;
export const OtherPlayerGrid = styled(PlayerGrid)`
  cursor: ${({ lockOtherPlayerBoard }) =>
    lockOtherPlayerBoard ? "not-allowed" : "pointer"};
  opacity: ${({ lockOtherPlayerBoard }) =>
    lockOtherPlayerBoard ? "0.3" : "1"};
  @media only screen and (max-width: 600px) {
    opacity: 1;
  }
`;

export const GridHeaders = styled.span`
  display: flex;
  justify-content: center;
  font-size: 1.5vw;
  grid-area: header;
  @media only screen and (max-width: 600px) {
    width: 100%;
    font-size: 5vw;
    margin-bottom: -2vw;
  }
`;

export const LittleWrapper = styled.div`
  grid-area: progressBar;
  ${flex()};
  width: 100%;
  padding-top: 1%;
  padding-bottom: 4%;
  padding-left: 5%;
  @media only screen and (max-width: 600px) {
    zoom: 280%;
    padding: 2%;
    margin: 0;
  }
`;

export const LettersBar = styled.div`
  ${flex(false, false)};
  width: 30vw;
  margin-bottom: -1vw;

  grid-area: lettersBar;
  font-size: 1vw;
  margin-bottom: 0.1vw;
  @media only screen and (max-width: 600px) {
    // width: 50vw;
    display: none;
  }
`;

export const NumbersBar = styled.div`
  ${flex("center", false)};
  flex-direction: column;
  height: 30vw;
  font-size: 1vw;
  margin-right: 0.1vw;

  grid-area: numbersBar;
  @media only screen and (max-width: 600px) {
    // height: 50vw;
    display: none;
  }
`;

export const BarPixel = styled(StandardPixel)``;

export const PlaceFiller = styled(StandardPixel)`
  grid-area: emptyPixel;
`;
