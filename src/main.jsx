import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import Homepage from "./pages/Homepage.jsx";
import GenrePage from "./pages/GenrePage.jsx";


createRoot(document.getElementById("root")).render(
  <StrictMode>
    < GenrePage/>
  </StrictMode>,
);
