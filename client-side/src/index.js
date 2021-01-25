
import React from 'react';
import ReactDOM from "react-dom";
import App from "./view/App";
import { StateManager } from "./stateManager/stateManager";
import GlobalStyles from "./styles/GlobalStyles"

const rootElement = document.getElementById("root");

ReactDOM.render(
  <>
    <StateManager>
      <App />
    </StateManager>
    <GlobalStyles />
  </>,
  rootElement
);