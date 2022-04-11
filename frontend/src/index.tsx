import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./Create";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { NavigationBar } from "./Navigation";
import Register from "./Register";
import Home from "./Home";
import Scores from "./Scores";
import { StyledEngineProvider } from "@mui/material";

const container = document.getElementById("root")!;
const root = createRoot(container);

root.render(
  <StyledEngineProvider injectFirst>
    <BrowserRouter>
      <NavigationBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/create" element={<App viewOnly={false} />} />
        <Route path="/view" element={<App viewOnly={true} />} />
        <Route path="/scores" element={<Scores />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </BrowserRouter>
  </StyledEngineProvider>
);
