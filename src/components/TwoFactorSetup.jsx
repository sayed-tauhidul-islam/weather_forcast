import React, { useState } from 'react';
import { X, Shield, Copy, Check } from 'lucide-react';
import { authAPI } from '../utils/api';

const TwoFactorSetup = ({ isOpen, onClose, theme, onSuccess }) => {
  const [step, setStep] = useState(1); // 1: QR Code, 2: Verification, 3: Backup Codes
  const [qrCode, setQrCode] = useState('');
  const [secret, setSecret] = useState('');
  const [backupCodes, setBackupCodes] = useState([]);
  const [verificationCode, setVerificationCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const startSetup = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await authAPI.enable2FA();
      if (response.success) {
        setQrCode(response.qrCode);
        setSecret(response.secret);
        setBackupCodes(response.backupCodes);
        setStep(2);
      }
    } catch (err) {
      setError(err.message || 'Failed to generate 2FA secret');
    } finally {
      setLoading(false);
    }
  };

  const verifySetup = async () => {
    if (!verificationCode || verificationCode.length !== 6) {
      setError('Please enter a valid 6-digit code');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const response = await authAPI.verify2FA(verificationCode);
      if (response.success) {
        setStep(3);
      }
    } catch (err) {
      setError(err.message || '2FA verification failed');
    } finally {
      setLoading(false);
    }
  };

  const copyBackupCodes = () => {
    const codes = backupCodes.join('\n');
    navigator.clipboard.writeText(codes);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleComplete = () => {
    onSuccess();
    onClose();
  };

  React.useEffect(() => {
    if (isOpen && step === 1) {
      startSetup();
    }
  }, [isOpen]);

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[99999] p-4">
      <div className={`${theme.card} rounded-3xl p-8 max-w-md w-full border border-white/30 shadow-2xl`} onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-6">
          <h2 className={`text-2xl font-bold ${theme.text}`}>
            🔐 Two-Factor Authentication
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

        {/* Step 1: Loading */}
        {step === 1 && (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
            <p className={`${theme.text}`}>Generating secure 2FA secret...</p>
          </div>
        )}

        {/* Step 2: Scan QR Code */}
        {step === 2 && (
          <div className="space-y-4">
            <div className="text-center">
              <p className={`${theme.text} mb-4`}>
                Scan this QR code with Google Authenticator or Authy:
              </p>
              {qrCode && (
                <img src={qrCode} alt="2FA QR Code" className="mx-auto mb-4 rounded-xl" />
              )}
              <p className={`${theme.text} text-sm opacity-70 mb-2`}>
                Or enter this code manually:
              </p>
              <code className={`${theme.card} px-4 py-2 rounded-lg text-sm ${theme.text}`}>
                {secret}
              </code>
            </div>

            <div>
              <label className={`block ${theme.text} text-sm mb-2 font-semibold`}>
                Enter 6-digit code from app:
              </label>
              <input
                type="text"
                maxLength="6"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, ''))}
                className={`w-full ${theme.card} ${theme.text} border border-white/20 rounded-xl py-3 px-4 text-center text-2xl tracking-widest focus:outline-none focus:ring-2 focus:ring-white/50`}
                placeholder="000000"
              />
            </div>

            <button
              onClick={verifySetup}
              disabled={loading || verificationCode.length !== 6}
              className={`w-full py-4 rounded-xl font-semibold transition-all bg-gradient-to-r ${theme.accent} text-white ${theme.glow} shadow-xl hover:scale-105 disabled:opacity-50 disabled:hover:scale-100`}
            >
              {loading ? 'Verifying...' : 'Verify & Enable 2FA'}
            </button>
          </div>
        )}

        {/* Step 3: Backup Codes */}
        {step === 3 && (
          <div className="space-y-4">
            <div className="bg-yellow-500/20 border border-yellow-500/50 rounded-xl p-4">
              <p className={`${theme.text} font-semibold mb-2`}>⚠️ Important!</p>
              <p className={`${theme.text} text-sm`}>
                Save these backup codes in a safe place. You can use them to access your account if you lose your phone.
              </p>
            </div>

            <div className={`${theme.card} rounded-xl p-4 border border-white/20`}>
              <div className="flex items-center justify-between mb-2">
                <h3 className={`${theme.text} font-semibold`}>Backup Codes</h3>
                <button
                  onClick={copyBackupCodes}
                  className={`p-2 hover:bg-white/10 rounded-lg transition-all`}
                  title="Copy codes"
                >
                  {copied ? (
                    <Check className="w-5 h-5 text-green-400" />
                  ) : (
                    <Copy className="w-5 h-5 text-white" />
                  )}
                </button>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {backupCodes.map((code, index) => (
                  <code key={index} className={`${theme.card} px-3 py-2 rounded-lg text-sm ${theme.text} text-center border border-white/10`}>
                    {code}
                  </code>
                ))}
              </div>
            </div>

            <div className="bg-green-500/20 border border-green-500/50 rounded-xl p-4">
              <p className={`text-green-300 font-semibold text-center`}>
                ✅ 2FA Enabled Successfully!
              </p>
            </div>

            <button
              onClick={handleComplete}
              className={`w-full py-4 rounded-xl font-semibold transition-all bg-gradient-to-r ${theme.accent} text-white ${theme.glow} shadow-xl hover:scale-105`}
            >
              Done
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TwoFactorSetup;
