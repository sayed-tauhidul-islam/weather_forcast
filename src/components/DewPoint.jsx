import React from 'react';
import { Droplets } from 'lucide-react';

const DewPoint = ({ weather, theme, convertTemp }) => {
  const temp = weather?.current?.temperature_2m || 20;
  const humidity = weather?.current?.relative_humidity_2m || 50;
  
  // Calculate dew point using Magnus formula
  const a = 17.27;
  const b = 237.7;
  const alpha = ((a * temp) / (b + temp)) + Math.log(humidity / 100);
  const dewPoint = (b * alpha) / (a - alpha);

  const getComfortLevel = (dp) => {
    if (dp < 10) return { level: 'Dry', color: 'text-yellow-400', desc: 'Very comfortable' };
    if (dp < 13) return { level: 'Comfortable', color: 'text-green-400', desc: 'Pleasant' };
    if (dp < 16) return { level: 'OK', color: 'text-blue-400', desc: 'Slightly humid' };
    if (dp < 18) return { level: 'Humid', color: 'text-orange-400', desc: 'Somewhat muggy' };
    if (dp < 21) return { level: 'Muggy', color: 'text-red-400', desc: 'Uncomfortable' };
    return { level: 'Oppressive', color: 'text-red-600', desc: 'Very uncomfortable' };
  };

  const comfortInfo = getComfortLevel(dewPoint);

  return (
    <div className={`${theme.card} p-6 rounded-2xl backdrop-blur-xl border border-white/20`}>
      <div className="flex items-center gap-2 mb-4">
        <Droplets className={theme.text} size={24} />
        <h3 className={`text-xl font-semibold ${theme.text}`}>Dew Point</h3>
      </div>
      <div className="text-center">
        <div className={`text-4xl font-bold ${theme.text} mb-2`}>
          {convertTemp(dewPoint)}
        </div>
        <div className={`text-lg font-semibold ${comfortInfo.color} mb-1`}>
          {comfortInfo.level}
        </div>
        <div className={`text-sm ${theme.text} opacity-70`}>
          {comfortInfo.desc}
        </div>
      </div>
    </div>
  );
};

export default DewPoint;
