import "./inject-buffer";

import React from "react";
import { BrowserRouter } from "react-router-dom";
import ReactDOM from "react-dom/client";
import reportWebVitals from "./reportWebVitals";
import { AppContextProvider } from "./core/useWallet";
import App from "./App";

import "./assets/cabinet-grotesk/index.css";
import "./assets/manrope/index.css";
import "./index.css";

declare global {
  namespace JSX {
    interface IntrinsicElements {
      nobr: React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement>,
        HTMLElement
      >;
    }
  }
}

var customViewportCorrectionVariable = "vh";

function setViewportProperty(doc: any) {
  var prevClientHeight: any;
  var customVar = "--" + (customViewportCorrectionVariable || "vh");
  function handleResize() {
    var clientHeight = doc.clientHeight;
    if (clientHeight === prevClientHeight) return;
    requestAnimationFrame(function updateViewportHeight() {
      doc.style.setProperty(customVar, clientHeight * 0.01 + "px");
      prevClientHeight = clientHeight;
    });
  }
  handleResize();
  return handleResize;
}
window.addEventListener(
  "resize",
  setViewportProperty(document.documentElement)
);

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <BrowserRouter>
    <AppContextProvider>
      <App />
    </AppContextProvider>
  </BrowserRouter>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
