import React from 'react';
import { Flower } from 'lucide-react';

const PollenCount = ({ theme }) => {
  // Mock pollen data - in production, fetch from pollen API
  const pollenData = [
    { type: 'Tree', level: 'High', value: 8, color: 'text-red-400' },
    { type: 'Grass', level: 'Moderate', value: 5, color: 'text-yellow-400' },
    { type: 'Weed', level: 'Low', value: 2, color: 'text-green-400' },
    { type: 'Mold', level: 'Low', value: 3, color: 'text-green-400' }
  ];

  return (
    <div className={`${theme.card} p-6 rounded-2xl backdrop-blur-xl border border-white/20`}>
      <div className="flex items-center gap-2 mb-4">
        <Flower className={theme.text} size={24} />
        <h3 className={`text-xl font-semibold ${theme.text}`}>Pollen Count</h3>
      </div>
      <div className="space-y-3">
        {pollenData.map((pollen, index) => (
          <div key={index} className="flex items-center justify-between">
            <span className={theme.text}>{pollen.type}</span>
            <div className="flex items-center gap-3">
              <div className="w-32 h-2 bg-white/10 rounded-full overflow-hidden">
                <div 
                  className={`h-full ${pollen.color.replace('text-', 'bg-')}`}
                  style={{ width: `${(pollen.value / 10) * 100}%` }}
                />
              </div>
              <span className={`${pollen.color} font-semibold w-20`}>{pollen.level}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PollenCount;
