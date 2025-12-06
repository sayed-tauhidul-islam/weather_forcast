import React from 'react';
import { Clock, Sun, Cloud, Wind } from 'lucide-react';

const BestTimeRecommendations = ({ weather, theme }) => {
  const recommendations = [
    {
      activity: 'Morning Run',
      time: '06:00 - 08:00',
      reason: 'Cool temperature, low wind',
      icon: Sun,
      score: 9.5
    },
    {
      activity: 'Outdoor Lunch',
      time: '12:00 - 14:00',
      reason: 'Perfect temperature, sunny',
      icon: Sun,
      score: 9.0
    },
    {
      activity: 'Evening Walk',
      time: '18:00 - 20:00',
      reason: 'Pleasant weather, sunset',
      icon: Cloud,
      score: 8.5
    }
  ];

  const getScoreColor = (score) => {
    if (score >= 9) return 'text-green-400';
    if (score >= 7) return 'text-blue-400';
    return 'text-yellow-400';
  };

  return (
    <div className={`${theme.card} p-6 rounded-2xl backdrop-blur-xl border border-white/20`}>
      <div className="flex items-center gap-2 mb-4">
        <Clock className={theme.text} size={24} />
        <h3 className={`text-xl font-semibold ${theme.text}`}>Best Times Today</h3>
      </div>
      <div className="space-y-3">
        {recommendations.map((rec, index) => {
          const Icon = rec.icon;
          return (
            <div key={index} className="p-4 bg-white/5 rounded-xl">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Icon className={theme.text} size={20} />
                  <div className={`font-semibold ${theme.text}`}>{rec.activity}</div>
                </div>
                <div className={`text-lg font-bold ${getScoreColor(rec.score)}`}>
                  {rec.score}/10
                </div>
              </div>
              <div className={`text-sm ${theme.text} opacity-70 mb-1`}>
                ⏰ {rec.time}
              </div>
              <div className={`text-sm ${theme.text} opacity-60`}>
                {rec.reason}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default BestTimeRecommendations;
