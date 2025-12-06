import React, { useState } from 'react';
import { Bell, Plus, Trash2 } from 'lucide-react';

const CustomReminders = ({ theme }) => {
  const [reminders, setReminders] = useState([
    { id: 1, time: '07:00', condition: 'Rain', message: 'Bring an umbrella!' },
    { id: 2, time: '18:00', condition: 'Sunset', message: 'Check evening weather' }
  ]);

  const removeReminder = (id) => {
    setReminders(reminders.filter(r => r.id !== id));
  };

  return (
    <div className={`${theme.card} p-6 rounded-2xl backdrop-blur-xl border border-white/20`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Bell className={theme.text} size={24} />
          <h3 className={`text-xl font-semibold ${theme.text}`}>Custom Reminders</h3>
        </div>
        <button className={`p-2 ${theme.accent} rounded-lg text-white hover:scale-105 transition-transform`}>
          <Plus size={20} />
        </button>
      </div>
      <div className="space-y-3">
        {reminders.map((reminder) => (
          <div key={reminder.id} className="flex items-center justify-between p-3 bg-white/5 rounded-xl">
            <div>
              <div className={`font-semibold ${theme.text}`}>{reminder.time} • {reminder.condition}</div>
              <div className={`text-sm ${theme.text} opacity-70`}>{reminder.message}</div>
            </div>
            <button 
              onClick={() => removeReminder(reminder.id)}
              className="p-2 hover:bg-red-500/20 rounded-lg transition-colors"
            >
              <Trash2 className="text-red-400" size={18} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CustomReminders;
