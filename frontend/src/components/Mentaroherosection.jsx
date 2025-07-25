
import React from "react";
import { useNavigate } from "react-router-dom";
import editorImg from "./../assets/images/editor.png"; // Make sure this path is correct


export default function Hero(){
  const navigate = useNavigate();
  
  return (
    <section className="bg-yellow-300 min-h-screen flex items-center justify-center px-8">
      <div className="max-w-7xl w-full flex flex-col-reverse md:flex-row items-center justify-between">
        {/* Left Text and Buttons */}
        <div className="md:w-1/2 text-center md:text-left space-y-6">
          <h1 className="text-4xl font-bold text-black">
            Learn something new <br /> everyday.
          </h1>
          <p className="text-lg text-yellow-500">
            Become professionals and ready to join the world.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-4">
            <button 
              onClick={() => navigate('/courses')}
              className="bg-white text-blue-600 font-semibold px-6 py-3 rounded-full shadow-md hover:bg-blue-50"
            >
              Browse Course
            </button>
            <button className="bg-blue-600 text-white font-semibold px-6 py-3 rounded-full shadow-md hover:bg-blue-700">
              Start make your account
            </button>
          </div>
        </div>

        {/* Right Image */}
        <div className="md:w-1/2 mb-10 md:mb-0">
          <img src={editorImg} alt="Editor" className="w-full max-w-md mx-auto" />
        </div>
      </div>
    </section>
  );
}
