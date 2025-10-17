import { initializeApp } from 'firebase/app';
import { getAuth, RecaptchaVerifier, signInWithPhoneNumber, PhoneAuthProvider, signInWithCredential } from 'firebase/auth';

// Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyAtt4SY7yetaYGJwJ64L2RALB2UNYpe_2o",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "quanlinhathuocai.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "quanlinhathuocai",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "quanlinhathuocai.appspot.com",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "125708758953",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:125708758953:web:afb3ded63c4e6ddf035eb8",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-5CHEM2KD77"
};

// Debug: Log Firebase config
console.log('🔥 Firebase Config:', firebaseConfig);
console.log('🔑 API Key:', import.meta.env.VITE_FIREBASE_API_KEY);
console.log('🌐 Auth Domain:', import.meta.env.VITE_FIREBASE_AUTH_DOMAIN);

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

// reCAPTCHA configuration
export const RECAPTCHA_SITE_KEY = import.meta.env.VITE_RECAPTCHA_SITE_KEY || "6LeTr9IrAAAAAMd7yuoAMhzMyh_3HZSzqEdrPoyS";

// Initialize reCAPTCHA verifier
export const initializeRecaptcha = (elementId: string = 'recaptcha-container') => {
  console.log('🔥 Initializing reCAPTCHA...');
  console.log('🔑 Site Key:', RECAPTCHA_SITE_KEY);
  console.log('📱 Element ID:', elementId);
  
  // Check if element exists
  const element = document.getElementById(elementId);
  if (!element) {
    console.error('❌ Element not found:', elementId);
    throw new Error(`Element with id "${elementId}" not found`);
  }
  
  console.log('✅ Element found:', element);
  
  // Clear any existing reCAPTCHA
  const existingVerifier = document.querySelector(`#${elementId} iframe`);
  if (existingVerifier) {
    existingVerifier.remove();
  }
  
  const recaptchaVerifier = new RecaptchaVerifier(auth, elementId, {
    size: 'invisible',
    callback: (response: any) => {
      console.log('✅ reCAPTCHA solved');
    },
    'expired-callback': () => {
      console.log('⏰ reCAPTCHA expired');
    },
    'error-callback': (error: any) => {
      console.error('❌ reCAPTCHA error:', error);
    }
  });
  
  console.log('✅ reCAPTCHA verifier created');
  return recaptchaVerifier;
};

// Send OTP via Firebase Phone Authentication
export const sendOTP = async (phoneNumber: string, recaptchaVerifier: RecaptchaVerifier) => {
  try {
    const confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, recaptchaVerifier);
    return {
      success: true,
      confirmationResult
    };
  } catch (error: any) {
    console.error('Error sending OTP:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

// Verify OTP
export const verifyOTP = async (confirmationResult: any, otp: string) => {
  try {
    const result = await confirmationResult.confirm(otp);
    return {
      success: true,
      user: result.user
    };
  } catch (error: any) {
    console.error('Error verifying OTP:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

export default app;
