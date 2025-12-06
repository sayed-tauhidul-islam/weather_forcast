import React from 'react';
import { Trophy, Award } from 'lucide-react';

export default function WeatherAchievements({ achievements, theme }) {
  const allAchievements = [
    { id: 1, name: 'Sunny Streak', description: '7 consecutive sunny days', icon: '☀️', unlocked: achievements?.includes(1) },
    { id: 2, name: 'Storm Watcher', description: 'Witnessed a thunderstorm', icon: '⛈️', unlocked: achievements?.includes(2) },
    { id: 3, name: 'Snow Day', description: 'Experienced snowfall', icon: '❄️', unlocked: achievements?.includes(3) },
    { id: 4, name: 'Heat Wave', description: 'Temperature above 40°C', icon: '🔥', unlocked: achievements?.includes(4) },
    { id: 5, name: 'Freeze Frame', description: 'Temperature below 0°C', icon: '🧊', unlocked: achievements?.includes(5) },
    { id: 6, name: 'Rainbow Chaser', description: 'Perfect rainbow conditions', icon: '🌈', unlocked: achievements?.includes(6) },
    { id: 7, name: 'Foggy Morning', description: 'Experienced dense fog', icon: '🌫️', unlocked: achievements?.includes(7) },
    { id: 8, name: 'Perfect Day', description: '25°C, sunny, light breeze', icon: '✨', unlocked: achievements?.includes(8) },
    { id: 9, name: 'Weather Scholar', description: 'Checked weather 30 days in a row', icon: '📚', unlocked: achievements?.includes(9) },
    { id: 10, name: 'Globe Trotter', description: 'Checked 10 different cities', icon: '🌍', unlocked: achievements?.includes(10) },
  ];

  return (
    <div className={`${theme.card} rounded-3xl p-8 ${theme.glow} shadow-2xl border border-white/30`}>
      <h3 className={`text-2xl font-bold ${theme.text} mb-6 flex items-center gap-2`}>
        <Trophy className="w-6 h-6" />
        Weather Achievements
      </h3>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {allAchievements.map((achievement) => (
          <div
            key={achievement.id}
            className={`${theme.card} rounded-2xl p-4 border border-white/20 text-center transition-all ${
              achievement.unlocked ? 'scale-100 opacity-100' : 'scale-95 opacity-40 grayscale'
            }`}
          >
            <div className="text-4xl mb-2">{achievement.icon}</div>
            <div className={`text-sm font-bold ${theme.text} mb-1`}>{achievement.name}</div>
            <div className={`text-xs ${theme.text} opacity-70`}>{achievement.description}</div>
            {achievement.unlocked && (
              <div className="mt-2">
                <Award className={`w-4 h-4 mx-auto ${theme.text}`} style={{ color: '#FFD700' }} />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
