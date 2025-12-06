import React from 'react';
import { TrendingUp, Cloud, Sun, Droplets } from 'lucide-react';

const SeasonalStats = ({ theme }) => {
  const seasons = {
    winter: { temp: 8, rain: 45, sunny: 40, icon: '❄️' },
    spring: { temp: 18, rain: 35, sunny: 60, icon: '🌸' },
    summer: { temp: 28, rain: 15, sunny: 85, icon: '☀️' },
    fall: { temp: 15, rain: 40, sunny: 50, icon: '🍂' }
  };

  const currentSeason = 'winter';

  return (
    <div className={`${theme.card} p-6 rounded-2xl backdrop-blur-xl border border-white/20`}>
      <div className="flex items-center gap-2 mb-4">
        <TrendingUp className={theme.text} size={24} />
        <h3 className={`text-xl font-semibold ${theme.text}`}>Seasonal Statistics</h3>
      </div>
      
      <div className="grid grid-cols-2 gap-3">
        {Object.entries(seasons).map(([season, data]) => (
          <div 
            key={season}
            className={`p-4 rounded-xl ${
              season === currentSeason 
                ? `bg-gradient-to-r ${theme.accent} text-white` 
                : 'bg-white/5'
            }`}
          >
            <div className="text-center">
              <div className="text-3xl mb-2">{data.icon}</div>
              <div className={`font-semibold mb-2 ${season === currentSeason ? 'text-white' : theme.text}`}>
                {season.charAt(0).toUpperCase() + season.slice(1)}
              </div>
              <div className={`space-y-1 text-sm ${season === currentSeason ? 'text-white/80' : theme.text + ' opacity-70'}`}>
                <div>Avg: {data.temp}°</div>
                <div>Rain: {data.rain}%</div>
                <div>Sunny: {data.sunny}%</div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className={`mt-4 text-center text-sm ${theme.text} opacity-70`}>
        Based on historical data
      </div>
    </div>
  );
};

export default SeasonalStats;
