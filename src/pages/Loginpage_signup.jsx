import React, { useEffect, useRef } from 'react';
import loginSideImage from "../assets/Forloginfront.png";
import Mentarolgo from"../assets/mentarologo.png";



const LoginPage = ({ onClose, showSignup, switchToSignup }) => {
  const modalRef = useRef();

  // Close modal when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  return (
    <>
      {/* Background overlay with reduced opacity for better visibility */}
      <div className="fixed inset-0 bg-black bg-opacity-100 z-10"></div>

      {/* Modal container */}
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div
          ref={modalRef}
          className="bg-white rounded-xl shadow-2xl flex flex-col md:flex-row w-full max-w-2xl"
        >
          {/* Left: Image */}
          <div className="hidden md:block md:w-1/2 rounded-l-xl overflow-hidden">
            <img
              src={loginSideImage}
              alt="Login"
              className="object-cover h-full w-full"
            />
          </div>

          {/* Right: Form */}
          <div className="w-full md:w-1/2 p-8 flex flex-col justify-center">
            {/* Logo & Description */}
            <div className="flex items-center mb-2">
              <img src={Mentarolgo}/>
              <span className="font-bold text-lg text-gray-700">Menataro</span>
            </div>
            <p className="mb-4 text-gray-500 text-sm">
              Join us and get more benefits. We promise to keep your data safely.
            </p>

            {/* Tabs */}
            <div className="flex mb-6">
              <button
                className={`px-5 py-1 rounded-full font-medium mr-2 transition ${
                  !showSignup
                    ? 'bg-blue-500 text-white shadow'
                    : 'bg-blue-100 text-blue-600'
                }`}
                onClick={() => switchToSignup(false)}
              >
                Login
              </button>
              <button
                className={`px-5 py-1 rounded-full font-medium transition ${
                  showSignup
                    ? 'bg-blue-500 text-white shadow'
                    : 'bg-blue-100 text-blue-600'
                }`}
                onClick={() => switchToSignup(true)}
              >
                Register
              </button>
            </div>

            <form className="space-y-4">
              {showSignup && (
                <div>
                  <input
                    type="text"
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-700"
                    placeholder="Full Name"
                  />
                </div>
              )}
              <div>
                <input
                  type="email"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-700"
                  placeholder="Email Address"
                />
              </div>
              <div>
                <input
                  type="password"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-700"
                  placeholder="Password"
                />
              </div>
              {showSignup && (
                <div>
                  <input
                    type="password"
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-700"
                    placeholder="Confirm Password"
                  />
                </div>
              )}

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
                {showSignup ? 'Create' : 'Login'}
              </button>
            </form>

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
              <span className="font-medium text-gray-700">Sign Up with Google</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginPage;
