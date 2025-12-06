import React from 'react';
import { TrendingUp } from 'lucide-react';

export default function WeatherCharts({ hourly, convertTemp, theme }) {
  const maxTemp = Math.max(...hourly.temperature_2m.slice(0, 24));
  const minTemp = Math.min(...hourly.temperature_2m.slice(0, 24));
  const range = maxTemp - minTemp;

  return (
    <div className={`${theme.card} rounded-3xl p-8 ${theme.glow} shadow-2xl border border-white/30`}>
      <h3 className={`text-2xl font-bold ${theme.text} mb-6 flex items-center gap-2`}>
        <TrendingUp className="w-6 h-6" />
        Temperature Trend
      </h3>
      <div className="relative h-64">
        <svg width="100%" height="100%" className="overflow-visible">
          {/* Grid lines */}
          {[0, 25, 50, 75, 100].map((percent) => (
            <line
              key={percent}
              x1="0"
              y1={`${percent}%`}
              x2="100%"
              y2={`${percent}%`}
              stroke="currentColor"
              strokeOpacity="0.1"
              className={theme.text}
            />
          ))}
          
          {/* Temperature line */}
          <polyline
            fill="none"
            stroke="url(#tempGradient)"
            strokeWidth="3"
            points={hourly.time.slice(0, 24).map((_, i) => {
              const x = (i / 23) * 100;
              const temp = hourly.temperature_2m[i];
              const y = 100 - ((temp - minTemp) / range) * 100;
              return `${x},${y}`;
            }).join(' ')}
          />
          
          {/* Gradient definition */}
          <defs>
            <linearGradient id="tempGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#3b82f6" />
              <stop offset="50%" stopColor="#f59e0b" />
              <stop offset="100%" stopColor="#ef4444" />
            </linearGradient>
          </defs>
        </svg>
        
        {/* Labels */}
        <div className="absolute top-0 left-0 text-xs opacity-70" style={{ color: theme.text }}>
          {convertTemp(maxTemp)}
        </div>
        <div className="absolute bottom-0 left-0 text-xs opacity-70" style={{ color: theme.text }}>
          {convertTemp(minTemp)}
        </div>
      </div>
    </div>
  );
}
