import { createGlobalStyle } from "styled-components";
import styled, { keyframes, css } from "styled-components";
import { flash } from 'react-animations';
import { flex, cool_shining_green } from "../styles/Mixins";
const flashAnimation = keyframes`${flash}`;
const GlobalStyles = createGlobalStyle`
  html,
  body {
    background: #000000;
    -webkit-user-select: none;
    -ms-user-select: none;
    user-select: none;
    zoom: 120%;
    @media only screen and (min-width: 600px) {
      {zoom: 85%}
    }
  
  body {
    ${flex()};
    font-family: 'Rajdhani', sans-serif;
    color: white;
    font-size: 25px;
    }

    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
      -webkit-user-select: none
      -ms-user-select: none;
      user-select: none;
    }
`;

export default GlobalStyles

// general:

export const StandardPixel = styled.div`
  ${flex()};
  width: 10%;
  height: 10%;
`;

// input component:

export const Button = styled.div`
  ${flex()};
  width: 15vw;
  padding: 0.5vw;
  height: 4.5vw;
  border: 1px solid #00FF41;
  border-radius: 3rem;
  color: white;
  background: #003B00;
  font-size: 2.5vw;
  font-weight: 400;
  margin: 2%;
  box-shadow: inset 0 0.1rem 1.5rem lightgrey;
  cursor: pointer;

    &:focus {
      background: red;
    }
    &:hover {
      ${cool_shining_green};
      background: #1aff1a;
      color: black;
    }
    @media only screen and (max-width: 600px)
    {
height: 5.5vw;
width: 20vw;
    }
`;

// UserPixel + OpponentPixel components:

export const RegularSquare = styled(StandardPixel)`
  border: 0.1vw solid #00FF41;
`;

export const OpponentSquare = styled(RegularSquare)`

    :hover {
      background: #00ff41;
      opacity: 0.5;
    }
`;

export const MissHit = styled(StandardPixel)`
  border: 0.1vw solid #00FF41;
  background: #00FF41;
  opacity: 0.3;
  animation: ${props => (props.isAnimated ? css`${flashAnimation} 2s;` : '')} ;
`;

export const AroundSink = styled(StandardPixel)`
  border: 0.1vw solid #00FF41;
  background: red;
  opacity: 0.3;
`;

export const ShipHit = styled(StandardPixel)`
  border: 0.1vw solid lightblue;
  background: rgba(255, 153, 153, 0.5);
  color: red;
  font-size: 5vw;
  animation: ${props => (props.isAnimated ? css`${flashAnimation} 2s;` : '')} ;
`;

export const ShipSink = styled(StandardPixel)`
background: #008F11;
border: 0.1vw solid #00FF41;
animation: ${props => (props.isAnimated ? css`${flashAnimation} 2s;` : '')} ;
  
`;

export const ShipPart = styled(StandardPixel)`
  border: 0.1vw solid blue;
  background: rgba(0, 0, 255, 0.6);

`;

// UserGrid + OpponentGrid components:

export const GridWrapper = styled.div`

  border: none;
  height: 100%;
  width: 100%;
  color: white;
  display: grid;
  justify-content: center;
  grid-template-areas:
  'header header'
  'progressBar progressBar'
  'emptyPixel lettersBar'
  'numbersBar grid';
  @media only screen and (max-width: 600px) {
      padding-top: 5vw;
      zoom: 125%;
    }

    
`;

export const PlayerGrid = styled.div`

  display: flex;
  flex-wrap: wrap;
  height: 40vw;
  width: 40vw;
  color: #003B00;
  grid-area: grid;
  @media only screen and (max-width: 600px)
    {
      height: 50vw;
      width: 50vw;
      
    }
    opacity: ${({ lockOtherPlayerBoard }) => (lockOtherPlayerBoard ? '0.3' : '1')};
`;

export const OtherPlayerGrid = styled(PlayerGrid)`
  cursor: ${({ lockOtherPlayerBoard }) => (lockOtherPlayerBoard ? 'not-allowed' : 'pointer')};
  opacity: ${({ lockOtherPlayerBoard }) => (lockOtherPlayerBoard ? '0.3' : '1')};
`;

export const GridHeaders = styled.span`
  text-align: center;
  font-size: 2.5vw;

  grid-area: header;
`;

export const LittleWrapper = styled.div`
  ${flex()};
  width: 100%;
  padding-top: 2%;
  padding-bottom: 5%;

  grid-area: progressBar;
`;

export const LettersBar = styled.div`
  ${flex(false,false)};
  width: 40vw;
  margin-bottom: -1vw;

  grid-area: lettersBar;
  font-size: 3vw;
  @media only screen and (max-width: 600px) {
    {
width: 50vw;

    }
`;

export const NumbersBar = styled.div`
  ${flex('center', false)};
  flex-direction: column;
  height: 40vw;
  font-size: 3vw;
  margin-right: 0.5vw;

  grid-area: numbersBar;
  @media only screen and (max-width: 600px) {
    {
height: 50vw;
    }
`;

export const BarPixel = styled(StandardPixel)`
`;

export const PlaceFiller = styled(StandardPixel)`
  grid-area: emptyPixel;
`;





