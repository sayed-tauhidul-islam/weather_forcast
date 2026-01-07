import CryptoJS from 'crypto-js';

const SECRET_KEY = 'weather-app-encryption-key-2026'; // In production, use env variable

export const encrypt = (data) => {
  try {
    const jsonString = JSON.stringify(data);
    const encrypted = CryptoJS.AES.encrypt(jsonString, SECRET_KEY).toString();
    return encrypted;
  } catch (error) {
    console.error('Encryption error:', error);
    return null;
  }
};

export const decrypt = (encryptedData) => {
  try {
    if (!encryptedData) return null;
    const bytes = CryptoJS.AES.decrypt(encryptedData, SECRET_KEY);
    const decryptedString = bytes.toString(CryptoJS.enc.Utf8);
    return JSON.parse(decryptedString);
  } catch (error) {
    console.error('Decryption error:', error);
    return null;
  }
};

// Secure localStorage wrapper
export const secureStorage = {
  setItem: (key, value) => {
    try {
      const encrypted = encrypt(value);
      if (encrypted) {
        localStorage.setItem(key, encrypted);
      }
    } catch (error) {
      console.error('SecureStorage setItem error:', error);
    }
  },
  
  getItem: (key) => {
    try {
      const encrypted = localStorage.getItem(key);
      return decrypt(encrypted);
    } catch (error) {
      console.error('SecureStorage getItem error:', error);
      return null;
    }
  },
  
  removeItem: (key) => {
    localStorage.removeItem(key);
  },
  
  clear: () => {
    localStorage.clear();
  }
};
