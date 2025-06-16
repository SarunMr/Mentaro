import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
  useNavigate,
} from "react-router-dom";

import Homepage from "./pages/Homepage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import SignupPage from "./pages/SignupPage.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import InstructorDashboard from './components/InstructorSidebar.jsx'; 

function AppRoutes() {
  const location = useLocation();
  const navigate = useNavigate();

  const state = location.state;

  const originalBackgroundLocation = React.useRef(
    state?.backgroundLocation ||
      (location.pathname === "/login" || location.pathname === "/signup"
        ? { pathname: "/" }
        : location),
  );
const backgroundLocation = originalBackgroundLocation.current;
  const isModal = location.pathname === "/login" || location.pathname === "/signup";

  // Use backgroundLocation only if modal is open, else use current location
  const routesLocation = isModal ? backgroundLocation : location;

  return (
    <>
      <Routes location={routesLocation}>
        <Route path="/" element={<Homepage />} />
        <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/instructor-dashboard" element={<InstructorDashboard />} />
        <Route
          path="/login"
          element={
            <LoginPage
              onClose={() => navigate("/", { replace: true })}
              switchToSignup={() =>
                navigate("/signup", { state: { backgroundLocation }, replace: true })
              }
            />
          }
        />
        <Route
          path="/signup"
          element={
            <SignupPage
              onClose={() => navigate("/", { replace: true })}
              switchToLogin={() =>
                navigate("/login", { state: { backgroundLocation }, replace: true })
              }
            />
          }
        />
      </Routes>

      {/* Render modal overlays only if modal is open */}
      {isModal && (
        <>
          {location.pathname === "/login" && (
            <LoginPage
              onClose={() => navigate("/", { replace: true })}
              switchToSignup={() =>
                navigate("/signup", { state: { backgroundLocation }, replace: true })
              }
            />
          )}
          {location.pathname === "/signup" && (
            <SignupPage
              onClose={() => navigate("/", { replace: true })}
              switchToLogin={() =>
                navigate("/login", { state: { backgroundLocation }, replace: true })
              }
            />
          )}
        </>
      )}
    </>
  );
}

function App() {
  return (
    <Router>
      <AppRoutes />
    </Router>
  );
}

export default App;
