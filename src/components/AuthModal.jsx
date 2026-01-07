import React, { useState } from 'react';
import { X, Mail, Lock, User, Eye, EyeOff } from 'lucide-react';
import { authAPI } from '../utils/api';
import { validateEmail, validatePassword } from '../utils/sanitizer';

const AuthModal = ({ isOpen, onClose, theme, onAuthSuccess, onPasswordResetClick }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    twoFactorCode: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(null);
  const [requires2FA, setRequires2FA] = useState(false);

  if (!isOpen) return null;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
    
    // Check password strength
    if (name === 'password' && !isLogin) {
      setPasswordStrength(validatePassword(value));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    // Validation
    if (!validateEmail(formData.email)) {
      setError('Please enter a valid email address');
      return;
    }
    
    if (!isLogin) {
      if (!formData.name || formData.name.length < 2) {
        setError('Name must be at least 2 characters');
        return;
      }
      
      const passValidation = validatePassword(formData.password);
      if (!passValidation.valid) {
        setError('Password must be at least 8 characters with uppercase, lowercase, and number');
        return;
      }
    }
    
    setLoading(true);
    
    try {
      let response;
      if (isLogin) {
        response = await authAPI.login(formData.email, formData.password, formData.twoFactorCode || null);
        
        // Check if 2FA is required
        if (response.requires2FA) {
          setRequires2FA(true);
          setLoading(false);
          return;
        }
      } else {
        response = await authAPI.register(formData.email, formData.password, formData.name);
      }
      
      if (response.success) {
        onAuthSuccess(response.user);
        onClose();
        setRequires2FA(false);
      }
    } catch (err) {
      setError(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[99999] p-4">
      <div className={`${theme.card} rounded-3xl p-8 max-w-md w-full border border-white/30 shadow-2xl`} onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-6">
          <h2 className={`text-3xl font-bold ${theme.text}`}>
            {isLogin ? '🔐 Login' : '✨ Sign Up'}
          </h2>
          <button onClick={onClose} className={`p-2 hover:bg-white/10 rounded-xl transition-all`}>
            <X className={`w-6 h-6 ${theme.text}`} />
          </button>
        </div>

        {error && (
          <div className="bg-red-500/20 border border-red-500/50 rounded-xl p-4 mb-4">
            <p className="text-red-300 text-sm">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div>
              <label className={`block ${theme.text} text-sm mb-2 font-semibold`}>
                <User className="w-4 h-4 inline mr-2" />
                Full Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className={`w-full ${theme.card} ${theme.text} border border-white/20 rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-white/50`}
                placeholder="John Doe"
                required
              />
            </div>
          )}

          <div>
            <label className={`block ${theme.text} text-sm mb-2 font-semibold`}>
              <Mail className="w-4 h-4 inline mr-2" />
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className={`w-full ${theme.card} ${theme.text} border border-white/20 rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-white/50`}
              placeholder="your@email.com"
              required
            />
          </div>

          <div>
            <label className={`block ${theme.text} text-sm mb-2 font-semibold`}>
              <Lock className="w-4 h-4 inline mr-2" />
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className={`w-full ${theme.card} ${theme.text} border border-white/20 rounded-xl py-3 px-4 pr-12 focus:outline-none focus:ring-2 focus:ring-white/50`}
                placeholder="••••••••"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className={`absolute right-3 top-1/2 -translate-y-1/2 p-2 hover:bg-white/10 rounded-lg transition-all`}
              >
                {showPassword ? (
                  <EyeOff className={`w-5 h-5 ${theme.text} opacity-70`} />
                ) : (
                  <Eye className={`w-5 h-5 ${theme.text} opacity-70`} />
                )}
              </button>
            </div>
            
            {!isLogin && passwordStrength && (
              <div className="mt-2 space-y-1">
                <div className={`text-xs ${passwordStrength.minLength ? 'text-green-400' : 'text-red-400'}`}>
                  {passwordStrength.minLength ? '✓' : '✗'} At least 8 characters
                </div>
                <div className={`text-xs ${passwordStrength.hasUppercase ? 'text-green-400' : 'text-red-400'}`}>
                  {passwordStrength.hasUppercase ? '✓' : '✗'} Uppercase letter
                </div>
                <div className={`text-xs ${passwordStrength.hasLowercase ? 'text-green-400' : 'text-red-400'}`}>
                  {passwordStrength.hasLowercase ? '✓' : '✗'} Lowercase letter
                </div>
                <div className={`text-xs ${passwordStrength.hasNumber ? 'text-green-400' : 'text-red-400'}`}>
                  {passwordStrength.hasNumber ? '✓' : '✗'} Number
                </div>
              </div>
            )}
          </div>

          {isLogin && requires2FA && (
            <div>
              <label className={`block ${theme.text} text-sm mb-2 font-semibold`}>
                <Lock className="w-4 h-4 inline mr-2" />
                Two-Factor Code
              </label>
              <input
                type="text"
                name="twoFactorCode"
                value={formData.twoFactorCode}
                onChange={handleInputChange}
                className={`w-full ${theme.card} ${theme.text} border border-white/20 rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-white/50 text-center text-2xl tracking-widest`}
                placeholder="000000"
                maxLength="6"
                required
              />
              <p className={`text-xs ${theme.text} opacity-70 mt-2`}>
                Enter the 6-digit code from your authenticator app
              </p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-4 rounded-xl font-semibold transition-all bg-gradient-to-r ${theme.accent} text-white ${theme.glow} shadow-xl hover:scale-105 disabled:opacity-50 disabled:hover:scale-100`}
          >
            {loading ? '⏳ Processing...' : (isLogin ? '🚀 Login' : '✨ Create Account')}
          </button>
        </form>

        {isLogin && (
          <div className="mt-4 text-center">
            <button
              onClick={() => {
                onClose();
                if (onPasswordResetClick) onPasswordResetClick();
              }}
              className={`${theme.text} opacity-70 hover:opacity-100 transition-opacity text-sm`}
            >
              Forgot Password?
            </button>
          </div>
        )}

        <div className="mt-6 text-center">
          <button
            onClick={() => {
              setIsLogin(!isLogin);
              setError('');
              setPasswordStrength(null);
              setRequires2FA(false);
            }}
            className={`${theme.text} opacity-70 hover:opacity-100 transition-opacity text-sm`}
          >
            {isLogin ? "Don't have an account? Sign up" : 'Already have an account? Login'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
