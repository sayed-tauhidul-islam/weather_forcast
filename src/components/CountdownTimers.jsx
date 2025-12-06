import React, { useState, useEffect } from 'react';
import { Timer } from 'lucide-react';

const CountdownTimers = ({ theme }) => {
  const [timers, setTimers] = useState([
    { name: 'Golden Hour', target: new Date(Date.now() + 3600000 * 2), icon: '🌅' },
    { name: 'Sunset', target: new Date(Date.now() + 3600000 * 5), icon: '🌆' },
    { name: 'Next Rain', target: new Date(Date.now() + 3600000 * 8), icon: '🌧️' }
  ]);

  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const getTimeRemaining = (target) => {
    const diff = target - now;
    if (diff <= 0) return 'Now!';
    
    const hours = Math.floor(diff / 3600000);
    const minutes = Math.floor((diff % 3600000) / 60000);
    const seconds = Math.floor((diff % 60000) / 1000);
    
    return `${hours}h ${minutes}m ${seconds}s`;
  };

  return (
    <div className={`${theme.card} p-6 rounded-2xl backdrop-blur-xl border border-white/20`}>
      <div className="flex items-center gap-2 mb-4">
        <Timer className={theme.text} size={24} />
        <h3 className={`text-xl font-semibold ${theme.text}`}>Weather Countdowns</h3>
      </div>
      <div className="space-y-3">
        {timers.map((timer, index) => (
          <div key={index} className="p-4 bg-white/5 rounded-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{timer.icon}</span>
                <span className={`font-semibold ${theme.text}`}>{timer.name}</span>
              </div>
              <div className={`text-lg font-mono ${theme.text}`}>
                {getTimeRemaining(timer.target)}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CountdownTimers;
