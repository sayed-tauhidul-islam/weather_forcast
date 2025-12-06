import React, { useState } from 'react';
import { Palette } from 'lucide-react';

const CustomColors = ({ theme, setThemeMode }) => {
  const [selectedColor, setSelectedColor] = useState('#3b82f6');

  const colorPresets = [
    { name: 'Light', color: '#3b82f6', mode: 'light' },
    { name: 'Dark', color: '#1f2937', mode: 'dark' },
    { name: 'Auto', color: '#8b5cf6', mode: 'auto' },
    { name: 'Blue-Red', color: '#ef4444', mode: 'darkBlueRed' }
  ];

  const applyColor = (colorData) => {
    setSelectedColor(colorData.color);
    setThemeMode(colorData.mode);
  };

  return (
    <div className={`${theme.card} p-6 rounded-2xl backdrop-blur-xl border border-white/20`}>
      <div className="flex items-center gap-2 mb-4">
        <Palette className={theme.text} size={24} />
        <h3 className={`text-xl font-semibold ${theme.text}`}>Custom Colors</h3>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {colorPresets.map((preset) => (
          <button
            key={preset.name}
            onClick={() => applyColor(preset)}
            className={`aspect-square rounded-xl hover:scale-110 transition-transform relative ${
              selectedColor === preset.color ? 'ring-4 ring-white' : ''
            }`}
            style={{ backgroundColor: preset.color }}
          >
            <div className="absolute inset-0 flex items-center justify-center text-white font-semibold text-sm">
              {preset.name}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default CustomColors;
