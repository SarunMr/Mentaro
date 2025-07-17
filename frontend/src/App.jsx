import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
  useNavigate,
} from "react-router-dom";
//Student
import Homepage from "./pages/Homepage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import SignupPage from "./pages/SignupPage.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import UploadPage from "./pages/upload.jsx";
import MyLearning from "./pages/StudentPage/Mylearning.jsx";
import Profile from "./pages/StudentPage/Profile.jsx";

//Admin Pages
import AdminPage from "./pages/AdminPage/AdminPage.jsx";
import AdminDashboard from "./pages/AdminPage/AdminDashboard.jsx";
import AddCoursePage from "./pages/AdminPage/AddCourse.jsx";
import Course from "./pages/AdminPage/Course.jsx";
import ApprovalsPage from "./pages/AdminPage/Approvals.jsx";
import HelpPage from "./pages/AdminPage/Help.jsx";
import ToolsPage from "./pages/AdminPage/Tools.jsx";

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
  const isModal =
    location.pathname === "/login" || location.pathname === "/signup";

  // Use backgroundLocation only if modal is open, else use current location
  const routesLocation = isModal ? backgroundLocation : location;

  return (
    <>
      <Routes location={routesLocation}>
        <Route path="/" element={<Homepage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/my-learning" element={<MyLearning />}></Route>
        <Route path="/profile" element={<Profile />}></Route>
        <Route path="/upload" element={<UploadPage />} />

        <Route path="/admin" element={<AdminPage />}>
          <Route path="dashboard" element={<AdminDashboard />}></Route>
          <Route path="course" element={<AddCoursePage />}></Route>
          <Route path="course/create" element={<Course />}></Route>
          <Route path="approvals" element={<ApprovalsPage />}></Route>
          <Route path="tools" element={<ToolsPage />}></Route>
          <Route path="help" element={<HelpPage />}></Route>
        </Route>
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

      {/* Render modal overlays only if modal is open */}
      {isModal && (
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
