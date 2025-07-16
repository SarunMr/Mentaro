import React, { useState } from 'react';
import { FiUpload, FiX, FiBell } from 'react-icons/fi';
import MentaroFooter from '../components/Mentarofooter.jsx';
import girlAvatar from '../assets/images/girl.png';

export default function UploadPage() {
  const [files, setFiles] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles(prevFiles => [...prevFiles, ...selectedFiles]);
  };

  const removeFile = (index) => {
    setFiles(prevFiles => prevFiles.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsUploading(true);
    
    // TODO: Implement actual file upload logic here
    try {
      // Simulate upload delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      console.log('Uploading files:', files);
      console.log('Title:', title);
      console.log('Description:', description);
      console.log('Category:', category);
      
      // Reset form after successful upload
      setFiles([]);
      setTitle('');
      setDescription('');
      setCategory('');
      alert('Upload successful!');
    } catch (error) {
      console.error('Upload failed:', error);
      alert('Upload failed. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="flex justify-end items-center px-4 py-3 bg-white shadow-sm">
        <span className="text-gray-700 font-medium mr-4">Student</span>
        <FiBell className="h-6 w-6 text-gray-500 mr-4" />
        <img
        src={ girlAvatar} // Placeholder for avatar image
          alt="User Avatar"
          className="h-10 w-10 rounded-full"
        />
      </header>
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Add Courses</h1>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title Input */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                Course Title
              </label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter a title for your content"
                required
              />
            </div>

            {/* Description Input */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Course Description
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows="4"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Describe your content"
                required
              />
            </div>

            {/* Category Selection */}
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                Course Category
              </label>
              <select
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="">Select a category</option>
                <option value="programming">Programming</option>
                <option value="design">Design</option>
                <option value="business">Business</option>
                <option value="marketing">Marketing</option>
                <option value="music">Music</option>
              </select>
            </div>

            {/* File Upload Area */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Files
              </label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg">
                <div className="space-y-1 text-center">
                  <FiUpload className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="flex text-sm text-gray-600">
                    <label
                      htmlFor="file-upload"
                      className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
                    >
                      <span>Upload files</span>
                      <input
                        id="file-upload"
                        name="file-upload"
                        type="file"
                        multiple
                        className="sr-only"
                        onChange={handleFileChange}
                      />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs text-gray-500">
                    PNG, JPG, PDF up to 10MB
                  </p>
                </div>
              </div>
            </div>

            {/* File List */}
            {files.length > 0 && (
              <div className="space-y-2">
                {files.map((file, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <span className="text-sm text-gray-700 truncate">
                      {file.name}
                    </span>
                    <button
                      type="button"
                      onClick={() => removeFile(index)}
                      className="text-gray-500 hover:text-red-500"
                    >
                      <FiX className="h-5 w-5" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Submit Button */}
            <div className="flex justify-between">
              <button
                type="submit"
                disabled={isUploading || files.length === 0}
                className={`px-6 py-2 rounded-lg text-white font-medium ${
                  isUploading || files.length === 0
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700'
                }`}
              >
                {isUploading ? 'Uploading...' : 'Upload'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setFiles([]);
                  setTitle('');
                  setDescription('');
                  setCategory('');
                }}
                className="px-6 py-2 rounded-lg text-gray-700 font-medium bg-gray-200 hover:bg-gray-300"
              >
                Next
              </button>
            </div>
          </form>
        </div>
      </main>
      <MentaroFooter />  
    </div>
  );
}