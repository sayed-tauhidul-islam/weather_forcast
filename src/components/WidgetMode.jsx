import React, { useState } from 'react';
import { Minimize2, Maximize2 } from 'lucide-react';

const WidgetMode = ({ theme }) => {
  const [isWidget, setIsWidget] = useState(false);

  const toggleWidget = () => {
    setIsWidget(!isWidget);
    // In production, this would resize the app window or change layout
  };

  return (
    <div className={`${theme.card} p-6 rounded-2xl backdrop-blur-xl border border-white/20`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {isWidget ? <Minimize2 className={theme.text} size={24} /> : <Maximize2 className={theme.text} size={24} />}
          <h3 className={`text-xl font-semibold ${theme.text}`}>Widget Mode</h3>
        </div>
        <button
          onClick={toggleWidget}
          className={`px-4 py-2 rounded-xl font-semibold transition-all ${
            isWidget
              ? `bg-gradient-to-r ${theme.accent} text-white`
              : `${theme.card} ${theme.text} border border-white/20`
          }`}
        >
          {isWidget ? 'Full Mode' : 'Widget Mode'}
        </button>
      </div>
      <div className={`mt-4 text-sm ${theme.text} opacity-70`}>
        {isWidget ? '📱 Compact widget view' : '🖥️ Full application view'}
      </div>
    </div>
  );
};

export default WidgetMode;
