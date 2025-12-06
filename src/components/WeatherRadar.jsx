import React from 'react';
import { MapPin, Radar } from 'lucide-react';

export default function WeatherRadar({ coordinates, theme }) {
  if (!coordinates) return null;

  return (
    <div className={`${theme.card} rounded-3xl p-8 ${theme.glow} shadow-2xl border border-white/30`}>
      <h3 className={`text-2xl font-bold ${theme.text} mb-6 flex items-center gap-2`}>
        <Radar className="w-6 h-6" />
        Weather Radar
      </h3>
      <div className="relative w-full h-96 rounded-2xl overflow-hidden border border-white/20">
        <iframe
          width="100%"
          height="100%"
          src={`https://embed.windy.com/embed2.html?lat=${coordinates.lat}&lon=${coordinates.lon}&detailLat=${coordinates.lat}&detailLon=${coordinates.lon}&width=650&height=450&zoom=8&level=surface&overlay=radar&product=radar&menu=&message=&marker=&calendar=now&pressure=&type=map&location=coordinates&detail=&metricWind=default&metricTemp=default&radarRange=-1`}
          frameBorder="0"
        ></iframe>
      </div>
    </div>
  );
}
