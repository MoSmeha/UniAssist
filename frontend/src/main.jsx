import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { SocketManager } from "./zustand/SocketManager.jsx"; // Add this
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <SocketManager />
      
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
