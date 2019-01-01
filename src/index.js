import React from "react";
import { render } from "react-dom";
import registerServiceWorker from "./registerServiceWorker";
import "./styles/reset.css";
import "./styles/styles.css";
import App from "./components/App";

render(<App />, document.getElementById("root"));

registerServiceWorker();
