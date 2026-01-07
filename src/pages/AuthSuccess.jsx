import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { setAuthToken } from '../utils/api';

const AuthSuccess = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Extract token from URL
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    const error = params.get('error');

    if (error) {
      console.error('OAuth Error:', error);
      alert('Authentication failed: ' + error);
      navigate('/');
      return;
    }

    if (token) {
      // Save token and redirect to home
      setAuthToken(token);
      
      // Show success message
      setTimeout(() => {
        window.location.href = '/';
      }, 1000);
    } else {
      console.error('No token received');
      navigate('/');
    }
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-pink-900 flex items-center justify-center">
      <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-12 text-center border border-white/30">
        <div className="animate-spin text-6xl mb-6">🔄</div>
        <h2 className="text-3xl font-bold text-white mb-4">Authentication Successful!</h2>
        <p className="text-white/70 text-lg">Redirecting you back to the app...</p>
      </div>
    </div>
  );
};

export default AuthSuccess;
