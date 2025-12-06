import React, { useState } from 'react';
import { Smartphone, Bell } from 'lucide-react';

const PushNotifications = ({ theme }) => {
  const [enabled, setEnabled] = useState(false);
  const [settings, setSettings] = useState({
    rainAlerts: true,
    temperatureAlerts: false,
    severeWeather: true,
    dailyForecast: true
  });

  const requestPermission = async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        setEnabled(true);
        new Notification('Weather App', {
          body: 'Push notifications enabled!',
          icon: '☀️'
        });
      }
    }
  };

  return (
    <div className={`${theme.card} p-6 rounded-2xl backdrop-blur-xl border border-white/20`}>
      <div className="flex items-center gap-2 mb-4">
        <Smartphone className={theme.text} size={24} />
        <h3 className={`text-xl font-semibold ${theme.text}`}>Push Notifications</h3>
      </div>
      
      {!enabled ? (
        <div className="text-center py-4">
          <Bell className={`${theme.text} opacity-50 mx-auto mb-3`} size={48} />
          <div className={`text-sm ${theme.text} opacity-70 mb-4`}>
            Get instant weather alerts on your device
          </div>
          <button
            onClick={requestPermission}
            className={`px-6 py-3 bg-gradient-to-r ${theme.accent} text-white rounded-xl font-semibold hover:scale-105 transition-transform`}
          >
            Enable Notifications
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {Object.entries(settings).map(([key, value]) => (
            <div key={key} className="flex items-center justify-between p-3 bg-white/5 rounded-xl">
              <span className={theme.text}>
                {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
              </span>
              <button
                onClick={() => setSettings({...settings, [key]: !value})}
                className={`px-3 py-1 rounded-lg ${value ? 'bg-green-500' : 'bg-gray-500'} text-white text-sm`}
              >
                {value ? 'ON' : 'OFF'}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PushNotifications;
