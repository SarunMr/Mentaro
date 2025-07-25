import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { MdEmail } from "react-icons/md";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import loginSideImage from "../assets/images/Forloginfront.png";
import Mentarolgo from "./../assets/images/mentarologo.png";
import Overlays from "./../components/Overlays.jsx";
import { useAuth } from "../contexts/AuthContext";
import { authAPI } from "../utils/apiClient";

const LoginPage = ({ onClose }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [userType, setUserType] = useState("student");
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  // Switch to signup overlay with same background
  const handleSwitchToSignup = () => {
    navigate("/signup", {
      state: {
        backgroundLocation: location.state?.backgroundLocation || location,
      },
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await authAPI.login(userType, {
        email,
        password,
      });

      if (response.data.success) {
        console.log('Login response:', response.data);
        console.log('User role:', response.data.user.role);
        
        login(response.data.token, response.data.user);
        
        if (onClose) onClose();
        
        setTimeout(() => {
          const redirectPath = location.state?.from?.pathname || getDefaultPath(response.data.user.role);
          console.log('Redirect path:', redirectPath);
          navigate(redirectPath, { replace: true });
        }, 100);
      } else {
        setError(response.data.message || "Login failed");
      }
    } catch (error) {
      console.error("Login error:", error);
      if (error.response) {
        setError(error.response.data?.message || "Login failed");
      } else if (error.request) {
        setError("Unable to connect to server. Please check your internet connection.");
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const getDefaultPath = (role) => {
    switch (role) {
      case "admin":
        return "/admin/dashboard";
      case "instructor":
        return "/instructor/dashboard";
      case "student":
        return "/dashboard";
      default:
        return "/";
    }
  };

  return (
    <Overlays onClose={onClose} leftImage={loginSideImage}>
      {/* Logo & Description */}
      <div className="flex items-center mb-2">
        <img src={Mentarolgo} alt="Logo" />
      </div>
      <p className="mb-4 text-gray-500 text-sm">
        Join us and get more benefits. We promise to keep your data safely.
      </p>

      {/* User Type Selection */}
      <div className="flex justify-center mb-4">
        <div className="flex bg-gray-100 p-1 rounded-lg w-full">
          <button
            type="button"
            className={`flex-1 py-2 px-4 rounded-md font-medium text-sm transition ${
              userType === "student"
                ? "bg-blue-500 text-white shadow"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
            onClick={() => setUserType("student")}
          >
            Student
          </button>
          <button
            type="button"
            className={`flex-1 py-2 px-4 rounded-md font-medium text-sm transition ${
              userType === "instructor"
                ? "bg-blue-500 text-white shadow"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
            onClick={() => setUserType("instructor")}
          >
            Instructor
          </button>
          <button
            type="button"
            className={`flex-1 py-2 px-4 rounded-md font-medium text-sm transition ${
              userType === "admin"
                ? "bg-blue-500 text-white shadow"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
            onClick={() => setUserType("admin")}
          >
            Admin
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex justify-center">
        <div className="flex mb-6 bg-blue-100 p-1 rounded-full w-fit">
          <button
            className="px-5 py-1 rounded-full font-medium mr-2 bg-blue-500 text-white shadow"
            disabled
          >
            Login
          </button>
          <button
            className="px-5 py-1 rounded-full font-medium bg-blue-100 text-blue-600"
            onClick={handleSwitchToSignup}
          >
            Register
          </button>
        </div>
      </div>
      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
          {error}
        </div>
      )}

      {/* Login Form */}
      <form className="space-y-4" onSubmit={handleSubmit}>
        {/* Email Input with Icon on Right */}
        <div className="relative">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full pr-10 pl-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-700"
            placeholder="Email Address"
            required
          />
          <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            <MdEmail size={22} />
          </span>
        </div>

        {/* Password Input with Eye Toggle */}
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full pl-4 pr-10 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-700"
            placeholder="Password"
            required
          />
          <span
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 cursor-pointer"
            onClick={() => setShowPassword((prev) => !prev)}
            tabIndex={0}
            role="button"
            aria-label="Toggle password visibility"
          >
            {showPassword ? (
              <AiFillEye size={22} />
            ) : (
              <AiFillEyeInvisible size={22} />
            )}
          </span>
        </div>

        <div className="flex items-center justify-between text-sm">
          <label className="flex items-center">
            <input type="checkbox" className="mr-2" />
            Remember me
          </label>
          <button type="button" className="text-blue-500 hover:underline">
            Forgot Password ?
          </button>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </Overlays>
  );
};

export default LoginPage;
