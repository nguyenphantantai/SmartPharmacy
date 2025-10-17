// Test file to check if AuthProvider is working
import React from 'react';
import { AuthProvider } from '@/contexts/AuthContext';

function TestAuthProvider() {
  return (
    <AuthProvider>
      <div>AuthProvider is working!</div>
    </AuthProvider>
  );
}

export default TestAuthProvider;
