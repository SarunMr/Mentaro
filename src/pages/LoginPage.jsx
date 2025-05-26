import React, { useState } from 'react';
import { MdEmail } from 'react-icons/md';
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai';
import loginSideImage from "../assets/images/Forloginfront.png";
import Mentarolgo from "./../assets/images/mentarologo.png";
import Overlays from './../components/Overlays.jsx';

const LoginPage = ({ onClose, switchToSignup }) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <Overlays onClose={onClose} leftImage={loginSideImage}>
      {/* Logo & Description */}
      <div className="flex items-center mb-2">
        <img src={Mentarolgo} alt="Logo" />
      </div>
      <p className="mb-4 text-gray-500 text-sm">
        Join us and get more benefits. We promise to keep your data safely.
      </p>

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
            onClick={switchToSignup}
          >
            Register
          </button>
        </div>
      </div>

      {/* Login Form */}
      <form className="space-y-4">
        {/* Email Input with Icon on Right */}
        <div className="relative">
          <input
            type="email"
            className="w-full pr-10 pl-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-700"
            placeholder="Email Address"
          />
          <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            <MdEmail size={22} />
          </span>
        </div>

        {/* Password Input with Eye Toggle */}
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            className="w-full pl-4 pr-10 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-700"
            placeholder="Password"
          />
          <span
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 cursor-pointer"
            onClick={() => setShowPassword((prev) => !prev)}
            tabIndex={0}
            role="button"
            aria-label="Toggle password visibility"
          >
            {showPassword ? <AiFillEye size={22} /> : <AiFillEyeInvisible size={22} />}
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
          className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
        >
          Login
        </button>

        <div className="my-4 flex items-center">
          <div className="flex-grow h-px bg-gray-200" />
          <span className="mx-2 text-gray-400 text-xs">or you can</span>
          <div className="flex-grow h-px bg-gray-200" />
        </div>

        <button
          type="button"
          className="w-full flex items-center justify-center border border-gray-300 rounded-lg py-2 hover:bg-gray-50 transition"
        >
          <img
            src="https://www.svgrepo.com/show/355037/google.svg"
            alt="Google"
            className="h-5 w-5 mr-2"
          />
          <span className="font-medium text-gray-700">Sign In with Google</span>
        </button>
      </form>
    </Overlays>
  );
};

export default LoginPage;
