import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./Create";
import reportWebVitals from "./reportWebVitals";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { NavigationBar } from "./Navigation";
import Register from "./Register";
import Home from "./Home";
import Scores from "./Scores";
import { StyledEngineProvider } from "@mui/material";

ReactDOM.render(
  <StyledEngineProvider injectFirst>
    <BrowserRouter>
      <NavigationBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/create" element={<App />} />
        <Route path="/scores" element={<Scores />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </BrowserRouter>
  </StyledEngineProvider>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
