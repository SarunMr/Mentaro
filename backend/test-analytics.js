const mongoose = require('mongoose');
const axios = require('axios');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/mentaro')
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

const BASE_URL = 'http://localhost:5000/api';

// Replace with actual admin token
const ADMIN_TOKEN = 'your_admin_token_here';

const testAnalytics = async () => {
  try {
    console.log('Testing Payment Analytics...');
    
    const response = await axios.get(`${BASE_URL}/payments/admin/analytics`, {
      headers: {
        'Authorization': `Bearer ${ADMIN_TOKEN}`
      }
    });
    
    console.log('Analytics Response:', JSON.stringify(response.data, null, 2));
  } catch (error) {
    console.error('Analytics Error:', error.response?.data || error.message);
  }
};

const testGetAllPayments = async () => {
  try {
    console.log('\nTesting Get All Payments...');
    
    const response = await axios.get(`${BASE_URL}/payments/admin/all`, {
      headers: {
        'Authorization': `Bearer ${ADMIN_TOKEN}`
      }
    });
    
    console.log('All Payments Response:', JSON.stringify(response.data, null, 2));
  } catch (error) {
    console.error('Get All Payments Error:', error.response?.data || error.message);
  }
};

const testDiscountCreation = async () => {
  try {
    console.log('\nTesting Discount Creation...');
    
    const discountData = {
      code: 'TEST50',
      type: 'percentage',
      value: 50,
      description: 'Test 50% discount',
      validFrom: new Date(),
      validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
      usageLimit: 100,
      minimumAmount: 50
    };
    
    const response = await axios.post(`${BASE_URL}/discounts`, discountData, {
      headers: {
        'Authorization': `Bearer ${ADMIN_TOKEN}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('Discount Creation Response:', JSON.stringify(response.data, null, 2));
  } catch (error) {
    console.error('Discount Creation Error:', error.response?.data || error.message);
  }
};

const testGetDiscounts = async () => {
  try {
    console.log('\nTesting Get All Discounts...');
    
    const response = await axios.get(`${BASE_URL}/discounts`, {
      headers: {
        'Authorization': `Bearer ${ADMIN_TOKEN}`
      }
    });
    
    console.log('All Discounts Response:', JSON.stringify(response.data, null, 2));
  } catch (error) {
    console.error('Get All Discounts Error:', error.response?.data || error.message);
  }
};

const runTests = async () => {
  await testAnalytics();
  await testGetAllPayments();
  await testDiscountCreation();
  await testGetDiscounts();
  
  // Close the connection
  mongoose.connection.close();
};

runTests();