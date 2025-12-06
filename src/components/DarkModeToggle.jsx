import React from 'react';
import { Moon, Sun } from 'lucide-react';

const DarkModeToggle = ({ theme, setThemeMode, currentTheme }) => {
  const toggleDarkMode = () => {
    const isDark = currentTheme === 'dark' || currentTheme === 'darkBlueRed';
    if (isDark) {
      setThemeMode('light');
    } else {
      setThemeMode('dark');
    }
  };

  const isDark = currentTheme === 'dark' || currentTheme === 'darkBlueRed';

  return (
    <div className={`${theme.card} p-6 rounded-2xl backdrop-blur-xl border border-white/20`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {isDark ? <Moon className={theme.text} size={24} /> : <Sun className={theme.text} size={24} />}
          <h3 className={`text-xl font-semibold ${theme.text}`}>
            {isDark ? 'Dark Mode' : 'Light Mode'}
          </h3>
        </div>
        <button
          onClick={toggleDarkMode}
          className={`relative w-16 h-8 rounded-full transition-colors ${
            isDark ? 'bg-blue-600' : 'bg-yellow-400'
          }`}
        >
          <div
            className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-transform ${
              isDark ? 'translate-x-9' : 'translate-x-1'
            }`}
          />
        </button>
      </div>
      <div className={`mt-4 text-sm ${theme.text} opacity-70`}>
        {isDark ? '🌙 Night theme enabled' : '☀️ Day theme enabled'}
      </div>
    </div>
  );
};

export default DarkModeToggle;
