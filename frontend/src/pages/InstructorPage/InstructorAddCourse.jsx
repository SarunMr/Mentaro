
import React, { useState, useRef } from "react";
import {
  BookOpen, Plus, Video, FileText, Trash2, Save, X, UploadCloud, 
  Image, DollarSign, Clock, Target, CheckCircle
} from "lucide-react";
import { courseAPI, uploadAPI } from "../../utils/apiClient";
import toast from "react-hot-toast";

const categories = [
  "programming", "design", "business", "marketing", "photography", "music", "other",
];
const levels = ["beginner", "intermediate", "advanced"];

export default function InstructorAddCoursePage() {
  const [activeTab, setActiveTab] = useState("basic");
  const [newCourse, setNewCourse] = useState({
    title: "", description: "", category: "", level: "",
    price: "", originalPrice: "", thumbnail: null, previewVideo: null,
    requirements: [""], objectives: [""],
    chapters: [{
      id: Date.now(),
      title: "Introduction",
      lessons: [{
        id: Date.now() + 1,
        title: "",
        duration: "",
        videoUrl: "",
        videoFile: null,
        description: ""
      }]
    }],
  });

  // ----- Input Handlers -----
  const handleInputChange = (field, value) => setNewCourse((prev) => ({ ...prev, [field]: value }));
  const handleFileChange = (e, field) => setNewCourse((prev) => ({ ...prev, [field]: e.target.files[0] }));
  const handleArrayChange = (field, index, value) =>
    setNewCourse((prev) => ({
      ...prev,
      [field]: prev[field].map((item, i) => (i === index ? value : item)),
    }));
  const addArrayItem = (field) => setNewCourse((prev) => ({ ...prev, [field]: [...prev[field], ""] }));
  const removeArrayItem = (field, idx) =>
    setNewCourse((prev) => ({ ...prev, [field]: prev[field].filter((_, i) => i !== idx) }));

  // ----- Curriculum Handlers -----
  const addChapter = () => setNewCourse((prev) => ({
    ...prev,
    chapters: [...prev.chapters, {
      id: Date.now() + Math.random(),
      title: "",
      lessons: [{ id: Date.now() + Math.random(), title: "", duration: "", videoUrl: "", videoFile: null, description: "" }],
    }],
  }));
  const updateChapterTitle = (idx, value) =>
    setNewCourse((prev) => ({
      ...prev,
      chapters: prev.chapters.map((ch, cidx) => cidx === idx ? { ...ch, title: value } : ch),
    }));
  const removeChapter = (idx) => setNewCourse((prev) => ({
    ...prev,
    chapters: prev.chapters.filter((_, cidx) => cidx !== idx),
  }));

  const addLesson = (chIdx) =>
    setNewCourse((prev) => ({
      ...prev,
      chapters: prev.chapters.map((ch, cidx) =>
        cidx === chIdx
          ? { ...ch, lessons: [...ch.lessons, { id: Date.now() + Math.random(), title: "", duration: "", videoUrl: "", videoFile: null, description: "" }] }
          : ch),
    }));
  const updateLesson = (chIdx, lIdx, field, value) =>
    setNewCourse((prev) => ({
      ...prev,
      chapters: prev.chapters.map((ch, cidx) =>
        cidx === chIdx
          ? {
            ...ch, lessons: ch.lessons.map((les, lidx) =>
              lidx === lIdx ? { ...les, [field]: value } : les
            )
          }
          : ch),
    }));
  const removeLesson = (chIdx, lIdx) =>
    setNewCourse((prev) => ({
      ...prev,
      chapters: prev.chapters.map((ch, cidx) =>
        cidx === chIdx
          ? { ...ch, lessons: ch.lessons.filter((_, lidx) => lidx !== lIdx) }
          : ch),
    }));

  // Refs for file inputs
  const lessonVideoInputs = useRef({});
  const thumbnailInputRef = useRef(null);
  const previewVideoInputRef = useRef(null);

  // Tabs configuration
  const tabs = [
    { label: "Basic Info", key: "basic", icon: BookOpen },
    { label: "Curriculum", key: "curriculum", icon: Video },
  ];

  const nextTab = () => {
    const idx = tabs.findIndex((t) => t.key === activeTab);
    if (idx < tabs.length - 1) setActiveTab(tabs[idx + 1].key);
  };
  const prevTab = () => {
    const idx = tabs.findIndex((t) => t.key === activeTab);
    if (idx > 0) setActiveTab(tabs[idx - 1].key);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate required fields
    if (!newCourse.title || !newCourse.description || !newCourse.category || !newCourse.level || !newCourse.price) {
      toast.error("Please fill in all required fields");
      return;
    }
    
    // Validate chapters and lessons
    if (newCourse.chapters.length === 0) {
      toast.error("Please add at least one chapter");
      return;
    }
    
    for (let chapter of newCourse.chapters) {
      if (!chapter.title) {
        toast.error("Please provide titles for all chapters");
        return;
      }
      if (chapter.lessons.length === 0) {
        toast.error("Each chapter must have at least one lesson");
        return;
      }
      for (let lesson of chapter.lessons) {
        if (!lesson.title || !lesson.duration) {
          toast.error("Please provide title and duration for all lessons");
          return;
        }
      }
    }
    
    try {
      toast.loading("Creating course...");
      
      // Upload thumbnail if provided
      let thumbnailUrl = '';
      if (newCourse.thumbnail) {
        try {
          const thumbnailResponse = await uploadAPI.uploadThumbnail(newCourse.thumbnail);
          thumbnailUrl = thumbnailResponse.data.data.url;
        } catch (error) {
          console.error('Thumbnail upload failed:', error);
          toast.error('Failed to upload thumbnail');
          return;
        }
      }

      // Upload preview video if provided
      let previewVideoUrl = '';
      if (newCourse.previewVideo) {
        try {
          const previewVideoResponse = await uploadAPI.uploadVideo(newCourse.previewVideo);
          previewVideoUrl = previewVideoResponse.data.data.url;
        } catch (error) {
          console.error('Preview video upload failed:', error);
          toast.error('Failed to upload preview video');
          return;
        }
      }
      
      // Upload videos for lessons if provided
      const updatedChapters = await Promise.all(
        newCourse.chapters.map(async (chapter) => {
          const updatedLessons = await Promise.all(
            chapter.lessons.map(async (lesson) => {
              let videoUrl = lesson.videoUrl || '';
              
              if (lesson.videoFile) {
                try {
                  const videoResponse = await uploadAPI.uploadVideo(lesson.videoFile);
                  videoUrl = videoResponse.data.data.url;
                } catch (error) {
                  console.error('Video upload failed for lesson:', lesson.title, error);
                  toast.error(`Failed to upload video for lesson: ${lesson.title}`);
                  throw error;
                }
              }
              
              return {
                title: lesson.title,
                description: lesson.description || '',
                duration: parseInt(lesson.duration) || 0,
                videoUrl: videoUrl,
                isPreview: lesson.isPreview || false,
                resources: lesson.resources || []
              };
            })
          );
          
          return {
            title: chapter.title,
            description: chapter.description || '',
            lessons: updatedLessons
          };
        })
      );
      
      // Prepare course data for API
      const courseData = {
        title: newCourse.title,
        description: newCourse.description,
        category: newCourse.category,
        level: newCourse.level,
        price: parseFloat(newCourse.price),
        originalPrice: newCourse.originalPrice ? parseFloat(newCourse.originalPrice) : parseFloat(newCourse.price),
        thumbnail: thumbnailUrl,
        previewVideo: previewVideoUrl,
        requirements: newCourse.requirements.filter(req => req.trim() !== ""),
        objectives: newCourse.objectives.filter(obj => obj.trim() !== ""),
        chapters: updatedChapters
      };
      
      const response = await courseAPI.createCourse(courseData);
      
      if (response.data) {
        toast.dismiss();
        toast.success("Course created successfully!");
        
        // Reset form
        setNewCourse({
          title: "", description: "", category: "", level: "",
          price: "", originalPrice: "", thumbnail: null, previewVideo: null,
          requirements: [""], objectives: [""], 
          chapters: [{
            id: Date.now(),
            title: "Introduction",
            lessons: [{
              id: Date.now() + 1,
              title: "",
              duration: "",
              videoUrl: "",
              videoFile: null,
              description: ""
            }]
          }],
        });
        
        // Switch to basic tab
        setActiveTab("basic");
      }
    } catch (error) {
      toast.dismiss();
      console.error("Error creating course:", error);
      toast.error(error.response?.data?.message || "Failed to create course");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Create New Course</h1>
              <p className="text-gray-600">Build and publish your course content</p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="flex items-center justify-between mb-4">
            {tabs.map((tab, idx) => (
              <React.Fragment key={tab.key}>
                <div className="flex flex-col items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
                    activeTab === tab.key 
                      ? 'bg-blue-600 text-white' 
                      : tabs.findIndex(t => t.key === activeTab) > idx 
                        ? 'bg-green-500 text-white' 
                        : 'bg-gray-200 text-gray-500'
                  }`}>
                    {tabs.findIndex(t => t.key === activeTab) > idx ? (
                      <CheckCircle className="w-5 h-5" />
                    ) : (
                      <tab.icon className="w-5 h-5" />
                    )}
                  </div>
                  <span className={`text-sm font-medium ${
                    activeTab === tab.key ? 'text-blue-600' : 'text-gray-600'
                  }`}>
                    {tab.label}
                  </span>
                </div>
                {idx < tabs.length - 1 && (
                  <div className={`flex-1 h-1 mx-4 rounded ${
                    tabs.findIndex(t => t.key === activeTab) > idx ? 'bg-green-500' : 'bg-gray-200'
                  }`} />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Basic Info Tab */}
            {activeTab === "basic" && (
              <div className="space-y-6">
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Course Information</h2>
                  <p className="text-gray-600">Fill in the basic details about your course</p>
                </div>

                {/* Thumbnail and Preview Video Upload */}
                <div className="flex justify-center gap-6 mb-6">
                  {/* Thumbnail Upload */}
                  <div className="flex flex-col items-center">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Course Thumbnail *</label>
                    <div
                      className="w-48 h-32 bg-gray-100 border-2 border-dashed border-gray-300 rounded-xl flex items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors"
                      onClick={() => thumbnailInputRef.current?.click()}
                    >
                      {newCourse.thumbnail ? (
                        <img
                          src={URL.createObjectURL(newCourse.thumbnail)}
                          alt="Course thumbnail"
                          className="w-full h-full object-cover rounded-xl"
                        />
                      ) : (
                        <div className="text-center">
                          <Image className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                          <p className="text-sm text-gray-500">Upload Thumbnail</p>
                        </div>
                      )}
                    </div>
                    <input
                      ref={thumbnailInputRef}
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileChange(e, "thumbnail")}
                      className="hidden"
                    />
                  </div>

                  {/* Preview Video Upload */}
                  <div className="flex flex-col items-center">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Preview Video</label>
                    <div
                      className="w-48 h-32 bg-gray-100 border-2 border-dashed border-gray-300 rounded-xl flex items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors"
                      onClick={() => previewVideoInputRef.current?.click()}
                    >
                      {newCourse.previewVideo ? (
                        <div className="text-center">
                          <Video className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                          <p className="text-sm text-gray-700 font-medium">{newCourse.previewVideo.name}</p>
                          <p className="text-xs text-gray-500">Click to change</p>
                        </div>
                      ) : (
                        <div className="text-center">
                          <Video className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                          <p className="text-sm text-gray-500">Upload Preview Video</p>
                        </div>
                      )}
                    </div>
                    <input
                      ref={previewVideoInputRef}
                      type="file"
                      accept="video/*"
                      onChange={(e) => handleFileChange(e, "previewVideo")}
                      className="hidden"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Course Title *</label>
                    <input
                      type="text"
                      value={newCourse.title}
                      onChange={(e) => handleInputChange("title", e.target.value)}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                      placeholder="Enter course title"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
                    <select
                      value={newCourse.category}
                      onChange={(e) => handleInputChange("category", e.target.value)}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    >
                      <option value="">Select category</option>
                      {categories.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat.charAt(0).toUpperCase() + cat.slice(1)}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Level *</label>
                    <select
                      value={newCourse.level}
                      onChange={(e) => handleInputChange("level", e.target.value)}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    >
                      <option value="">Select level</option>
                      {levels.map((level) => (
                        <option key={level} value={level}>
                          {level.charAt(0).toUpperCase() + level.slice(1)}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Price ($) *</label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="number"
                        value={newCourse.price}
                        onChange={(e) => handleInputChange("price", e.target.value)}
                        required
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                        placeholder="0.00"
                        min="0"
                        step="0.01"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Original Price ($)</label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="number"
                        value={newCourse.originalPrice}
                        onChange={(e) => handleInputChange("originalPrice", e.target.value)}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                        placeholder="0.00"
                        min="0"
                        step="0.01"
                      />
                    </div>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
                    <textarea
                      value={newCourse.description}
                      onChange={(e) => handleInputChange("description", e.target.value)}
                      required
                      rows={4}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                      placeholder="Describe your course"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Requirements</label>
                    <div className="space-y-2">
                      {newCourse.requirements.map((req, idx) => (
                        <div key={idx} className="flex gap-2">
                          <input
                            value={req}
                            onChange={(e) => handleArrayChange("requirements", idx, e.target.value)}
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                            placeholder="Enter requirement"
                          />
                          <button
                            type="button"
                            onClick={() => removeArrayItem("requirements", idx)}
                            className="px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={() => addArrayItem("requirements")}
                        className="flex items-center gap-2 px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                      >
                        <Plus className="w-4 h-4" /> Add Requirement
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Learning Objectives</label>
                    <div className="space-y-2">
                      {newCourse.objectives.map((obj, idx) => (
                        <div key={idx} className="flex gap-2">
                          <input
                            value={obj}
                            onChange={(e) => handleArrayChange("objectives", idx, e.target.value)}
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                            placeholder="Enter objective"
                          />
                          <button
                            type="button"
                            onClick={() => removeArrayItem("objectives", idx)}
                            className="px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={() => addArrayItem("objectives")}
                        className="flex items-center gap-2 px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                      >
                        <Plus className="w-4 h-4" /> Add Objective
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Curriculum Tab */}
            {activeTab === "curriculum" && (
              <div className="space-y-6">
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Course Curriculum</h2>
                  <p className="text-gray-600">Organize your content into chapters and lessons</p>
                </div>

                <div className="space-y-6">
                  {newCourse.chapters.map((chapter, chIdx) => (
                    <div key={chapter.id} className="border border-gray-200 rounded-xl p-6 bg-gray-50">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                          {chIdx + 1}
                        </div>
                        <input
                          value={chapter.title}
                          onChange={e => updateChapterTitle(chIdx, e.target.value)}
                          placeholder={`Chapter ${chIdx + 1} Title`}
                          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none font-medium"
                        />
                        <button
                          type="button"
                          onClick={() => removeChapter(chIdx)}
                          className="px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="space-y-4">
                        {chapter.lessons.map((lesson, lIdx) => (
                          <div key={lesson.id} className="bg-white rounded-lg p-4 border border-gray-200">
                            <div className="flex items-center justify-between mb-3">
                              <h4 className="font-medium text-gray-900">Lesson {lIdx + 1}</h4>
                              <button
                                type="button"
                                onClick={() => removeLesson(chIdx, lIdx)}
                                className="px-2 py-1 bg-red-50 text-red-600 rounded hover:bg-red-100 transition-colors"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                              <input
                                value={lesson.title}
                                onChange={e => updateLesson(chIdx, lIdx, "title", e.target.value)}
                                placeholder="Lesson title"
                                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                                required
                              />
                              <div className="relative">
                                <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input
                                  value={lesson.duration}
                                  onChange={e => updateLesson(chIdx, lIdx, "duration", e.target.value)}
                                  placeholder="Duration (e.g., 10 min)"
                                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                                />
                              </div>
                            </div>

                            <div
                              className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-blue-400 transition-colors mb-4"
                              onClick={() => lessonVideoInputs.current[`${chIdx}-${lIdx}`]?.click()}
                            >
                              <UploadCloud className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                              <p className="text-sm font-medium text-gray-600">
                                {lesson.videoFile ? lesson.videoFile.name : "Upload Video"}
                              </p>
                              <p className="text-xs text-gray-500">
                                {lesson.videoFile ? "Click to change" : "Select video file"}
                              </p>
                              <input
                                ref={el => lessonVideoInputs.current[`${chIdx}-${lIdx}`] = el}
                                type="file"
                                accept="video/*"
                                onChange={e => updateLesson(chIdx, lIdx, "videoFile", e.target.files[0])}
                                className="hidden"
                              />
                            </div>

                            <textarea
                              value={lesson.description}
                              onChange={e => updateLesson(chIdx, lIdx, "description", e.target.value)}
                              placeholder="Lesson description"
                              rows={3}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                            />
                          </div>
                        ))}

                        <button
                          type="button"
                          onClick={() => addLesson(chIdx)}
                          className="w-full px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors font-medium"
                        >
                          <Plus className="w-4 h-4 inline mr-2" /> Add Lesson
                        </button>
                      </div>
                    </div>
                  ))}

                  <button
                    type="button"
                    onClick={addChapter}
                    className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                  >
                    <Plus className="w-5 h-5 inline mr-2" /> Add Chapter
                  </button>
                </div>
              </div>
            )}



            {/* Navigation */}
            <div className="flex justify-between items-center pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={prevTab}
                disabled={activeTab === "basic"}
                className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              
              <div className="text-sm text-gray-600">
                Step {tabs.findIndex(t => t.key === activeTab) + 1} of {tabs.length}
              </div>

              {activeTab !== "curriculum" ? (
                <button
                  type="button"
                  onClick={nextTab}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  Next
                </button>
              ) : (
                <button
                  type="submit"
                  className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                >
                  <Save className="w-4 h-4" />
                  Create Course
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
