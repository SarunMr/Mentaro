import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
// import CourseCard from "./components/CourseCard.jsx";
import App from "./App.jsx";
// import { Upload } from "lucide-react";
import UploadPage from "./pages/Mycourse.jsx";


createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App/>
  </StrictMode>,
);
