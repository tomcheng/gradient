import React from "react";
import { render } from "react-dom";
import registerServiceWorker from "./registerServiceWorker";
import "./styles/reset.css";
import "./styles/styles.css";
import App from "./components/App";

if (!Object.entries) {
  Object.entries = function( obj ){
    var ownProps = Object.keys( obj ),
      i = ownProps.length,
      resArray = new Array(i); // preallocate the Array
    while (i--)
      resArray[i] = [ownProps[i], obj[ownProps[i]]];

    return resArray;
  };
}

render(<App />, document.getElementById("root"));

registerServiceWorker();
