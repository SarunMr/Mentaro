import React, { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ReactPlayer from 'react-player';
import { toast } from 'react-hot-toast';
import { courseAPI } from '../../utils/apiClient.js';
import { getVideoUrl } from '../../utils/imageUtils.js';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  Maximize,
  Settings,
  BookOpen,
  Clock,
  CheckCircle,
  Lock,
  Download,
  FileText,
  ArrowLeft,
  ChevronDown,
  ChevronRight
} from 'lucide-react';

const CourseWatch = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const playerRef = useRef(null);
  
  // State management
  const [course, setCourse] = useState(null);
  const [enrollment, setEnrollment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentChapter, setCurrentChapter] = useState(0);
  const [currentLesson, setCurrentLesson] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [volume, setVolume] = useState(0.8);
  const [muted, setMuted] = useState(false);
  const [played, setPlayed] = useState(0);
  const [duration, setDuration] = useState(0);
  const [seeking, setSeeking] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [showControls, setShowControls] = useState(true);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [expandedChapters, setExpandedChapters] = useState(new Set([0]));

  // Fetch course data and enrollment details
  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        setLoading(true);
        
        // Fetch course details
        const courseResponse = await courseAPI.getCourseById(courseId);
        if (!courseResponse.data.isEnrolled) {
          toast.error('You are not enrolled in this course');
          navigate('/courses');
          return;
        }
        
        setCourse(courseResponse.data.course);
        
        // Fetch enrollment progress
        const progressResponse = await courseAPI.getCourseProgress(courseId);
        setEnrollment(progressResponse.data.enrollment);
        
        // Set initial lesson based on last accessed or first lesson
        const lastAccessed = progressResponse.data.enrollment.lastAccessedLesson;
        if (lastAccessed && lastAccessed.chapter && lastAccessed.lesson) {
          const chapterIndex = courseResponse.data.course.chapters.findIndex(
            ch => ch._id === lastAccessed.chapter
          );
          const lessonIndex = courseResponse.data.course.chapters[chapterIndex]?.lessons.findIndex(
            lesson => lesson._id === lastAccessed.lesson
          );
          
          if (chapterIndex >= 0 && lessonIndex >= 0) {
            setCurrentChapter(chapterIndex);
            setCurrentLesson(lessonIndex);
          }
        }
        
      } catch (error) {
        console.error('Error fetching course data:', error);
        setError('Failed to load course data');
        toast.error('Failed to load course data');
      } finally {
        setLoading(false);
      }
    };
    
    if (courseId) {
      fetchCourseData();
    }
  }, [courseId, navigate]);

  // Get current lesson
  const getCurrentLesson = () => {
    if (!course?.chapters[currentChapter]) return null;
    return course.chapters[currentChapter].lessons[currentLesson];
  };

  // Navigation functions
  const goToNextLesson = () => {
    const currentChapterLessons = course.chapters[currentChapter].lessons;
    if (currentLesson < currentChapterLessons.length - 1) {
      setCurrentLesson(currentLesson + 1);
    } else if (currentChapter < course.chapters.length - 1) {
      setCurrentChapter(currentChapter + 1);
      setCurrentLesson(0);
      setExpandedChapters(prev => new Set([...prev, currentChapter + 1]));
    }
    setPlayed(0);
  };

  const goToPreviousLesson = () => {
    if (currentLesson > 0) {
      setCurrentLesson(currentLesson - 1);
    } else if (currentChapter > 0) {
      const prevChapter = currentChapter - 1;
      setCurrentChapter(prevChapter);
      setCurrentLesson(course.chapters[prevChapter].lessons.length - 1);
      setExpandedChapters(prev => new Set([...prev, prevChapter]));
    }
    setPlayed(0);
  };

  const selectLesson = async (chapterIndex, lessonIndex) => {
    setCurrentChapter(chapterIndex);
    setCurrentLesson(lessonIndex);
    setPlayed(0);
    setExpandedChapters(prev => new Set([...prev, chapterIndex]));
    
    // Update last accessed lesson
    if (enrollment && course) {
      try {
        const chapter = course.chapters[chapterIndex];
        const lesson = chapter.lessons[lessonIndex];
        
        await courseAPI.updateLastAccessedLesson(enrollment._id, {
          chapterId: chapter._id,
          lessonId: lesson._id
        });
      } catch (error) {
        console.error('Error updating last accessed lesson:', error);
      }
    }
  };

  // Mark lesson as completed
  const markLessonCompleted = async (chapterIndex, lessonIndex) => {
    const currentLessonData = getCurrentLesson();
    if (!currentLessonData || !enrollment) return;
    
    try {
      const watchTime = Math.floor(played * (currentLessonData.duration || 0));
      
      await courseAPI.markLessonComplete(enrollment._id, currentLessonData._id, {
        watchTime
      });
      
      // Update local state
      const updatedEnrollment = { ...enrollment };
      const existingLesson = updatedEnrollment.completedLessons?.find(
        cl => cl.lesson === currentLessonData._id
      );
      
      if (!existingLesson) {
        updatedEnrollment.completedLessons = [
          ...(updatedEnrollment.completedLessons || []),
          {
            lesson: currentLessonData._id,
            completedAt: new Date(),
            watchTime
          }
        ];
      }
      
      setEnrollment(updatedEnrollment);
      toast.success('Lesson marked as complete!');
      
    } catch (error) {
      console.error('Error marking lesson complete:', error);
      toast.error('Failed to mark lesson as complete');
    }
  };

  // Video player event handlers
  const handleProgress = (state) => {
    if (!seeking) {
      setPlayed(state.played);
      
      // Auto-mark lesson as completed when 90% watched
      if (state.played > 0.9) {
        markLessonCompleted(currentChapter, currentLesson);
      }
    }
  };

  const handleSeekMouseDown = () => {
    setSeeking(true);
  };

  const handleSeekChange = (e) => {
    const newPlayed = parseFloat(e.target.value);
    setPlayed(newPlayed);
    if (playerRef.current) {
      playerRef.current.currentTime = newPlayed * duration;
    }
  };

  const handleSeekMouseUp = (e) => {
     setSeeking(false);
     const newPlayed = parseFloat(e.target.value);
     if (playerRef.current) {
       playerRef.current.currentTime = newPlayed * duration;
     }
   };

   useEffect(() => {
     if (playerRef.current) {
       if (playing) {
         playerRef.current.play();
       } else {
         playerRef.current.pause();
       }
     }
   }, [playing]);

   useEffect(() => {
     if (playerRef.current) {
       playerRef.current.volume = volume;
     }
   }, [volume]);

   useEffect(() => {
     if (playerRef.current) {
       playerRef.current.muted = muted;
     }
   }, [muted]);

   useEffect(() => {
     if (playerRef.current) {
       playerRef.current.playbackRate = playbackRate;
     }
   }, [playbackRate]);





  const toggleChapterExpansion = (chapterIndex) => {
    setExpandedChapters(prev => {
      const newSet = new Set(prev);
      if (newSet.has(chapterIndex)) {
        newSet.delete(chapterIndex);
      } else {
        newSet.add(chapterIndex);
      }
      return newSet;
    });
  };

  const formatTime = (seconds) => {
    const date = new Date(seconds * 1000);
    const hh = date.getUTCHours();
    const mm = date.getUTCMinutes();
    const ss = date.getUTCSeconds().toString().padStart(2, '0');
    if (hh) {
      return `${hh}:${mm.toString().padStart(2, '0')}:${ss}`;
    }
    return `${mm}:${ss}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-900">Loading course...</p>
        </div>
      </div>
    );
  }
  
  if (error || !course) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Course not found</h2>
          <p className="text-gray-600 mb-4">{error || 'The requested course could not be loaded.'}</p>
          <button 
            onClick={() => navigate('/courses')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Back to Courses
          </button>
        </div>
      </div>
    );
  }

  const currentLessonData = getCurrentLesson();
  const isLessonCompleted = (chapterIndex, lessonIndex) => {
    if (!course?.chapters[chapterIndex]?.lessons[lessonIndex] || !enrollment?.completedLessons) {
      return false;
    }
    
    const lessonId = course.chapters[chapterIndex].lessons[lessonIndex]._id;
    return enrollment.completedLessons.some(cl => cl.lesson === lessonId);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className={`bg-white border-r border-gray-200 transition-all duration-300 ${sidebarCollapsed ? 'w-0' : 'w-80'} overflow-hidden shadow-sm`}>
        <div className="p-4 border-b border-gray-200">
          <button
            onClick={() => navigate('/my-courses')}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to My Courses
          </button>
          <h2 className="text-gray-900 font-semibold text-lg truncate">{course.title}</h2>
          <p className="text-gray-600 text-sm">{course.instructor?.firstName} {course.instructor?.lastName}</p>
        </div>
        
        <div className="overflow-y-auto h-full pb-20">
          {course.chapters.map((chapter, chapterIndex) => (
            <div key={chapterIndex} className="border-b border-gray-200">
              <button
                onClick={() => toggleChapterExpansion(chapterIndex)}
                className="w-full p-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
              >
                <span className="text-gray-900 font-medium">{chapter.title}</span>
                {expandedChapters.has(chapterIndex) ? (
                  <ChevronDown className="w-4 h-4 text-gray-600" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-gray-600" />
                )}
              </button>
              
              {expandedChapters.has(chapterIndex) && (
                <div className="bg-gray-50">
                  {chapter.lessons.map((lesson, lessonIndex) => {
                      const isActive = chapterIndex === currentChapter && lessonIndex === currentLesson;
                      const isCompleted = isLessonCompleted(chapterIndex, lessonIndex);
                      
                      return (
                        <button
                          key={`${chapterIndex}-${lessonIndex}-${lesson.id}`}
                          onClick={() => selectLesson(chapterIndex, lessonIndex)}
                          className={`w-full p-3 pl-8 text-left flex items-center space-x-3 hover:bg-gray-100 transition-colors ${
                            isActive ? 'bg-blue-50 border-r-2 border-blue-500' : ''
                          }`}
                        >
                        <div className="flex-shrink-0">
                          {isCompleted ? (
                            <CheckCircle className="w-4 h-4 text-green-500" />
                          ) : lesson.isPreview ? (
                            <Play className="w-4 h-4 text-gray-600" />
                          ) : (
                            <Lock className="w-4 h-4 text-gray-400" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={`text-sm font-medium truncate ${
                            isActive ? 'text-blue-700' : 'text-gray-900'
                          }`}>
                            {lesson.title}
                          </p>
                          <p className={`text-xs flex items-center ${
                            isActive ? 'text-blue-600' : 'text-gray-500'
                          }`}>
                            <Clock className="w-3 h-3 mr-1" />
                            {lesson.duration}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-white p-4 flex items-center justify-between border-b border-gray-200 shadow-sm">
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="text-gray-600 hover:text-gray-900"
          >
            <BookOpen className="w-5 h-5" />
          </button>
          
          <div className="flex-1 mx-4">
            <h1 className="text-gray-900 font-semibold truncate">
              {currentLessonData?.title}
            </h1>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={goToPreviousLesson}
              disabled={currentChapter === 0 && currentLesson === 0}
              className="p-2 text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <SkipBack className="w-5 h-5" />
            </button>
            <button
              onClick={goToNextLesson}
              disabled={currentChapter === course.chapters.length - 1 && 
                       currentLesson === course.chapters[currentChapter].lessons.length - 1}
              className="p-2 text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <SkipForward className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Video Player */}
        <div className="flex-1 bg-black relative flex items-center justify-center p-8">
          <div className="relative bg-black rounded-lg overflow-hidden mx-auto" style={{ aspectRatio: '16/9', maxWidth: '800px', width: '100%' }}>
          {currentLessonData && (() => {
              const videoUrl = getVideoUrl(currentLessonData.videoUrl);
              console.log('Video URL:', videoUrl);
              console.log('Raw videoUrl:', currentLessonData.videoUrl);
              return (
                <div className="relative w-full h-full">
                  <div className="absolute top-2 left-2 bg-black bg-opacity-75 text-white p-2 rounded z-10 text-xs">
                    <div>Video URL: {videoUrl}</div>
                    <div>Playing: {playing ? 'Yes' : 'No'}</div>
                    <div>Volume: {volume}</div>
                  </div>
                  <video
                    ref={playerRef}
                    src={videoUrl}
                    width="100%"
                    height="100%"
                    style={{ position: 'absolute', top: 0, left: 0 }}
                    crossOrigin="anonymous"
                    preload="auto"
                    onTimeUpdate={(e) => {
                      const currentTime = e.target.currentTime;
                      const videoDuration = e.target.duration;
                      if (videoDuration) {
                        setDuration(videoDuration);
                        handleProgress({
                          played: currentTime / videoDuration,
                          playedSeconds: currentTime,
                          loaded: e.target.buffered.length > 0 ? e.target.buffered.end(0) / videoDuration : 0,
                          loadedSeconds: e.target.buffered.length > 0 ? e.target.buffered.end(0) : 0
                        });
                      }
                    }}
                    onEnded={goToNextLesson}
                    onError={(error) => {
                      console.error('Video error:', error);
                      console.error('Failed URL:', videoUrl);
                      toast.error('Error loading video');
                    }}
                    onLoadedData={() => console.log('Video ready')}
                  >
                    <source src={videoUrl} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                 </div>
                );
              })()}
          
          {!currentLessonData && (
            <div className="flex items-center justify-center h-full text-white">
              <p>No lesson data available</p>
            </div>
          )}
          </div>
          
          {/* Custom Controls Overlay */}
          {showControls && (
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-white/90 to-transparent p-4">
              {/* Progress Bar */}
              <div className="mb-4">
                <input
                  type="range"
                  min={0}
                  max={0.999999}
                  step="any"
                  value={played}
                  onMouseDown={handleSeekMouseDown}
                  onChange={handleSeekChange}
                  onMouseUp={handleSeekMouseUp}
                  className="w-full h-1 bg-gray-300 rounded-lg appearance-none cursor-pointer slider accent-blue-500"
                />
                <div className="flex justify-between text-xs text-gray-700 mt-1">
                  <span>{formatTime(duration * played)}</span>
                  <span>{formatTime(duration)}</span>
                </div>
              </div>
              
              {/* Control Buttons */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => setPlaying(!playing)}
                    className="text-gray-800 hover:text-gray-600"
                  >
                    {playing ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
                  </button>
                  
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setMuted(!muted)}
                      className="text-gray-800 hover:text-gray-600"
                    >
                      {muted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                    </button>
                    <input
                      type="range"
                      min={0}
                      max={1}
                      step={0.1}
                      value={volume}
                      onChange={(e) => setVolume(parseFloat(e.target.value))}
                      className="w-20 h-1 bg-gray-300 rounded-lg appearance-none cursor-pointer accent-blue-500"
                    />
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <select
                    value={playbackRate}
                    onChange={(e) => setPlaybackRate(parseFloat(e.target.value))}
                    className="bg-white border border-gray-300 text-gray-800 text-sm rounded px-2 py-1"
                  >
                    <option value={0.5}>0.5x</option>
                    <option value={0.75}>0.75x</option>
                    <option value={1}>1x</option>
                    <option value={1.25}>1.25x</option>
                    <option value={1.5}>1.5x</option>
                    <option value={2}>2x</option>
                  </select>
                  
                  <button className="text-gray-800 hover:text-gray-600">
                    <Settings className="w-5 h-5" />
                  </button>
                  
                  <button className="text-gray-800 hover:text-gray-600">
                    <Maximize className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Lesson Info */}
        <div className="bg-white p-6 border-t border-gray-200">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                {currentLessonData?.title}
              </h2>
              <p className="text-gray-600 mb-4">
                {currentLessonData?.description}
              </p>
              
              {/* Resources */}
              {currentLessonData?.resources && currentLessonData.resources.length > 0 && (
                <div className="mb-4">
                  <h3 className="text-gray-900 font-medium mb-2">Resources</h3>
                  <div className="space-y-2">
                    {currentLessonData.resources.map((resource, index) => (
                      <a
                        key={`resource-${index}-${resource.title}`}
                        href={resource.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center space-x-2 text-blue-600 hover:text-blue-700"
                      >
                        <FileText className="w-4 h-4" />
                        <span>{resource.title}</span>
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            <div className="ml-6">
              <button
                onClick={() => markLessonCompleted(currentChapter, currentLesson)}
                disabled={isLessonCompleted(currentChapter, currentLesson)}
                className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                  isLessonCompleted(currentChapter, currentLesson)
                    ? 'bg-green-100 text-green-700 border border-green-200 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                }`}
              >
                {isLessonCompleted(currentChapter, currentLesson) ? (
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4" />
                    <span>Completed</span>
                  </div>
                ) : (
                  'Mark Complete'
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseWatch;