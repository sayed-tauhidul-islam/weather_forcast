import React, { useState, useEffect } from 'react';
import { MapPin, Navigation } from 'lucide-react';

const GPSLocation = ({ setCity, theme }) => {
  const [locating, setLocating] = useState(false);
  const [location, setLocation] = useState(null);

  const getLocation = () => {
    setLocating(true);
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          setLocation({ lat: latitude, lon: longitude });
          
          // Reverse geocode to get city name
          try {
            const response = await fetch(
              `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
            );
            const data = await response.json();
            setCity(data.city || data.locality || 'Unknown Location');
          } catch (error) {
            console.error('Geocoding error:', error);
          }
          
          setLocating(false);
        },
        (error) => {
          console.error('Location error:', error);
          setLocating(false);
        }
      );
    }
  };

  return (
    <div className={`${theme.card} p-6 rounded-2xl backdrop-blur-xl border border-white/20`}>
      <div className="flex items-center gap-2 mb-4">
        <MapPin className={theme.text} size={24} />
        <h3 className={`text-xl font-semibold ${theme.text}`}>GPS Location</h3>
      </div>
      
      {location ? (
        <div className="text-center py-4">
          <Navigation className={`${theme.text} mx-auto mb-3`} size={48} />
          <div className={`text-lg ${theme.text} mb-2`}>Location Found</div>
          <div className={`text-sm ${theme.text} opacity-70`}>
            {location.lat.toFixed(4)}°, {location.lon.toFixed(4)}°
          </div>
        </div>
      ) : (
        <button
          onClick={getLocation}
          disabled={locating}
          className={`w-full py-3 bg-gradient-to-r ${theme.accent} text-white rounded-xl font-semibold hover:scale-105 transition-transform disabled:opacity-50`}
        >
          {locating ? '🔍 Locating...' : '📍 Use My Location'}
        </button>
      )}
    </div>
  );
};

export default GPSLocation;
