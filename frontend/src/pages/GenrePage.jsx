import React, { useRef, useState, useEffect } from 'react';
import design from "./../assets/images/Design.png";
import programming from "./../assets/images/Programming.png";
import finance from "./../assets/images/Finance.png";
import marketing from "./../assets/images/Marketing.png";
import music from "./../assets/images/Music.png";
import writing from "./../assets/images/Writing.png";
import film from "./../assets/images/Film.png";
import photography from "./../assets/images/Photography.png";

const categories = [
  { label: 'Design', img: design },
  { label: 'Programming', img: programming },
  { label: 'Finance', img: finance },
  { label: 'Marketing', img: marketing },
  { label: 'Music', img: music },
  { label: 'Writing', img: writing },
  { label: 'Film', img: film },
  { label: 'Photography', img: photography },
];

const CategorySelectorModal = ({ onClose }) => {
  const [selected, setSelected] = useState([]);
  const modalRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  const toggleCategory = (label) => {
    setSelected((prev) => {
      if (prev.includes(label)) {
        return prev.filter((item) => item !== label);
      } else if (prev.length < 3) {
        return [...prev, label];
      } else {
        return prev;
      }
    });
  };

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black bg-opacity-40" />
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div
          ref={modalRef}
          className="bg-white shadow-2xl w-full max-w-3xl p-6 rounded-lg"
        >
          <h2 className="text-xl font-semibold text-center mb-6">
            Pick 3 categories you want to explore
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 px-2 md:px-6">
            {categories.map((cat) => (
              <div
                key={cat.label}
                onClick={() => toggleCategory(cat.label)}
                className={`relative cursor-pointer border-2 overflow-hidden transition-all duration-200 rounded-md ${
                  selected.includes(cat.label)
                    ? 'border-blue-600 shadow-lg scale-105'
                    : 'border-gray-200'
                }`}
              >
                <img
                  src={cat.img}
                  alt={cat.label}
                  className="w-full h-24 object-cover"
                />
                <div className="absolute bottom-2 left-2 text-white text-sm font-medium drop-shadow">
                  {cat.label}
                </div>

                {selected.includes(cat.label) && (
                  <div className="absolute top-2 right-2 w-5 h-5 bg-blue-600 text-white text-xs flex items-center justify-center rounded-full">
                    ✓
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="mt-6 text-center">
            <button
              disabled={selected.length !== 3}
              onClick={() => {
                console.log('Selected:', selected);
                onClose();
              }}
              className={`px-6 py-2 font-medium text-white rounded transition ${
                selected.length === 3
                  ? 'bg-blue-600 hover:bg-blue-700'
                  : 'bg-blue-400 cursor-not-allowed'
              }`}
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default CategorySelectorModal;
