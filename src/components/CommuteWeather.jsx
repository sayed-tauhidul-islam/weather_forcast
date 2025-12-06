import React from 'react';
import { Briefcase, Navigation } from 'lucide-react';

const CommuteWeather = ({ theme }) => {
  const commute = {
    morning: {
      time: '08:00',
      duration: '30 min',
      weather: '☀️',
      temp: 18,
      condition: 'Clear',
      traffic: 'Moderate'
    },
    evening: {
      time: '17:30',
      duration: '35 min',
      weather: '⛅',
      temp: 22,
      condition: 'Partly Cloudy',
      traffic: 'Heavy'
    }
  };

  return (
    <div className={`${theme.card} p-6 rounded-2xl backdrop-blur-xl border border-white/20`}>
      <div className="flex items-center gap-2 mb-4">
        <Briefcase className={theme.text} size={24} />
        <h3 className={`text-xl font-semibold ${theme.text}`}>Commute Weather</h3>
      </div>
      
      <div className="space-y-4">
        <div className="p-4 bg-white/5 rounded-xl">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xl">🌅</span>
            <span className={`font-semibold ${theme.text}`}>Morning Commute</span>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <div className={`text-sm ${theme.text} opacity-70`}>Time</div>
              <div className={`font-semibold ${theme.text}`}>{commute.morning.time}</div>
            </div>
            <div>
              <div className={`text-sm ${theme.text} opacity-70`}>Duration</div>
              <div className={`font-semibold ${theme.text}`}>{commute.morning.duration}</div>
            </div>
            <div>
              <div className={`text-sm ${theme.text} opacity-70`}>Weather</div>
              <div className={`font-semibold ${theme.text}`}>
                {commute.morning.weather} {commute.morning.temp}°
              </div>
            </div>
            <div>
              <div className={`text-sm ${theme.text} opacity-70`}>Traffic</div>
              <div className={`font-semibold ${theme.text}`}>{commute.morning.traffic}</div>
            </div>
          </div>
        </div>
        
        <div className="p-4 bg-white/5 rounded-xl">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xl">🌆</span>
            <span className={`font-semibold ${theme.text}`}>Evening Commute</span>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <div className={`text-sm ${theme.text} opacity-70`}>Time</div>
              <div className={`font-semibold ${theme.text}`}>{commute.evening.time}</div>
            </div>
            <div>
              <div className={`text-sm ${theme.text} opacity-70`}>Duration</div>
              <div className={`font-semibold ${theme.text}`}>{commute.evening.duration}</div>
            </div>
            <div>
              <div className={`text-sm ${theme.text} opacity-70`}>Weather</div>
              <div className={`font-semibold ${theme.text}`}>
                {commute.evening.weather} {commute.evening.temp}°
              </div>
            </div>
            <div>
              <div className={`text-sm ${theme.text} opacity-70`}>Traffic</div>
              <div className={`font-semibold ${theme.text}`}>{commute.evening.traffic}</div>
            </div>
          </div>
        </div>
      </div>
      
      <button className={`w-full mt-4 py-2 border border-white/20 ${theme.text} rounded-xl hover:scale-105 transition-transform`}>
        <Navigation size={16} className="inline mr-2" />
        Set Commute Route
      </button>
    </div>
  );
};

export default CommuteWeather;
