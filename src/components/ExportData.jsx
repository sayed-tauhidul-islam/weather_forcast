import React from 'react';
import { Download, FileJson, FileText, Image } from 'lucide-react';

const ExportData = ({ weather, theme }) => {
  const exportFormats = [
    { name: 'JSON', icon: FileJson, format: 'json', color: 'text-blue-400' },
    { name: 'CSV', icon: FileText, format: 'csv', color: 'text-green-400' },
    { name: 'PDF', icon: FileText, format: 'pdf', color: 'text-red-400' },
    { name: 'Image', icon: Image, format: 'png', color: 'text-purple-400' }
  ];

  const handleExport = (format) => {
    const data = {
      location: weather?.location || 'Unknown',
      temperature: weather?.current?.temperature_2m,
      condition: weather?.current?.weather_code,
      timestamp: new Date().toISOString()
    };

    if (format === 'json') {
      const dataStr = JSON.stringify(data, null, 2);
      const blob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `weather-data-${Date.now()}.json`;
      link.click();
    }
    // Add other export formats as needed
  };

  return (
    <div className={`${theme.card} p-6 rounded-2xl backdrop-blur-xl border border-white/20`}>
      <div className="flex items-center gap-2 mb-4">
        <Download className={theme.text} size={24} />
        <h3 className={`text-xl font-semibold ${theme.text}`}>Export Weather Data</h3>
      </div>
      
      <div className="grid grid-cols-2 gap-3">
        {exportFormats.map((format) => {
          const Icon = format.icon;
          return (
            <button
              key={format.format}
              onClick={() => handleExport(format.format)}
              className="p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-all hover:scale-105"
            >
              <Icon className={`${format.color} mx-auto mb-2`} size={32} />
              <div className={`text-sm font-semibold ${theme.text}`}>{format.name}</div>
            </button>
          );
        })}
      </div>
      
      <div className={`mt-4 text-center text-sm ${theme.text} opacity-70`}>
        Export current weather data in various formats
      </div>
    </div>
  );
};

export default ExportData;
