import React, { useState, useEffect } from 'react';
import { Wifi, WifiOff } from 'lucide-react';

const OfflineMode = ({ theme }) => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [cachedData, setCachedData] = useState(null);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Load cached data from localStorage
    const cached = localStorage.getItem('weatherCache');
    if (cached) {
      setCachedData(JSON.parse(cached));
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <div className={`${theme.card} p-6 rounded-2xl backdrop-blur-xl border border-white/20`}>
      <div className="flex items-center gap-2 mb-4">
        {isOnline ? (
          <Wifi className="text-green-400" size={24} />
        ) : (
          <WifiOff className="text-red-400" size={24} />
        )}
        <h3 className={`text-xl font-semibold ${theme.text}`}>Offline Mode</h3>
      </div>
      
      <div className={`text-center py-4`}>
        <div className={`text-5xl mb-3`}>
          {isOnline ? '✓' : '📴'}
        </div>
        <div className={`text-lg font-semibold mb-2 ${
          isOnline ? 'text-green-400' : 'text-red-400'
        }`}>
          {isOnline ? 'Online' : 'Offline'}
        </div>
        <div className={`text-sm ${theme.text} opacity-70 mb-4`}>
          {isOnline 
            ? 'Real-time weather data available'
            : 'Using cached weather data'
          }
        </div>
        
        {cachedData && !isOnline && (
          <div className="p-3 bg-white/5 rounded-xl">
            <div className={`text-sm ${theme.text} opacity-70 mb-2`}>
              Last updated: {new Date(cachedData.timestamp).toLocaleTimeString()}
            </div>
            <div className={`${theme.text}`}>
              Cached data available for offline viewing
            </div>
          </div>
        )}
      </div>
      
      <button 
        className={`w-full py-3 rounded-xl font-semibold ${
          isOnline 
            ? 'bg-green-500/20 text-green-400 border border-green-500/30'
            : 'bg-red-500/20 text-red-400 border border-red-500/30'
        }`}
        disabled
      >
        {isOnline ? 'Connected' : 'Disconnected'}
      </button>
    </div>
  );
};

export default OfflineMode;
