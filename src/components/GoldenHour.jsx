import React from 'react';
import { Sunrise, Sunset } from 'lucide-react';

const GoldenHour = ({ theme }) => {
  // Calculate golden hour times
  const now = new Date();
  const sunrise = new Date(now);
  sunrise.setHours(6, 30, 0);
  const goldenHourMorning = new Date(sunrise.getTime() + 30 * 60000);
  
  const sunset = new Date(now);
  sunset.setHours(18, 30, 0);
  const goldenHourEvening = new Date(sunset.getTime() - 60 * 60000);

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  const isGoldenHour = () => {
    const currentHour = now.getHours();
    return (currentHour >= 6 && currentHour < 8) || (currentHour >= 17 && currentHour < 19);
  };

  return (
    <div className={`${theme.card} p-6 rounded-2xl backdrop-blur-xl border border-white/20`}>
      <div className="flex items-center gap-2 mb-4">
        <Sunrise className={theme.text} size={24} />
        <h3 className={`text-xl font-semibold ${theme.text}`}>Golden Hour</h3>
      </div>
      
      {isGoldenHour() && (
        <div className="mb-4 p-3 bg-yellow-500/20 border border-yellow-500/30 rounded-xl">
          <div className="text-center text-yellow-400 font-semibold">
            ✨ Golden Hour Active Now! ✨
          </div>
        </div>
      )}
      
      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Sunrise className="text-orange-400" size={20} />
              <span className={`font-semibold ${theme.text}`}>Morning</span>
            </div>
            <div className={`text-sm ${theme.text} opacity-70`}>
              {formatTime(sunrise)} - {formatTime(goldenHourMorning)}
            </div>
          </div>
          <div className="text-3xl">🌅</div>
        </div>
        
        <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Sunset className="text-orange-400" size={20} />
              <span className={`font-semibold ${theme.text}`}>Evening</span>
            </div>
            <div className={`text-sm ${theme.text} opacity-70`}>
              {formatTime(goldenHourEvening)} - {formatTime(sunset)}
            </div>
          </div>
          <div className="text-3xl">🌆</div>
        </div>
      </div>
      
      <div className={`mt-4 text-center text-sm ${theme.text} opacity-70`}>
        Perfect lighting for photography
      </div>
    </div>
  );
};

export default GoldenHour;
