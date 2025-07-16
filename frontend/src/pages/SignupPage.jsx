import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { MdEmail } from "react-icons/md";
import { FaRegCircleUser } from "react-icons/fa6";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import loginSideImage from "../assets/images/Thumbnail.png";
import Mentarolgo from "../assets/images/mentarologo.png";
import Overlays from "../components/Overlays.jsx";

const SignupPage = ({ onClose }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState(""); // for backend errors
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const handleSwitchToLogin = () => {
    navigate("/login", {
      state: {
        backgroundLocation: location.state?.backgroundLocation || location,
      },
    });
  };

  const validate = () => {
    const newErrors = {};
    if (!form.username.trim()) {
      newErrors.username = "Username is required";
    } else if (/\s/.test(form.username)) {
      newErrors.username = "Username must not contain spaces";
    }

    if (!form.email.trim()) {
      newErrors.email = "Email is required";
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(form.email)) {
        newErrors.email = "Email is invalid";
      }
    }

    if (!form.password) {
      newErrors.password = "Password is required";
    } else if (form.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }

    if (!form.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (form.confirmPassword !== form.password) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setApiError(""); // clear API error on new input
  };

const handleSubmit = async (e) => {
  e.preventDefault();

  if (!validate()) return;

  setIsLoading(true);
  setApiError("");

  try {
    const res = await axios.post("http://localhost:5001/api/auth/register", {
      username: form.username,
      email: form.email,
      password: form.password,
    });

    // Registration successful - you can navigate to login or dashboard
    navigate("/login", { replace: true });
  } catch (error) {
    console.error("Registration error:", error); // Add this for debugging
    
    // Handle errors from backend
    if (error.response) {
      // Server responded with error status
      const errorMessage = error.response.data?.message || 
                          error.response.data?.error || 
                          `Registration failed: ${error.response.status} ${error.response.statusText}`;
      setApiError(errorMessage);
    } else if (error.request) {
      // Request was made but no response received
      setApiError("Unable to connect to server. Please check your internet connection.");
    } else {
      // Something else happened
      setApiError("An unexpected error occurred. Please try again.");
    }
  } finally {
    setIsLoading(false);
  }
};

  return (
    <Overlays onClose={onClose} leftImage={loginSideImage}>
      <div className="flex items-center mb-2 h-full">
        <img src={Mentarolgo} alt="Logo" />
      </div>
      <p className="mb-4 text-gray-500 text-sm">
        Join us and get more benefits. We promise to keep your data safely.
      </p>

      <div className="flex justify-center">
        <div className="flex mb-6 bg-blue-100 p-1 rounded-full w-fit">
          <button
            className="px-5 py-1 rounded-full font-medium mr-2 bg-blue-100 text-blue-600"
            onClick={handleSwitchToLogin}
          >
            Login
          </button>
          <button
            className="px-5 py-1 rounded-full font-medium bg-blue-500 text-white shadow"
            disabled
          >
            Register
          </button>
        </div>
      </div>

      {apiError && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
          {apiError}
        </div>
      )}

      <form className="space-y-4" onSubmit={handleSubmit}>
        {/* Username */}
        <div className="relative">
          <input
            type="text"
            name="username"
            value={form.username}
            onChange={handleChange}
            className={`w-full pr-10 pl-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
              errors.username
                ? "focus:ring-red-400 border-red-500"
                : "focus:ring-blue-400"
            } text-gray-700`}
            placeholder="Username"
          />
          <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            <FaRegCircleUser size={22} />
          </span>
          {errors.username && (
            <p className="text-red-500 text-sm mt-1">{errors.username}</p>
          )}
        </div>

        {/* Email */}
        <div className="relative">
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            className={`w-full pr-10 pl-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
              errors.email
                ? "focus:ring-red-400 border-red-500"
                : "focus:ring-blue-400"
            } text-gray-700`}
            placeholder="Email Address"
          />
          <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            <MdEmail size={22} />
          </span>
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email}</p>
          )}
        </div>

        {/* Password */}
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            value={form.password}
            onChange={handleChange}
            className={`w-full pl-4 pr-10 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
              errors.password
                ? "focus:ring-red-400 border-red-500"
                : "focus:ring-blue-400"
            } text-gray-700`}
            placeholder="Password"
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
          {errors.password && (
            <p className="text-red-500 text-sm mt-1">{errors.password}</p>
          )}
        </div>

        {/* Confirm Password */}
        <div className="relative">
          <input
            type={showConfirmPassword ? "text" : "password"}
            name="confirmPassword"
            value={form.confirmPassword}
            onChange={handleChange}
            className={`w-full pl-4 pr-10 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
              errors.confirmPassword
                ? "focus:ring-red-400 border-red-500"
                : "focus:ring-blue-400"
            } text-gray-700`}
            placeholder="Confirm Password"
          />
          <span
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 cursor-pointer"
            onClick={() => setShowConfirmPassword((prev) => !prev)}
            tabIndex={0}
            role="button"
            aria-label="Toggle confirm password visibility"
          >
            {showConfirmPassword ? (
              <AiFillEye size={22} />
            ) : (
              <AiFillEyeInvisible size={22} />
            )}
          </span>
          {errors.confirmPassword && (
            <p className="text-red-500 text-sm mt-1">
              {errors.confirmPassword}
            </p>
          )}
        </div>

        <div className="h-9" />
        <button
          type="submit"
          className={`w-full py-2 rounded-lg font-semibold transition ${
            isLoading
              ? "bg-blue-300 text-white cursor-not-allowed"
              : "bg-blue-600 text-white hover:bg-blue-700"
          }`}
          disabled={isLoading}
        >
          {isLoading ? "Registering..." : "Create Account"}
        </button>
      </form>
    </Overlays>
  );
};

export default SignupPage;
