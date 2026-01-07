const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

// Auth state management
let authToken = localStorage.getItem('authToken') || null;

export const setAuthToken = (token) => {
  authToken = token;
  if (token) {
    localStorage.setItem('authToken', token);
  } else {
    localStorage.removeItem('authToken');
  }
};

export const getAuthToken = () => authToken;

export const isAuthenticated = () => !!authToken;

// API request helper with error handling
const apiRequest = async (endpoint, options = {}) => {
  try {
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers
    };
    
    // Add auth token if available
    if (authToken) {
      headers['Authorization'] = `Bearer ${authToken}`;
    }
    
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || `Server error: ${response.status}`);
    }
    
    return data;
  } catch (error) {
    // Better error messages
    if (error.message.includes('fetch') || error.name === 'TypeError') {
      throw new Error('Unable to connect to API. Please check your internet connection.');
    }
    console.error('API Request Error:', error);
    throw error;
  }
};

// Weather API calls
export const weatherAPI = {
  getForecast: async (lat, lon) => {
    return apiRequest(`/weather/forecast?lat=${lat}&lon=${lon}`);
  },
  
  searchCity: async (cityName) => {
    return apiRequest(`/weather/geocoding?city=${encodeURIComponent(cityName)}`);
  },
  
  getPrayerTimes: async (lat, lon) => {
    return apiRequest(`/weather/prayer-times?lat=${lat}&lon=${lon}`);
  },
  
  reverseGeocode: async (lat, lon) => {
    return apiRequest(`/weather/reverse-geocoding?lat=${lat}&lon=${lon}`);
  }
};

// Auth API calls
export const authAPI = {
  register: async (email, password, name) => {
    const data = await apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password, name })
    });
    
    if (data.token) {
      setAuthToken(data.token);
    }
    
    return data;
  },
  
  login: async (email, password, twoFactorCode = null) => {
    const data = await apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password, twoFactorCode })
    });
    
    if (data.token) {
      setAuthToken(data.token);
    }
    
    return data;
  },
  
  logout: () => {
    setAuthToken(null);
  },
  
  getProfile: async () => {
    return apiRequest('/auth/profile');
  },
  
  updatePreferences: async (preferences) => {
    return apiRequest('/auth/preferences', {
      method: 'PUT',
      body: JSON.stringify(preferences)
    });
  },
  
  // Email Verification
  verifyEmail: async (token) => {
    return apiRequest(`/auth/verify-email/${token}`, { method: 'GET' });
  },
  
  resendVerification: async () => {
    return apiRequest('/auth/resend-verification', { method: 'POST' });
  },
  
  // Password Reset
  forgotPassword: async (email) => {
    return apiRequest('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email })
    });
  },
  
  resetPassword: async (token, password) => {
    return apiRequest(`/auth/reset-password/${token}`, {
      method: 'POST',
      body: JSON.stringify({ password })
    });
  },
  
  // Two-Factor Authentication
  enable2FA: async () => {
    return apiRequest('/auth/2fa/enable', { method: 'POST' });
  },
  
  verify2FA: async (code) => {
    return apiRequest('/auth/2fa/verify', {
      method: 'POST',
      body: JSON.stringify({ code })
    });
  },
  
  disable2FA: async (password) => {
    return apiRequest('/auth/2fa/disable', {
      method: 'POST',
      body: JSON.stringify({ password })
    });
  }
};
