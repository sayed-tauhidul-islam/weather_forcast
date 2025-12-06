import React from 'react';
import { Eye } from 'lucide-react';

const Visibility = ({ weather, theme }) => {
  const visibility = weather?.current?.visibility || 10000;
  const visibilityKm = (visibility / 1000).toFixed(1);
  
  const getVisibilityLevel = (km) => {
    if (km >= 10) return { level: 'Excellent', color: 'text-green-400', desc: 'Clear conditions' };
    if (km >= 5) return { level: 'Good', color: 'text-blue-400', desc: 'Mostly clear' };
    if (km >= 2) return { level: 'Moderate', color: 'text-yellow-400', desc: 'Some haze' };
    if (km >= 1) return { level: 'Poor', color: 'text-orange-400', desc: 'Reduced visibility' };
    return { level: 'Very Poor', color: 'text-red-400', desc: 'Hazardous conditions' };
  };

  const visInfo = getVisibilityLevel(visibilityKm);

  return (
    <div className={`${theme.card} p-6 rounded-2xl backdrop-blur-xl border border-white/20`}>
      <div className="flex items-center gap-2 mb-4">
        <Eye className={theme.text} size={24} />
        <h3 className={`text-xl font-semibold ${theme.text}`}>Visibility</h3>
      </div>
      <div className="text-center">
        <div className={`text-5xl font-bold ${visInfo.color} mb-2`}>
          {visibilityKm} km
        </div>
        <div className={`text-lg font-semibold ${theme.text} mb-1`}>
          {visInfo.level}
        </div>
        <div className={`text-sm ${theme.text} opacity-70`}>
          {visInfo.desc}
        </div>
      </div>
    </div>
  );
};

export default Visibility;
