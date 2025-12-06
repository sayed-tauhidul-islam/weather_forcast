import React from 'react';
import { Flame } from 'lucide-react';

export default function WeatherStreaks({ streaks, theme }) {
  const streakData = [
    { type: 'Sunny Days', current: streaks?.sunny || 0, record: streaks?.sunnyRecord || 0, icon: '☀️' },
    { type: 'Rainy Days', current: streaks?.rainy || 0, record: streaks?.rainyRecord || 0, icon: '🌧️' },
    { type: 'Cold Days (<10°C)', current: streaks?.cold || 0, record: streaks?.coldRecord || 0, icon: '🥶' },
    { type: 'Hot Days (>30°C)', current: streaks?.hot || 0, record: streaks?.hotRecord || 0, icon: '🔥' },
    { type: 'Check-in Streak', current: streaks?.checkin || 0, record: streaks?.checkinRecord || 0, icon: '📅' },
  ];

  return (
    <div className={`${theme.card} rounded-3xl p-8 ${theme.glow} shadow-2xl border border-white/30`}>
      <h3 className={`text-2xl font-bold ${theme.text} mb-6 flex items-center gap-2`}>
        <Flame className="w-6 h-6" />
        Weather Streaks
      </h3>
      
      <div className="space-y-4">
        {streakData.map((streak, index) => (
          <div key={index} className={`${theme.card} rounded-2xl p-6 border border-white/20`}>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <span className="text-3xl">{streak.icon}</span>
                <span className={`text-lg font-semibold ${theme.text}`}>{streak.type}</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <div className={`text-3xl font-bold ${theme.text}`}>{streak.current}</div>
                <div className={`text-sm ${theme.text} opacity-70`}>Current Streak</div>
              </div>
              <div className="text-right">
                <div className={`text-2xl font-bold ${theme.text} opacity-70`}>{streak.record}</div>
                <div className={`text-sm ${theme.text} opacity-70`}>Record</div>
              </div>
            </div>
            {streak.current > 0 && (
              <div className="mt-3 w-full bg-white/10 rounded-full h-2 overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-purple-500 h-full rounded-full transition-all"
                  style={{ width: `${Math.min((streak.current / streak.record) * 100, 100)}%` }}
                ></div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
