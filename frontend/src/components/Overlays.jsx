// Overlays.jsx
import React, { useRef, useEffect } from 'react';

const Overlays = ({ onClose, leftImage, children }) => {
  const modalRef = useRef();

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
      <div
        className="fixed inset-0 z-40"
        style={{ backgroundColor: 'rgba(0, 0, 0, 0.4)' }}
      ></div>
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div
          ref={modalRef}
          className="bg-white rounded-xl shadow-2xl flex flex-col md:flex-row w-full max-w-2xl relative"
        >
          {/* Left: Image */}
          <div className="hidden md:block md:w-1/2 rounded-l-xl overflow-hidden">
            <img
              src={leftImage}
              alt="Modal Visual"
              className="object-cover h-full w-full"
            />
          </div>
          {/* Right: Content */}
          <div className="w-full md:w-1/2 p-8 flex flex-col justify-center relative">
            {/* Close (X) Button */}
            <button
              onClick={onClose}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 text-3xl focus:outline-none"
              aria-label="Close"
              type="button"
            >
              {/* SVG Cross Icon */}
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
            {children}
          </div>
        </div>
      </div>
    </>
  );
};

export default Overlays;
