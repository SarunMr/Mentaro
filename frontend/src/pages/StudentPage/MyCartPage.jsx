
import React, { useState } from 'react';
import MentaroNavbar from './../../components/Student/StudentNavbar.jsx';
import Navbar from './../../components/Student/Navbar.jsx';
import { Brain, Code, Database, ShoppingCart, Trash2, Plus, Minus, Star } from 'lucide-react';

const CartPage = () => {
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      title: "Python Machine Learning Bootcamp",
      instructor: "Dr. Amanda Wilson",
      icon: <Brain className="w-20 h-16 text-yellow-600" />,
      price: 99.99,
      originalPrice: 129.99,
      quantity: 1,
      rating: 4.8,
      reviews: 3241
    },
    {
      id: 2,
      title: "Full Stack Web Development",
      instructor: "Carlos Rodriguez",
      icon: <Code className="w-20 h-16 text-green-600" />,
      price: 79.99,
      originalPrice: 99.99,
      quantity: 1,
      rating: 4.6,
      reviews: 2189
    },
    {
      id: 3,
      title: "Data Science Fundamentals",
      instructor: "Dr. Sarah Kim",
      icon: <Database className="w-20 h-16 text-red-600" />,
      price: 89.99,
      originalPrice: 89.99,
      quantity: 1,
      rating: 4.7,
      reviews: 1876
    }
  ]);

  const [promoCode, setPromoCode] = useState('');
  const [discount, setDiscount] = useState(0);

  const removeFromCart = (id) => {
    setCartItems(cartItems.filter(item => item.id !== id));
  };

  const updateQuantity = (id, quantity) => {
    setCartItems(cartItems.map(item => 
      item.id === id ? { ...item, quantity } : item
    ));
  };

  const applyPromoCode = () => {
    if (promoCode.toLowerCase() === 'save20') {
      setDiscount(20);
    } else {
      setDiscount(0);
    }
  };

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const tax = subtotal * 0.1;
  const total = subtotal + tax - discount;

  return (
    <div className="min-h-screen bg-gray-50">
      <MentaroNavbar />
      <Navbar />
      
      <div className="max-w-7xl mx-auto py-6 px-6">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Cart</h1>
            <p className="text-gray-600 mt-2">
              {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'} in your cart
            </p>
          </div>
          <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
            Continue Shopping
          </button>
        </div>

        {cartItems.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border p-12 text-center">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <ShoppingCart className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Your cart is empty</h3>
            <p className="text-gray-600 mb-8">Start adding courses to your cart to begin your learning journey</p>
            <button className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
              Browse Courses
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              {cartItems.map((item) => (
                <div key={item.id} className="bg-white rounded-lg shadow-sm border p-6">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                    <div className="flex-shrink-0">
                      <div className="w-32 h-24 bg-gray-50 rounded-lg flex items-center justify-center border border-gray-200">
                        {item.icon}
                      </div>
                    </div>

                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">{item.title}</h3>
                      <p className="text-gray-600 mb-2">by {item.instructor}</p>
                      
                      <div className="flex items-center mb-3">
                        <Star className="w-4 h-4 text-yellow-400 mr-1" />
                        <span className="text-sm text-gray-600">{item.rating} ({item.reviews.toLocaleString()} reviews)</span>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <span className="text-lg font-bold text-gray-900">${item.price}</span>
                          {item.originalPrice > item.price && (
                            <span className="text-sm text-gray-500 line-through ml-2">${item.originalPrice}</span>
                          )}
                        </div>
                        
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center border rounded-lg">
                            <button
                              onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                              className="px-3 py-1 hover:bg-gray-100 transition-colors"
                            >
                              <Minus className="w-4 h-4" />
                            </button>
                            <span className="px-3 py-1 border-l border-r">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="px-3 py-1 hover:bg-gray-100 transition-colors"
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>

                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <Trash2 className="h-5 w-5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm border p-6 sticky top-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-6">Order Summary</h3>
                
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-medium">${subtotal.toFixed(2)}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Discount</span>
                      <span className="font-medium text-green-600">-${discount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tax (10%)</span>
                    <span className="font-medium">${tax.toFixed(2)}</span>
                  </div>
                  <hr className="my-4" />
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>

                <div className="mt-6 space-y-3">
                  <button className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
                    Proceed to Checkout
                  </button>
                  <button className="w-full py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                    Save for Later
                  </button>
                </div>

                <div className="mt-6 pt-6 border-t">
                  <h4 className="text-sm font-medium text-gray-900 mb-3">Promo Code</h4>
                  <div className="flex space-x-2">
                    <input 
                      type="text" 
                      placeholder="Enter code"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button 
                      onClick={applyPromoCode}
                      className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      Apply
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">Try "SAVE20" for $20 off</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;
