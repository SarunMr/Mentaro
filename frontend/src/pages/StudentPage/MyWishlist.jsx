
import React, { useState } from 'react';
import MentaroNavbar from './../../components/Student/StudentNavbar.jsx';
import Navbar from './../../components/Student/Navbar.jsx';
import { 
  Heart, 
  User, 
  Star, 
  ShoppingCart,
  Code,
  Database,
  Layers,
  Container
} from 'lucide-react';

const WishlistPage = () => {
  const [wishlistItems, setWishlistItems] = useState([
    {
      id: 1,
      title: "Advanced React Patterns",
      instructor: "Jordan Kim",
      icon: <Code className="w-16 h-16 text-blue-600" />,
      price: 129.99,
      originalPrice: 159.99,
      rating: 4.9,
      reviews: 1876,
      onSale: true
    },
    {
      id: 2,
      title: "Data Science with Python",
      instructor: "Dr. Lisa Zhang",
      icon: <Database className="w-16 h-16 text-red-600" />,
      price: 89.99,
      originalPrice: 89.99,
      rating: 4.7,
      reviews: 2456,
      onSale: false
    },
    {
      id: 3,
      title: "Vue.js Complete Guide",
      instructor: "Maria Santos",
      icon: <Layers className="w-16 h-16 text-green-600" />,
      price: 79.99,
      originalPrice: 99.99,
      rating: 4.6,
      reviews: 1324,
      onSale: true
    },
    {
      id: 4,
      title: "Docker & Kubernetes",
      instructor: "Alex Thompson",
      icon: <Container className="w-16 h-16 text-purple-600" />,
      price: 109.99,
      originalPrice: 109.99,
      rating: 4.8,
      reviews: 987,
      onSale: false
    }
  ]);

  const [sortBy, setSortBy] = useState('added');

  const removeFromWishlist = (id) => {
    setWishlistItems(wishlistItems.filter(item => item.id !== id));
  };

  const addToCart = (item) => {
    alert(`Added "${item.title}" to cart!`);
  };

  const sortedItems = [...wishlistItems].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      case 'rating':
        return b.rating - a.rating;
      default:
        return 0;
    }
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <MentaroNavbar />
      <Navbar />
      
      <div className="max-w-7xl mx-auto py-6 px-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Wishlist</h1>
            <p className="text-gray-600 mt-2">
              {wishlistItems.length} {wishlistItems.length === 1 ? 'course' : 'courses'} saved for later
            </p>
          </div>
          
          {wishlistItems.length > 0 && (
            <div className="mt-4 sm:mt-0">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="added">Recently Added</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
              </select>
            </div>
          )}
        </div>

        {wishlistItems.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border p-12 text-center">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Heart className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Your wishlist is empty</h3>
            <p className="text-gray-600 mb-8">Save courses you're interested in to your wishlist</p>
            <button className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
              Browse Courses
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedItems.map((item) => (
              <div key={item.id} className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow">
                <div className="relative">
                  <div className="w-full h-48 bg-gray-50 rounded-t-lg flex items-center justify-center border-b border-gray-200">
                    {item.icon}
                  </div>
                  
                  <button
                    onClick={() => removeFromWishlist(item.id)}
                    className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-md hover:bg-gray-50 transition-colors"
                  >
                    <Heart className="h-5 w-5 text-red-500 fill-current" />
                  </button>

                  {item.onSale && (
                    <div className="absolute top-3 left-3">
                      <span className="px-2 py-1 bg-red-500 text-white text-xs font-medium rounded-full">
                        Sale
                      </span>
                    </div>
                  )}
                </div>

                <div className="p-6">
                  <h3 className="font-semibold text-lg text-gray-900 mb-2">{item.title}</h3>
                  
                  <div className="flex items-center text-sm text-gray-600 mb-3">
                    <User className="h-4 w-4 mr-2" />
                    <span>{item.instructor}</span>
                  </div>

                  <div className="flex items-center mb-4">
                    <Star className="h-4 w-4 text-yellow-400 mr-1" />
                    <span className="text-sm text-gray-600">{item.rating} ({item.reviews.toLocaleString()} reviews)</span>
                  </div>

                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <span className="text-xl font-bold text-gray-900">${item.price}</span>
                      {item.originalPrice > item.price && (
                        <span className="text-sm text-gray-500 line-through ml-2">${item.originalPrice}</span>
                      )}
                    </div>
                    {item.onSale && (
                      <span className="text-sm text-green-600 font-medium">
                        {Math.round((1 - item.price / item.originalPrice) * 100)}% OFF
                      </span>
                    )}
                  </div>

                  <div className="space-y-2">
                    <button
                      onClick={() => addToCart(item)}
                      className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center justify-center"
                    >
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      Add to Cart
                    </button>
                    <button
                      onClick={() => removeFromWishlist(item.id)}
                      className="w-full py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center"
                    >
                      <Heart className="h-4 w-4 mr-2" />
                      Remove from Wishlist
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default WishlistPage;
