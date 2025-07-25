
import React, { useState, useEffect } from 'react';
import MentaroNavbar from './../../components/Student/StudentNavbar.jsx';
import Navbar from './../../components/Student/Navbar.jsx';
import { Brain, Code, Database, ShoppingCart, Trash2, Plus, Minus, Star, BookOpen } from 'lucide-react';
import { userAPI, enrollmentAPI, discountAPI } from '../../utils/apiClient';
import { useNavigate } from 'react-router-dom';
import { getThumbnailUrl } from '../../utils/imageUtils';

const CartPage = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [promoCode, setPromoCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [discountCode, setDiscountCode] = useState('');
  const [applyingDiscount, setApplyingDiscount] = useState(false);
  const [discountError, setDiscountError] = useState('');
  const [totalPrice, setTotalPrice] = useState(0);
  const [totalItems, setTotalItems] = useState(0);

  useEffect(() => {
    fetchCartItems();
  }, []);

  const fetchCartItems = async () => {
    try {
      setLoading(true);
      const response = await userAPI.getCart();
      setCartItems(response.data.data.courses || []);
      setTotalPrice(response.data.data.totalPrice || 0);
      setTotalItems(response.data.data.totalItems || 0);
    } catch (error) {
      console.error('Error fetching cart:', error);
      setError('Failed to load cart items');
    } finally {
      setLoading(false);
    }
  };

  const removeFromCart = async (courseId) => {
    try {
      await userAPI.removeFromCart(courseId);
      const updatedItems = cartItems.filter(item => item._id !== courseId);
      setCartItems(updatedItems);
      setTotalItems(updatedItems.length);
      setTotalPrice(updatedItems.reduce((sum, item) => sum + item.price, 0));
      
      // Clear discount when items are removed as it might no longer be valid
      if (discountCode) {
        clearDiscount();
      }
    } catch (error) {
      console.error('Error removing from cart:', error);
      setError('Failed to remove item from cart');
    }
  };

  const updateQuantity = (id, quantity) => {
    // Note: Cart items don't have quantity in the current backend implementation
    // This function is kept for UI compatibility but doesn't affect backend
    setCartItems(cartItems.map(item => 
      item._id === id ? { ...item, quantity } : item
    ));
  };

  const applyPromoCode = async () => {
    if (!promoCode.trim()) {
      setDiscountError('Please enter a promo code');
      return;
    }

    setApplyingDiscount(true);
    setDiscountError('');

    try {
      const response = await discountAPI.validateDiscount(promoCode, totalPrice);
      
      if (response.data.success) {
        setDiscount(response.data.discount.discountAmount);
        setDiscountCode(response.data.discount.code);
        setDiscountError('');
      }
    } catch (error) {
      console.error('Error validating discount:', error);
      const errorMessage = error.response?.data?.message || 'Invalid promo code';
      setDiscountError(errorMessage);
      setDiscount(0);
      setDiscountCode('');
    } finally {
      setApplyingDiscount(false);
    }
  };

  const clearDiscount = () => {
    setDiscount(0);
    setDiscountCode('');
    setPromoCode('');
    setDiscountError('');
  };

  // Clear discount when cart changes
  useEffect(() => {
    if (discountCode && cartItems.length === 0) {
      clearDiscount();
    }
  }, [cartItems, discountCode]);

  const subtotal = totalPrice;
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
              {totalItems} {totalItems === 1 ? 'item' : 'items'} in your cart
            </p>
          </div>
          <button 
            onClick={() => navigate('/courses')}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Continue Shopping
          </button>
        </div>

        {loading ? (
          <div className="bg-white rounded-lg shadow-sm border p-12 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading your cart...</p>
          </div>
        ) : error ? (
          <div className="bg-white rounded-lg shadow-sm border p-12 text-center">
            <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <ShoppingCart className="h-12 w-12 text-red-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Error loading cart</h3>
            <p className="text-gray-600 mb-8">{error}</p>
            <button 
              onClick={fetchCartItems}
              className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Try Again
            </button>
          </div>
        ) : cartItems.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border p-12 text-center">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <ShoppingCart className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Your cart is empty</h3>
            <p className="text-gray-600 mb-8">Start adding courses to your cart to begin your learning journey</p>
            <button 
              onClick={() => navigate('/courses')}
              className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Browse Courses
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              {cartItems.map((item) => (
                <div key={item._id} className="bg-white rounded-lg shadow-sm border p-6">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                    <div className="flex-shrink-0">
                      <div className="w-32 h-24 bg-gray-50 rounded-lg flex items-center justify-center border border-gray-200">
                        {item.thumbnail ? (
                          <img 
                            src={getThumbnailUrl(item.thumbnail)} 
                            alt={item.title}
                            className="w-full h-full object-cover rounded-lg"
                            onError={(e) => {
                              console.log('Image failed to load:', e.target.src);
                              e.target.style.display = 'none';
                              e.target.nextSibling.style.display = 'flex';
                            }}
                          />
                        ) : null}
                        <div className={`w-16 h-16 text-gray-400 ${item.thumbnail ? 'hidden' : 'flex'} items-center justify-center`}>
                          <BookOpen className="w-16 h-16" />
                        </div>
                      </div>
                    </div>

                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">{item.title}</h3>
                      <p className="text-gray-600 mb-2">by {item.instructor?.firstName} {item.instructor?.lastName}</p>
                      
                      <div className="flex items-center mb-3">
                        <Star className="w-4 h-4 text-yellow-400 mr-1" />
                        <span className="text-sm text-gray-600">{item.rating?.average || 0} ({item.totalStudents?.toLocaleString()} students)</span>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <span className="text-lg font-bold text-gray-900">${item.price}</span>
                        </div>
                        
                        <div className="flex items-center space-x-4">
                          <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg text-sm">
                            {item.level}
                          </span>

                          <button
                            onClick={() => removeFromCart(item._id)}
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
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Discount ({discountCode})</span>
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-green-600">-${discount.toFixed(2)}</span>
                        <button
                          onClick={clearDiscount}
                          className="text-red-500 hover:text-red-700 text-xs"
                          title="Remove discount"
                        >
                          ✕
                        </button>
                      </div>
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
                  <button 
                    onClick={() => navigate('/checkout', { 
                      state: { 
                        discount: discount,
                        discountCode: discountCode
                      }
                    })}
                    className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                  >
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
                      onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      disabled={applyingDiscount}
                    />
                    <button 
                      onClick={applyPromoCode}
                      disabled={applyingDiscount || !promoCode.trim()}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                    >
                      {applyingDiscount ? 'Applying...' : 'Apply'}
                    </button>
                  </div>
                  {discountError && (
                    <p className="text-xs text-red-500 mt-2">{discountError}</p>
                  )}
                  {discountCode && (
                    <p className="text-xs text-green-600 mt-2">✓ Discount code "{discountCode}" applied successfully!</p>
                  )}
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
