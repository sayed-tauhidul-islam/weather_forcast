import React from 'react';
import { Moon } from 'lucide-react';

export default function MoonPhase({ phase, theme }) {
  const getMoonIcon = (phase) => {
    if (phase < 0.125) return '🌑'; // New Moon
    if (phase < 0.25) return '🌒'; // Waxing Crescent
    if (phase < 0.375) return '🌓'; // First Quarter
    if (phase < 0.5) return '🌔'; // Waxing Gibbous
    if (phase < 0.625) return '🌕'; // Full Moon
    if (phase < 0.75) return '🌖'; // Waning Gibbous
    if (phase < 0.875) return '🌗'; // Last Quarter
    return '🌘'; // Waning Crescent
  };

  const getMoonName = (phase) => {
    if (phase < 0.125) return 'New Moon';
    if (phase < 0.25) return 'Waxing Crescent';
    if (phase < 0.375) return 'First Quarter';
    if (phase < 0.5) return 'Waxing Gibbous';
    if (phase < 0.625) return 'Full Moon';
    if (phase < 0.75) return 'Waning Gibbous';
    if (phase < 0.875) return 'Last Quarter';
    return 'Waning Crescent';
  };

  const illumination = Math.round(phase * 100);

  return (
    <div className={`${theme.card} rounded-3xl p-8 ${theme.glow} shadow-2xl border border-white/30`}>
      <h3 className={`text-2xl font-bold ${theme.text} mb-6 flex items-center gap-2`}>
        <Moon className="w-6 h-6" />
        Moon Phase
      </h3>
      <div className="text-center">
        <div className="text-8xl mb-4">{getMoonIcon(phase)}</div>
        <div className={`text-xl font-bold ${theme.text} mb-2`}>{getMoonName(phase)}</div>
        <div className={`${theme.text} opacity-70`}>{illumination}% Illuminated</div>
      </div>
    </div>
  );
}
