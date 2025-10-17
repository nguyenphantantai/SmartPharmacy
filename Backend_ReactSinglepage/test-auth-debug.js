import jwt from 'jsonwebtoken';
import { config } from './src/config/index.ts';

// Test token creation and verification
const testUserId = '507f1f77bcf86cd799439011'; // Example ObjectId

console.log('Testing JWT token creation and verification...');
console.log('JWT Secret:', config.jwtSecret ? 'Present' : 'Missing');

// Create a test token
const token = jwt.sign(
  { userId: testUserId },
  config.jwtSecret,
  { expiresIn: '7d' }
);

console.log('Generated token:', token.substring(0, 50) + '...');

// Verify the token
try {
  const decoded = jwt.verify(token, config.jwtSecret);
  console.log('Decoded token:', decoded);
  console.log('User ID from token:', decoded.userId);
} catch (error) {
  console.error('Token verification failed:', error.message);
}

// Test with a real user token from localStorage (if available)
console.log('\n--- Testing with real token ---');

// Try to read token from frontend localStorage simulation
try {
  // This would be the token from browser localStorage
  const testRealToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NzVkYzQ4YzQ4YzQ4YzQ4YzQ4YzQ4YzQiLCJpYXQiOjE3MzUxMjM0NTYsImV4cCI6MTczNTcyODI1Nn0.test';
  
  console.log('Testing real token:', testRealToken.substring(0, 50) + '...');
  
  const decodedReal = jwt.verify(testRealToken, config.jwtSecret);
  console.log('Real token decoded:', decodedReal);
} catch (error) {
  console.log('Real token test failed (expected):', error.message);
}
