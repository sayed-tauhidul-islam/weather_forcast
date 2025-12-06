import React, { useState } from 'react';
import { Calendar as CalendarIcon, Plus } from 'lucide-react';

const CalendarIntegration = ({ theme }) => {
  const [events] = useState([
    { title: 'Team Meeting', time: '10:00 AM', weather: '☀️', temp: 22 },
    { title: 'Lunch Outdoors', time: '12:30 PM', weather: '⛅', temp: 24 },
    { title: 'Evening Run', time: '6:00 PM', weather: '☁️', temp: 20 }
  ]);

  return (
    <div className={`${theme.card} p-6 rounded-2xl backdrop-blur-xl border border-white/20`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <CalendarIcon className={theme.text} size={24} />
          <h3 className={`text-xl font-semibold ${theme.text}`}>Calendar Weather</h3>
        </div>
        <button className={`p-2 ${theme.accent} rounded-lg text-white hover:scale-105 transition-transform`}>
          <Plus size={20} />
        </button>
      </div>
      
      <div className="space-y-3">
        {events.map((event, index) => (
          <div key={index} className="p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-colors">
            <div className="flex items-center justify-between">
              <div>
                <div className={`font-semibold ${theme.text}`}>{event.title}</div>
                <div className={`text-sm ${theme.text} opacity-70`}>{event.time}</div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-2xl">{event.weather}</span>
                <span className={`text-lg font-semibold ${theme.text}`}>{event.temp}°</span>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <button className={`w-full mt-4 py-2 border border-white/20 ${theme.text} rounded-xl hover:scale-105 transition-transform`}>
        Connect Google Calendar
      </button>
    </div>
  );
};

export default CalendarIntegration;
