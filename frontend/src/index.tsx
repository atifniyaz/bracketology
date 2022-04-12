import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./Create";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { NavigationBar } from "./Navigation";
import Register from "./Register";
import Home from "./Home";
import Scores from "./Scores";
import { StyledEngineProvider } from "@mui/material";
import BracketForm from "./BracketForm";
import View from "./View";

const container = document.getElementById("root")!;
const root = createRoot(container);

root.render(
  <StyledEngineProvider injectFirst>
    <BrowserRouter>
      <NavigationBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/create" element={<App viewOnly={false} />} />
        <Route path="/master" element={<BracketForm />} />
        <Route path="/view" element={<View />} />
        <Route path="/scores" element={<Scores />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </BrowserRouter>
  </StyledEngineProvider>
);
