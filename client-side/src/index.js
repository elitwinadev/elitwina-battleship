import React from "react";
import ReactDOM from "react-dom";
import App from "./view/App";
import { StateManager } from "./stateManager/stateManager";
import GlobalStyles from "./styles/GlobalStyles";
import * as serviceWorker from "./serviceWorker";

const rootElement = document.getElementById("root");
ReactDOM.render(
  <div>
    <StateManager>
      <App />
    </StateManager>
    <GlobalStyles />
  </div>,
  rootElement
);
serviceWorker.register();
