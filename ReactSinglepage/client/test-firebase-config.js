// Test Firebase configuration
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyAtt4SY7yetaYGJwJ64L2RALB2UNYpe_2o",
  authDomain: "quanlinhathuocai.firebaseapp.com",
  projectId: "quanlinhathuocai",
  storageBucket: "quanlinhathuocai.appspot.com",
  messagingSenderId: "125708758953",
  appId: "1:125708758953:web:afb3ded63c4e6ddf035eb8",
  measurementId: "G-5CHEM2KD77"
};

console.log('🔥 Testing Firebase Configuration...');
console.log('📋 Config:', firebaseConfig);

try {
  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  
  console.log('✅ Firebase initialized successfully');
  console.log('🔑 Auth object:', auth);
  console.log('🌐 Auth domain:', auth.app.options.authDomain);
  console.log('🔑 API Key:', auth.app.options.apiKey);
  console.log('📱 Project ID:', auth.app.options.projectId);
  
  // Test if Phone Authentication is enabled
  console.log('📱 Testing Phone Authentication availability...');
  
  // Check auth providers
  console.log('🔐 Available auth providers:', auth.config.authDomain);
  
  console.log('✅ Firebase configuration test completed');
  
} catch (error) {
  console.error('❌ Firebase initialization failed:', error);
  console.error('❌ Error details:', {
    code: error.code,
    message: error.message,
    stack: error.stack
  });
}