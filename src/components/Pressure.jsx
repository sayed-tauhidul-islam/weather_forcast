import React from 'react';
import { Gauge } from 'lucide-react';

const Pressure = ({ weather, theme }) => {
  const pressure = weather?.current?.surface_pressure || 1013;
  
  const getPressureTrend = (p) => {
    if (p > 1020) return { trend: 'Rising', icon: '↗', color: 'text-green-400', desc: 'Fair weather expected' };
    if (p > 1010) return { trend: 'Steady', icon: '→', color: 'text-blue-400', desc: 'Stable conditions' };
    return { trend: 'Falling', icon: '↘', color: 'text-orange-400', desc: 'Weather may deteriorate' };
  };

  const pressureInfo = getPressureTrend(pressure);

  return (
    <div className={`${theme.card} p-6 rounded-2xl backdrop-blur-xl border border-white/20`}>
      <div className="flex items-center gap-2 mb-4">
        <Gauge className={theme.text} size={24} />
        <h3 className={`text-xl font-semibold ${theme.text}`}>Atmospheric Pressure</h3>
      </div>
      <div className="text-center">
        <div className={`text-4xl font-bold ${theme.text} mb-2`}>
          {pressure.toFixed(1)} <span className="text-2xl">hPa</span>
        </div>
        <div className={`flex items-center justify-center gap-2 mb-2`}>
          <span className={`text-3xl ${pressureInfo.color}`}>{pressureInfo.icon}</span>
          <span className={`text-lg font-semibold ${pressureInfo.color}`}>{pressureInfo.trend}</span>
        </div>
        <div className={`text-sm ${theme.text} opacity-70`}>
          {pressureInfo.desc}
        </div>
      </div>
    </div>
  );
};

export default Pressure;
