import React, { useState } from 'react';
import { X, Mail, Key } from 'lucide-react';
import { authAPI } from '../utils/api';
import { validateEmail } from '../utils/sanitizer';

const PasswordResetModal = ({ isOpen, onClose, theme }) => {
  const [step, setStep] = useState(1); // 1: Email, 2: Check Email Message
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!validateEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }
    
    setLoading(true);
    
    try {
      const response = await authAPI.forgotPassword(email);
      if (response.success) {
        setSuccess(true);
        setStep(2);
      }
    } catch (err) {
      setError(err.message || 'Failed to send reset email');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setStep(1);
    setEmail('');
    setError('');
    setSuccess(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[99999] p-4">
      <div className={`${theme.card} rounded-3xl p-8 max-w-md w-full border border-white/30 shadow-2xl`} onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-6">
          <h2 className={`text-2xl font-bold ${theme.text}`}>
            🔑 {step === 1 ? 'Reset Password' : 'Check Your Email'}
          </h2>
          <button onClick={handleClose} className={`p-2 hover:bg-white/10 rounded-xl transition-all`}>
            <X className={`w-6 h-6 ${theme.text}`} />
          </button>
        </div>

        {error && (
          <div className="bg-red-500/20 border border-red-500/50 rounded-xl p-4 mb-4">
            <p className="text-red-300 text-sm">{error}</p>
          </div>
        )}

        {step === 1 && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <p className={`${theme.text} opacity-80 mb-4`}>
              Enter your email address and we'll send you a link to reset your password.
            </p>

            <div>
              <label className={`block ${theme.text} text-sm mb-2 font-semibold`}>
                <Mail className="w-4 h-4 inline mr-2" />
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`w-full ${theme.card} ${theme.text} border border-white/20 rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-white/50`}
                placeholder="your@email.com"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-4 rounded-xl font-semibold transition-all bg-gradient-to-r ${theme.accent} text-white ${theme.glow} shadow-xl hover:scale-105 disabled:opacity-50 disabled:hover:scale-100`}
            >
              {loading ? '⏳ Sending...' : '📧 Send Reset Link'}
            </button>
          </form>
        )}

        {step === 2 && success && (
          <div className="space-y-4 text-center">
            <div className="text-6xl mb-4">📧</div>
            <p className={`${theme.text} text-lg font-semibold`}>
              Check Your Email!
            </p>
            <p className={`${theme.text} opacity-80`}>
              If an account exists for <strong>{email}</strong>, you'll receive a password reset link shortly.
            </p>
            <div className={`${theme.card} rounded-xl p-4 border border-white/20 mt-4`}>
              <p className={`${theme.text} text-sm`}>
                ⏰ The link will expire in <strong>1 hour</strong>
              </p>
            </div>
            <button
              onClick={handleClose}
              className={`w-full py-3 rounded-xl font-semibold transition-all ${theme.card} ${theme.text} border border-white/20 hover:scale-105`}
            >
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PasswordResetModal;
