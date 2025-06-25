import React, { useState } from 'react';
import { Heart, Star } from 'lucide-react';

const CourseWishlist = () => {
  const [wishlist, setWishlist] = useState([
    {
      id: 1,
      title: "Make Uber Clone App",
      instructor: "Kiran Studio",
      description: "More than 8yr Experience as Illustrator. Learn how to becoming professional Illustrator Now...",
      rating: 4.5,
      reviews: "1.2K",
      currentPrice: "$24.92",
      originalPrice: "$32.90",
      image: "/api/placeholder/300/200",
      category: "App Dev",
      level: "All Levels",
      badgeColor: "bg-blue-500"
    },
    {
      id: 2,
      title: "Mobile Dev React Native",
      instructor: "Kiran Studio",
      description: "More than 8yr Experience as Illustrator. Learn how to becoming professional Illustrator Now...",
      rating: 4.5,
      reviews: "1.2K",
      currentPrice: "$24.92",
      originalPrice: "$32.90",
      image: "/api/placeholder/300/200",
      category: "Mobile Dev",
      level: "All Levels",
      badgeColor: "bg-green-500"
    },
    {
      id: 3,
      title: "Vue Javascript Course",
      instructor: "Kiran Studio",
      description: "More than 8yr Experience as Illustrator. Learn how to becoming professional Illustrator Now...",
      rating: 4.5,
      reviews: "1.2K",
      currentPrice: "$24.92",
      originalPrice: "$32.90",
      image: "/api/placeholder/300/200",
      category: "Vue JS",
      level: "All Levels",
      badgeColor: "bg-orange-500"
    },
    {
      id: 4,
      title: "Learn Programming in 30 Days",
      instructor: "Kiran Studio",
      description: "More than 8yr Experience as Illustrator. Learn how to becoming professional Illustrator Now...",
      rating: 4.5,
      reviews: "1.2K",
      currentPrice: "$24.92",
      originalPrice: "$32.90",
      image: "/api/placeholder/300/200",
      category: "Programming",
      level: "All Levels",
      badgeColor: "bg-blue-600"
    },
    {
      id: 5,
      title: "UI Design for Beginners",
      instructor: "Kiran Studio",
      description: "More than 8yr Experience as Illustrator. Learn how to becoming professional Illustrator Now...",
      rating: 4.5,
      reviews: "1.2K",
      currentPrice: "$24.92",
      originalPrice: "$32.90",
      image: "/api/placeholder/300/200",
      category: "UI Design",
      level: "All Levels",
      badgeColor: "bg-red-500"
    },
    {
      id: 6,
      title: "iOS Development with Swift 5",
      instructor: "Kiran Studio",
      description: "More than 8yr Experience as Illustrator. Learn how to becoming professional Illustrator Now...",
      rating: 4.5,
      reviews: "1.2K",
      currentPrice: "$24.92",
      originalPrice: "$32.90",
      image: "/api/placeholder/300/200",
      category: "iOS Dev",
      level: "All Levels",
      badgeColor: "bg-yellow-500"
    },
    {
      id: 7,
      title: "Website Dev Zero to Hero",
      instructor: "Kiran Studio",
      description: "More than 8yr Experience as Illustrator. Learn how to becoming professional Illustrator Now...",
      rating: 4.5,
      reviews: "1.2K",
      currentPrice: "$24.92",
      originalPrice: "$32.90",
      image: "/api/placeholder/300/200",
      category: "Web Dev",
      level: "All Levels",
      badgeColor: "bg-purple-500"
    },
    {
      id: 8,
      title: "Development Bootcamp",
      instructor: "Kiran Studio",
      description: "More than 8yr Experience as Illustrator. Learn how to becoming professional Illustrator Now...",
      rating: 4.5,
      reviews: "1.2K",
      currentPrice: "$24.92",
      originalPrice: "$32.90",
      image: "/api/placeholder/300/200",
      category: "Bootcamp",
      level: "All Levels",
      badgeColor: "bg-teal-500"
    }
  ]);

  const removeFromWishlist = (courseId) => {
    setWishlist(wishlist.filter(course => course.id !== courseId));
  };

  const CourseCard = ({ course }) => {
    return (
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl hover:scale-105">
        <div className="relative">
          <div className={`absolute top-4 left-4 ${course.badgeColor} text-white px-3 py-1 rounded-full text-sm font-medium z-10`}>
            {course.category}
          </div>
          <div className="absolute top-4 right-4 bg-white bg-opacity-90 text-gray-700 px-3 py-1 rounded-full text-sm font-medium z-10">
            {course.level}
          </div>
          <button 
            onClick={() => removeFromWishlist(course.id)}
            className="absolute top-4 right-4 bg-white bg-opacity-90 p-2 rounded-full hover:bg-red-50 transition-colors z-10"
          >
            <Heart className="w-5 h-5 text-red-500 fill-current" />
          </button>
          <div className="h-48 bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
            <div className="text-gray-500 text-lg font-medium">Course Image</div>
          </div>
        </div>
        
        <div className="p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">
            {course.title}
          </h3>
          
          <div className="flex items-center mb-3">
            <span className="text-sm text-gray-600">By {course.instructor}</span>
          </div>
          
          <p className="text-gray-600 text-sm mb-4 line-clamp-3">
            {course.description}
          </p>
          
          <div className="flex items-center mb-4 space-x-2">
            <div className="flex items-center">
              <Star className="w-4 h-4 text-yellow-400 fill-current" />
              <span className="ml-1 text-sm font-medium text-gray-900">{course.rating}</span>
            </div>
            <span className="text-gray-400">•</span>
            <span className="text-sm text-gray-600">({course.reviews})</span>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-2xl font-bold text-gray-900">
                {course.currentPrice}
              </span>
              <span className="text-lg text-gray-500 line-through">
                {course.originalPrice}
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">My Course Wishlist</h1>
          <p className="text-xl text-gray-600">
            {wishlist.length} {wishlist.length === 1 ? 'course' : 'courses'} in your wishlist
          </p>
        </div>
        
        {wishlist.length === 0 ? (
          <div className="text-center py-16">
            <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-2xl font-medium text-gray-900 mb-2">Your wishlist is empty</h3>
            <p className="text-gray-600 mb-8">Start adding courses you're interested in!</p>
            <button className="bg-blue-600 text-white px-8 py-3 rounded-full font-medium hover:bg-blue-700 transition-colors">
              Explore Courses
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {wishlist.map((course) => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>
            
            <div className="text-center mt-12">
              <button className="bg-blue-600 text-white px-8 py-3 rounded-full font-medium hover:bg-blue-700 transition-colors shadow-lg">
                Explore More Courses
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default CourseWishlist;