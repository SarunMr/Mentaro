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

  const state = location.state;

  // Store original background location in a ref to preserve it across renders
  const originalBackgroundLocation = React.useRef(
    state?.backgroundLocation ||
      (location.pathname === "/login" || location.pathname === "/signup"
        ? { pathname: "/" }
        : location),
  );

  const backgroundLocation = originalBackgroundLocation.current;

  return (
    <>
      {/* Render routes with backgroundLocation or current location */}
      <Routes location={backgroundLocation}>
        <Route path="/" element={<Homepage />} />
        <Route
          path="/login"
          element={
            <LoginPage
              onClose={() => navigate("/", { replace: true })}
              switchToSignup={() =>
                navigate("/signup", {
                  state: { backgroundLocation },
                  replace: true,
                })
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
                navigate("/login", {
                  state: { backgroundLocation },
                  replace: true,
                })
              }
            />
          }
        />
      </Routes>

      {/* Render modal overlay only if current path is login or signup */}
      {(location.pathname === "/login" || location.pathname === "/signup") && (
        <>
          {location.pathname === "/login" && (
            <LoginPage
              onClose={() => navigate("/", { replace: true })}
              switchToSignup={() =>
                navigate("/signup", {
                  state: { backgroundLocation },
                  replace: true,
                })
              }
            />
          )}
          {location.pathname === "/signup" && (
            <SignupPage
              onClose={() => navigate("/", { replace: true })}
              switchToLogin={() =>
                navigate("/login", {
                  state: { backgroundLocation },
                  replace: true,
                })
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
