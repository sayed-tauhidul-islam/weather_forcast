import React from 'react';
import { AlertTriangle, Cloud, Wind, Snowflake, Droplet } from 'lucide-react';

const SevereAlerts = ({ theme }) => {
  // Mock alerts - in production, fetch from weather alerts API
  const alerts = [
    { 
      type: 'warning', 
      title: 'Wind Advisory', 
      desc: 'Strong winds expected 20-30 mph', 
      icon: Wind,
      color: 'text-yellow-400',
      bg: 'bg-yellow-400/10'
    }
  ];

  if (alerts.length === 0) {
    return (
      <div className={`${theme.card} p-6 rounded-2xl backdrop-blur-xl border border-white/20`}>
        <div className="flex items-center gap-2 mb-4">
          <AlertTriangle className="text-green-400" size={24} />
          <h3 className={`text-xl font-semibold ${theme.text}`}>Weather Alerts</h3>
        </div>
        <div className="text-center py-4">
          <div className="text-5xl mb-2">✓</div>
          <div className={`${theme.text} opacity-70`}>No active alerts</div>
        </div>
      </div>
    );
  }

  return (
    <div className={`${theme.card} p-6 rounded-2xl backdrop-blur-xl border border-white/20`}>
      <div className="flex items-center gap-2 mb-4">
        <AlertTriangle className="text-red-400" size={24} />
        <h3 className={`text-xl font-semibold ${theme.text}`}>Weather Alerts</h3>
      </div>
      <div className="space-y-3">
        {alerts.map((alert, index) => {
          const Icon = alert.icon;
          return (
            <div key={index} className={`${alert.bg} p-4 rounded-xl border border-white/10`}>
              <div className="flex items-start gap-3">
                <Icon className={alert.color} size={24} />
                <div>
                  <div className={`font-semibold ${alert.color} mb-1`}>{alert.title}</div>
                  <div className={`text-sm ${theme.text} opacity-80`}>{alert.desc}</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SevereAlerts;
