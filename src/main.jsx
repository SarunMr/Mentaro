import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import Homepage from "./assets/Homepage.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Homepage />
  </StrictMode>,
);
