import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import PublicRoute from "./components/PublicRoute";
//Student
import OverviewPage from "./pages/StudentPage/Overview.jsx";
import MyCoursesPage from "./pages/StudentPage/MyCoursePage.jsx";
import CartPage from "./pages/StudentPage/MyCartPage.jsx";
import CheckoutPage from "./pages/StudentPage/CheckoutPage.jsx";
import WishlistPage from "./pages/StudentPage/MyWishlist.jsx";
import NotificationsPage from "./pages/StudentPage/NotificationPage.jsx";
import SettingsPage from "./pages/StudentPage/SettingsPage.jsx";
import BrowseCourses from "./pages/StudentPage/BrowsePage.jsx";
import CourseWatch from "./pages/StudentPage/CourseWatch.jsx";

//Credentials Page
import Homepage from "./pages/Homepage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import SignupPage from "./pages/SignupPage.jsx";
import InstructorAuthPage from "./pages/InstructorAuthPage.jsx";

//Admin Pages
import AdminPage from "./pages/AdminPage/AdminPage.jsx";
import AdminDashboard from "./pages/AdminPage/AdminDashboard.jsx";
import UserManagement from "./pages/AdminPage/UserManagement.jsx";
import InstructorManagement from "./pages/AdminPage/InstructorManagement.jsx";
import ApprovalsPage from "./pages/AdminPage/Approvals.jsx";
import HelpPage from "./pages/AdminPage/Help.jsx";
import ToolsPage from "./pages/AdminPage/Tools.jsx";
import Revenue from "./pages/AdminPage/Revenue.jsx";
import DiscountManagement from "./pages/AdminPage/DiscountManagement.jsx";

//Instructor Page
import InstructorPage from "./pages/InstructorPage/InstructorPage.jsx";
import InstructorDasboard from "./pages/InstructorPage/InstructorDashboard.jsx";
import InstructorAddCourse from "./pages/InstructorPage/InstructorAddCourse.jsx";
import InstructorCourses from "./pages/InstructorPage/InstructorCourses.jsx";
import InstructorRevenue from "./pages/InstructorPage/InstuctorRevenue.jsx";
import InstructorTools from "./pages/InstructorPage/InstuctorTools.jsx";
import InstructorHelp from "./pages/InstructorPage/InsturctorHelp.jsx";

function AppRoutes() {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state;

  const [backgroundLocation] = React.useState(
    state?.backgroundLocation ||
      (location.pathname === "/login" || location.pathname === "/signup"
        ? { pathname: "/" }
        : location)
  );
  const isModal =
    location.pathname === "/login" || location.pathname === "/signup" || location.pathname === "/instructor-auth";

  // Use backgroundLocation only if modal is open, else use current location
  const routesLocation = isModal ? backgroundLocation : location;

  return (
    <>
      <Routes location={routesLocation}>
        <Route path="/" element={<Homepage />} />
        
        <Route path="/dashboard" element={
          <ProtectedRoute allowedRoles={['student']}>
            <OverviewPage />
          </ProtectedRoute>
        } />
        <Route path="/my-courses" element={
          <ProtectedRoute allowedRoles={['student']}>
            <MyCoursesPage />
          </ProtectedRoute>
        } />
        <Route path="/my-cart" element={
          <ProtectedRoute allowedRoles={['student']}>
            <CartPage />
          </ProtectedRoute>
        } />
        <Route path="/checkout" element={
          <ProtectedRoute allowedRoles={['student']}>
            <CheckoutPage />
          </ProtectedRoute>
        } />
        <Route path="/wishlist" element={
          <ProtectedRoute allowedRoles={['student']}>
            <WishlistPage />
          </ProtectedRoute>
        } />
        <Route path="/notifications" element={
          <ProtectedRoute allowedRoles={['student']}>
            <NotificationsPage />
          </ProtectedRoute>
        } />
        <Route path="/settings" element={
          <ProtectedRoute allowedRoles={['student']}>
            <SettingsPage />
          </ProtectedRoute>
        } />
        <Route path="/courses" element={<BrowseCourses />} />
       
        <Route path="/student/course/:courseId" element={
          <ProtectedRoute allowedRoles={['student']}>
            <CourseWatch />
          </ProtectedRoute>
        } />

        <Route path="/admin" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminPage />
          </ProtectedRoute>
        }>
          <Route index element={<AdminDashboard />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="users" element={<UserManagement />} />
          <Route path="instructors" element={<InstructorManagement />} />
          <Route path="approvals" element={<ApprovalsPage />} />
          <Route path="tools" element={<ToolsPage />} />
          <Route path="revenue" element={<Revenue />} />
          <Route path="discounts" element={<DiscountManagement />} />
          <Route path="help" element={<HelpPage />} />
        </Route>

        <Route path="/instructor" element={
          <ProtectedRoute allowedRoles={['instructor']}>
            <InstructorPage />
          </ProtectedRoute>
        }>
          <Route index element={<InstructorDasboard />} />
          <Route path="dashboard" element={<InstructorDasboard />} />
          <Route path="course" element={<InstructorAddCourse />} />
          <Route path="courses" element={<InstructorCourses />} />
          <Route path="revenue" element={<InstructorRevenue />} />
          <Route path="tools" element={<InstructorTools />} />
          <Route path="help" element={<InstructorHelp />} />
        </Route>

        <Route
          path="/login"
          element={
            <PublicRoute>
              <LoginPage
                onClose={() => navigate("/", { replace: true })}
                switchToSignup={() =>
                  navigate("/signup", {
                    state: { backgroundLocation },
                    replace: true,
                  })
                }
              />
            </PublicRoute>
          }
        />
        <Route
          path="/signup"
          element={
            <PublicRoute>
              <SignupPage
                onClose={() => navigate("/", { replace: true })}
                switchToLogin={() =>
                  navigate("/login", {
                    state: { backgroundLocation },
                    replace: true,
                  })
                }
              />
            </PublicRoute>
          }
        />
        <Route
          path="/instructor-auth"
          element={
            <PublicRoute>
              <InstructorAuthPage
                onClose={() => navigate("/", { replace: true })}
              />
            </PublicRoute>
          }
        />
      </Routes>

      {/* Render modal overlays only if modal is open */}
      {isModal && (
        <>
          {location.pathname === "/login" && (
            <PublicRoute>
              <LoginPage
                onClose={() => navigate("/", { replace: true })}
                switchToSignup={() =>
                  navigate("/signup", {
                    state: { backgroundLocation },
                    replace: true,
                  })
                }
              />
            </PublicRoute>
          )}
          {location.pathname === "/signup" && (
            <PublicRoute>
              <SignupPage
                onClose={() => navigate("/", { replace: true })}
                switchToLogin={() =>
                  navigate("/login", {
                    state: { backgroundLocation },
                    replace: true,
                  })
                }
              />
            </PublicRoute>
          )}
          {location.pathname === "/instructor-auth" && (
            <PublicRoute>
              <InstructorAuthPage
                onClose={() => navigate("/", { replace: true })}
              />
            </PublicRoute>
          )}
        </>
      )}
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router
        future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true,
        }}
      >
        <AppRoutes />
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#363636',
              color: '#fff',
            },
            success: {
              duration: 3000,
              theme: {
                primary: 'green',
                secondary: 'black',
              },
            },
          }}
        />
      </Router>
    </AuthProvider>
  );
}

export default App;
