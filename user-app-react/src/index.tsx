import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import reportWebVitals from "./reportWebVitals";
import { RouterProvider } from "react-router-dom";
import { router } from "./router";
import { AuthProvider } from "./store/auth";

const originalError = console.error;
console.error = (...args) => {
  if (
    typeof args[0] === "string" &&
    /WebSocket connection to 'ws:\/\/localhost:3000\/ws' failed/.test(args[0])
  ) {
    return;
  }
  originalError.apply(console, args);
};

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
