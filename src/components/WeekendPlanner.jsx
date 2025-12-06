import React from 'react';
import { Calendar } from 'lucide-react';

const WeekendPlanner = ({ weather, theme }) => {
  const weekend = [
    {
      day: 'Saturday',
      date: 'Dec 7',
      weather: '☀️',
      high: 24,
      low: 16,
      activities: ['Beach Day', 'Outdoor Sports', 'Picnic'],
      rating: 9.5
    },
    {
      day: 'Sunday',
      date: 'Dec 8',
      weather: '⛅',
      high: 22,
      low: 15,
      activities: ['Hiking', 'Park Visit', 'BBQ'],
      rating: 8.5
    }
  ];

  const getRatingColor = (rating) => {
    if (rating >= 9) return 'text-green-400';
    if (rating >= 7) return 'text-blue-400';
    return 'text-yellow-400';
  };

  return (
    <div className={`${theme.card} p-6 rounded-2xl backdrop-blur-xl border border-white/20`}>
      <div className="flex items-center gap-2 mb-4">
        <Calendar className={theme.text} size={24} />
        <h3 className={`text-xl font-semibold ${theme.text}`}>Weekend Planner</h3>
      </div>
      
      <div className="space-y-4">
        {weekend.map((day, index) => (
          <div key={index} className="p-4 bg-white/5 rounded-xl">
            <div className="flex items-center justify-between mb-3">
              <div>
                <div className={`text-lg font-semibold ${theme.text}`}>{day.day}</div>
                <div className={`text-sm ${theme.text} opacity-70`}>{day.date}</div>
              </div>
              <div className="text-center">
                <div className="text-4xl mb-1">{day.weather}</div>
                <div className={`text-sm ${theme.text}`}>
                  {day.high}° / {day.low}°
                </div>
              </div>
            </div>
            
            <div className="mb-3">
              <div className={`text-sm ${theme.text} opacity-70 mb-2`}>Perfect for:</div>
              <div className="flex flex-wrap gap-2">
                {day.activities.map((activity, i) => (
                  <span key={i} className="px-3 py-1 bg-white/10 rounded-full text-sm text-white">
                    {activity}
                  </span>
                ))}
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <span className={`text-sm ${theme.text} opacity-70`}>Weather Score</span>
              <span className={`text-xl font-bold ${getRatingColor(day.rating)}`}>
                {day.rating}/10
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WeekendPlanner;
