import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import "bootstrap/dist/css/bootstrap.min.css";
import App from "./components/App";
import * as serviceWorker from "./serviceWorker";
import Apollo, { ApolloContext } from "./components/Apollo";

ReactDOM.render(
  <ApolloContext.Provider value={new Apollo()}>
    <App />
  </ApolloContext.Provider>,
  document.getElementById("root")
);
// setupTerminal();
// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
