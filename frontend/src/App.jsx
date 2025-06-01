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

function AppRoutes() {
  const location = useLocation();
  const navigate = useNavigate();

  // This piece of state stores the background location when modal is opened
  // so that when modal closes, we go back to background page.
  const state = location.state;

  // This means if the location has state.backgroundLocation, render homepage behind modal
  // Otherwise render the route normally (for direct access)
  return (
    <>
      <Routes location={state?.backgroundLocation || location}>
        <Route path="/" element={<Homepage />} />
        <Route
          path="/login"
          element={
            <LoginPage
              onClose={() => navigate("/", { replace: true })}
              switchToSignup={() => navigate("/signup")}
            />
          }
        />
        <Route
          path="/signup"
          element={
            <SignupPage
              onClose={() => navigate("/", { replace: true })}
              switchToLogin={() => navigate("/login")}
            />
          }
        />
      </Routes>

      {/* Show modal overlay only if backgroundLocation exists */}
      {state?.backgroundLocation && (
        <>
          {location.pathname === "/login" && (
            <LoginPage
              onClose={() => navigate("/", { replace: true })}
              switchToSignup={() => navigate("/signup")}
            />
          )}
          {location.pathname === "/signup" && (
            <SignupPage
              onClose={() => navigate("/", { replace: true })}
              switchToLogin={() => navigate("/login")}
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
