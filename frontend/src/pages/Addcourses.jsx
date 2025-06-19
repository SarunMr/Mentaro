import React, { useState } from 'react';
import MentaroFooter from '../components/Mentarofooter.jsx';
import { FiEdit, FiTrash2 } from 'react-icons/fi';

export default function Course() {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOption, setSortOption] = useState('Newest');
  const [chapters, setChapters] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('chapter');
  const [modalInput, setModalInput] = useState('');
  const [selectedChapterIndex, setSelectedChapterIndex] = useState(null);
  const [selectedLectureIndex, setSelectedLectureIndex] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  const openModal = (type, chapterIndex = null, lectureIndex = null) => {
    setModalType(type);
    setSelectedChapterIndex(chapterIndex);
    setSelectedLectureIndex(lectureIndex);
    setIsEditing(lectureIndex !== null || (type === 'chapter' && chapterIndex !== null));

    if (type === 'chapter' && chapterIndex !== null && chapters[chapterIndex]) {
      setModalInput(chapters[chapterIndex].title);
    } else if (type === 'lecture' && chapterIndex !== null && lectureIndex !== null) {
      setModalInput(chapters[chapterIndex].lectures[lectureIndex]);
    } else {
      setModalInput('');
    }

    setShowModal(true);
  };

  const handleModalSubmit = () => {
    if (!modalInput.trim()) return;

    setChapters(prev => {
      const updated = [...prev];

      if (modalType === 'chapter') {
        if (isEditing && selectedChapterIndex !== null) {
          updated[selectedChapterIndex] = {
            ...updated[selectedChapterIndex],
            title: modalInput,
          };
        } else {
          updated.push({ title: modalInput, lectures: [] });
        }
      }

      if (modalType === 'lecture' && selectedChapterIndex !== null) {
        const chapter = updated[selectedChapterIndex];

        if (isEditing && selectedLectureIndex !== null) {
          updated[selectedChapterIndex] = {
            ...chapter,
            lectures: chapter.lectures.map((lec, i) =>
              i === selectedLectureIndex ? modalInput : lec
            ),
          };
        } else {
          updated[selectedChapterIndex] = {
            ...chapter,
            lectures: [...chapter.lectures, modalInput],
          };
        }
      }

      return updated;
    });

    setShowModal(false);
    setIsEditing(false);
    setSelectedChapterIndex(null);
    setSelectedLectureIndex(null);
    setModalInput('');
  };

  const handleDeleteChapter = (chapterIndex) => {
    if (confirm('Are you sure you want to delete this chapter?')) {
      setChapters(prev => prev.filter((_, i) => i !== chapterIndex));
    }
  };

  const handleDeleteLecture = (chapterIndex, lectureIndex) => {
    if (confirm('Are you sure you want to delete this lecture?')) {
      setChapters(prev => {
        const updated = [...prev];
        const chapter = updated[chapterIndex];
        updated[chapterIndex] = {
          ...chapter,
          lectures: chapter.lectures.filter((_, i) => i !== lectureIndex),
        };
        return updated;
      });
    }
  };

  const filteredChapters = chapters.filter(ch =>
    ch.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">

      <main className="flex-grow container mx-auto px-4 py-10">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold text-gray-800">Courses</h2>
          <button
            onClick={() => alert('Add Course')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg font-medium"
          >
            Add Course
          </button>
        </div>

        {/* Search and Sort */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
          <div className="flex items-center border rounded-lg px-3 py-2 w-full md:w-1/3 bg-white">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search your course"
              className="w-full outline-none text-sm"
            />
            <button>
              <svg
                className="w-4 h-4 text-gray-400 ml-2"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 1 0 5 11a6 6 0 0 0 12 0z" />
              </svg>
            </button>
          </div>

          <select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
            className="px-4 py-2 border rounded-lg bg-white text-sm text-gray-700 w-full md:w-auto"
          >
            <option>Newest</option>
            <option>Oldest</option>
          </select>
        </div>

        {/* Chapters */}
        {filteredChapters.map((chapter, chapterIndex) => (
          <div key={chapterIndex} className="bg-white rounded-xl shadow-md p-6 border mb-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-bold text-gray-800">{chapter.title}</h3>
                <div className="text-sm text-gray-600 mt-1">
                  Lecture: <span className="font-medium">{chapter.lectures.length}</span> &nbsp;|&nbsp; Duration: <span className="font-medium">0hrs</span>
                </div>
              </div>
              <div className="flex space-x-3">
                <button onClick={() => openModal('chapter', chapterIndex)} className="text-blue-600 hover:text-blue-800">
                  <FiEdit size={18} />
                </button>
                <button onClick={() => handleDeleteChapter(chapterIndex)} className="text-red-500 hover:text-red-700">
                  <FiTrash2 size={18} />
                </button>
              </div>
            </div>

            {/* Lectures */}
            <div className="space-y-2 mb-4">
              {chapter.lectures.map((lecture, lectureIndex) => (
                <div key={lectureIndex} className="px-4 py-2 border rounded text-sm text-gray-700 flex justify-between items-center">
                  <span>{lecture}</span>
                  <div className="space-x-2 text-sm">
                    <button onClick={() => openModal('lecture', chapterIndex, lectureIndex)} className="text-blue-600 hover:underline">Edit</button>
                    <button onClick={() => handleDeleteLecture(chapterIndex, lectureIndex)} className="text-red-500 hover:underline">Delete</button>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={() => openModal('lecture', chapterIndex)}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm"
            >
              + Add Lecture
            </button>
          </div>
        ))}

        {/* Add Chapter */}
        <div className="text-center">
          <button
            onClick={() => openModal('chapter')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg text-sm"
          >
            + Add Chapter
          </button>
        </div>
      </main>

      <MentaroFooter />

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
          <div className="bg-white p-6 rounded-lg shadow-md text-center w-80 border pointer-events-auto">
            <h2 className="text-lg font-semibold mb-4 text-gray-800">
              {modalType === 'chapter'
                ? isEditing ? 'Edit Chapter Name' : 'Enter Chapter Name'
                : isEditing ? 'Edit Lecture Name' : 'Enter Lecture Name'}
            </h2>
            <input
              type="text"
              value={modalInput}
              onChange={(e) => setModalInput(e.target.value)}
              className="w-full px-4 py-2 border border-blue-500 rounded-md text-center font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder={modalType === 'chapter' ? 'Chapter Title' : 'Lecture Title'}
            />
            <button
              onClick={handleModalSubmit}
              className="mt-5 border border-blue-500 text-blue-600 hover:bg-blue-100 px-6 py-2 rounded-md font-semibold"
            >
              {isEditing ? 'Update' : 'Submit'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
